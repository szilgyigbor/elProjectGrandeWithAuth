﻿import React from 'react';
import { baseUrl } from './BaseUrl';

export function CommentComponent(post, getAllPosts) {

    async function AddLikeToComment(commentId) {
        await fetch(`${baseUrl()}api/addLikeToComment/${commentId}`)
        getAllPosts();
    }

    async function AddDislikeToComment(commentId) {
        await fetch(`${baseUrl()}api/addDislikeToComment/${commentId}`)
        getAllPosts();
    }

    async function DeleteComment(commentId) {
        await fetch(`${baseUrl()}api/deleteComment/${commentId}`)
        getAllPosts();
    }

    return (
        <div className="comments">
            <h4>Comments</h4>
            {post.commentList.map((comment, index) =>
                < div className="comment" key={index} >
                    <p className="comment-content"> {comment.content} </p>
                    <p className="comment-like-text">Likes: {comment.likeCount}, Dislikes: {comment.dislikeCount}</p>
                    <div className="comment-btns">
                        <button className="add-comment-like-btn" type="button" onClick={() => AddLikeToComment(comment.id)}>Like</button>
                        <button className="add-comment-dislike-btn" type="button" onClick={() => AddDislikeToComment(comment.id)}>Dislike</button>
                        <button className="delete-comment-btn" type="button" onClick={() => DeleteComment(comment.id)}>Delete Comment</button>
                    </div>
                </div>
            )}
        </div>
        );
}