"use strict";

import { PostsService } from "./classes/posts-service.js";
import { Post } from "./interfaces/post.ts";
import { PostsResponse } from "./interfaces/responses.ts";
import { Vote } from "./interfaces/vote.ts";

let posts: PostsResponse;
const postsService = new PostsService();
const container = document.getElementById("postContainer");

function addPost(post: Post): void {
    const card = document.createElement("div");
    card.classList.add("card", "mb-4", "shadow");
    switch (post.mood) {
    case 1:
        card.classList.add("border-success");
        break;
    case 2:
        card.classList.add("border-danger");
    }

    if (post.image) {
        const img = document.createElement("img");
        img.src = post.image;
        img.classList.add("card-img-top");
        card.append(img);
    }

    if (post.title || post.description) {
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.append(cardBody);

        if (post.title) {
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.innerText = post.title;
            cardBody.append(cardTitle);
        }

        if (post.description) {
            const cardText = document.createElement("div");
            cardText.classList.add("card-text");
            cardText.innerText = post.description;
            cardBody.append(cardText);
        }
    }

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "bg-transparent");
    const row = document.createElement("div");
    row.classList.add("row");


    const col1 = document.createElement("div");
    col1.classList.add("col-auto", "avatar", "ps-1", "pe-1");
    const avatar = document.createElement("img");
    avatar.classList.add("rounded-circle");
    avatar.src = "img/avatar.png";
    col1.append(avatar);

    const col2 = document.createElement("div");
    col2.classList.add("col");
    const userName = document.createElement("div");
    userName.classList.add("name");
    userName.innerText = "Bad guy";
    const divDate = document.createElement("div");
    const date = document.createElement("small");
    date.classList.add("text-muted");
    const formatter = Intl.DateTimeFormat("en", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "numeric", minute: "numeric"
    });
    date.innerText = formatter.format(new Date(post.date));
    divDate.append(date);
    col2.append(userName);
    col2.append(divDate);

    const col = document.createElement("div");
    col.classList.add("col-auto");
    const deletebtn = document.createElement("button");
    deletebtn.classList.add("btn", "btn-danger", "mr-3", "h-100", "delete");
    deletebtn.append("Delete");

    deletebtn.addEventListener("click", async() => {
        await postsService.deletePost(post.id);
        deletebtn.parentElement!.parentElement!.parentElement!.parentElement!.style.display = "none";
    });

    col.append(deletebtn);

    const col3 = document.createElement("div");
    col3.classList.add("col-auto", "pt-2");
    const like = document.createElement("i");
    like.classList.add("far", "fa-thumbs-up", "me-3");
    if (post.likes === true) like.classList.add("text-primary");
    const dislike = document.createElement("i");
    dislike.classList.add("far", "fa-thumbs-down");
    if (post.likes === false) dislike.classList.add("text-danger");
    const likesDiv = document.createElement("div");
    likesDiv.classList.add("mt-1");

    like.addEventListener("click", async () => {
        if (post.likes === null || post.likes === false) { // like not selected
            await postsService.postVote(post.id, true);// as Vote.likes);//Vote.likes//true
            post.likes = true;
        } else { // Already selected
            await postsService.deleteVote(post.id);
            post.likes = null;
        }
        like.classList.toggle("text-primary");
        dislike.classList.remove("text-danger");
    });
    dislike.addEventListener("click", async () => {
        if (post.likes === true || post.likes === null) { // dislike not selected
            await postsService.postVote(post.id, false);// , false);
            post.likes = false;
        } else { // Already selected
            await postsService.deleteVote(post.id);
            post.likes = null;
        }
        like.classList.remove("text-primary");
        dislike.classList.toggle("text-danger");
    });

    col3.append(like, dislike);

    row.append(col1, col2, col, col3);

    cardFooter.append(row);
    card.append(cardFooter);

    container!.append(card);
}

function showPosts(posts: Array<Post>): void {
    container!.replaceChildren();
    posts.forEach(p => addPost(p));
}

postsService.getAll().then(postsResp => {
    posts = postsResp as PostsResponse;
    showPosts(posts.posts);//posts
});

document.getElementById("search")!.addEventListener("input", e => {
    const text = (<HTMLInputElement>e.target)!.value;
    if(text) {
        const filteredPosts = posts.posts.filter(p => {
            return (p.title && p.title.toLocaleLowerCase().includes(text.toLocaleLowerCase())) || 
                 (p.description && p.description.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
        });
        showPosts(filteredPosts);
    } else {
        showPosts(posts.posts);
    }
});
