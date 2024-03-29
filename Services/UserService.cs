﻿using System.Runtime.InteropServices;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.Security.Principal;
using Microsoft.EntityFrameworkCore;
using WarThunderForum.Models;
using WarThunderForum.Models.User;

namespace WarThunderForum.Services
{
    public class UserService
    {
        private readonly WarThunderContext _context;
        private PasswordHasher<User> PasswordHasher { get; }

        public UserService(WarThunderContext context)
        {
            _context = context;
            PasswordHasher = new PasswordHasher<User>();
        }

        public async Task CreateUser(Registration registrationData)
        {
            if (await RegistrationIsValid(registrationData) is false)
            {
                throw new ArgumentException("Registration data is invalid.", nameof(registrationData));
            }

            var user = new User()
            {
                Username = registrationData.Username,
                Email = registrationData.Email
            };

            user.PasswordHash = PasswordHasher.HashPassword(user, registrationData.Password);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

        }

        public async Task<IEnumerable<Claim>> CreateClaims(Login loginData)
        {

            var account = await GetUserByUsername(loginData.Username);

            var claims = new List<Claim>
            {
                new (ClaimTypes.Name, account.Username),
                new (ClaimTypes.Email, account.Email),
                new ("UserId", account.Id.ToString()),
            };

            return claims;
        }

        private async Task<User?> GetUserByUsername(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(a => a.Username == username);
        }

        public async Task<bool> LoginIsValid(Login loginData)
        {
            var user = await GetUserByUsername(loginData.Username);
            if (user == null)
            {
                return false;
            }

            var result = PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, loginData.Password);
            return result == PasswordVerificationResult.Success;

        }

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id  == userId);
        }

        private async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(a => a.Email == email);
        }



        public async Task<bool> RegistrationIsValid(Registration registrationData)
        {
            return registrationData.Password == registrationData.ConfirmPassword
                   && await GetUserByUsername(registrationData.Username) is null
                   && await GetUserByEmail(registrationData.Email) is null;
        }


    }
}
