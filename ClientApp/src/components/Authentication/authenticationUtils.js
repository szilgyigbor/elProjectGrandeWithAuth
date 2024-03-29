﻿export async function requestJwtToken(username, password) {
    const url = "api/authentication/authenticate";

    const credentials = {
        "username": username,
        "password": password
    };

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
    };

    const response = await fetch(url, options);

    return response;
}


export async function requestAccountRegistration(username, email, password, confirmPassword) {
    const url = "api/authentication/register";

    const credentials = {
        "username": username,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword
    };

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
    };

    const response = await fetch(url, options);

    return response;
}


export function saveJwtToken(token, expiresAt) {
    sessionStorage.setItem("jwt", token);
    sessionStorage.setItem("jwtExpiresAt", new Date(expiresAt).toUTCString());
}


export function deleteJwtToken() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwtExpiresAt");
}


const isLoggedIn = () => {
    return sessionStorage.getItem("jwt") !== null;
}


export const getJwtToken = () => {
    return sessionStorage.getItem("jwt");
}


export const getUserFromJwt = () => {
    if (isLoggedIn() !== true) {
        return null;
    }

    const nameHeader = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
    const idHeader = "UserId";
    const tokenData = parseJwt(sessionStorage.getItem("jwt"));
    return { name: tokenData[nameHeader], id: tokenData[idHeader] };
}


function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export async function authorizedFetch(url, options = null) {
    if (!isLoggedIn()) {
        throw "No signed in user token is present!";
    }

    var authorizationHeader = "Bearer " + getJwtToken();

    if (options === null) {
        options = {
            headers: {
                'Authorization': authorizationHeader
            }
        }
    }
    else {
        if (options.headers == null) {
            options['headers'] = {}
        }

        options['headers']['Authorization'] = authorizationHeader;
    }

    return fetch(url, options);
}


export async function authorizedPostFetch(url, data) {

    var authorizationHeader = "Bearer " + getJwtToken();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': authorizationHeader,
        },
        body: JSON.stringify(data)
    })

    return response;
}