import { Utils } from "./classes/utils";
import { PostsService } from "./classes/posts-service";
import { Post } from "./interfaces/post";
import { CommentResponse, CommentsResponse } from "./interfaces/responses";
import { UserService } from "./classes/user-service";

const utils = new Utils();
const postsService = new PostsService();
const logout = document.getElementById("logout");
const container = document.getElementById("cardContainer");
const commentForm = document.getElementById("commentForm");
let comments: CommentsResponse;
const userService = new UserService();

utils.checkToken();

logout?.addEventListener("click", () => {
    localStorage.setItem("token", "");
});

const idUrl = document.location.href.split("=")[1];

postsService.get(idUrl).then(postsResp => {
    const post = postsResp as Post;
    container!.replaceChildren();
    const choosenPost = post.post;
    container!.append(utils.createpostDetail(document, post.post));
});

postsService.getComments(idUrl).then(commentsResp => {
    const ulIni = document.getElementById("comments");
    comments = commentsResp as CommentsResponse;
    console.log(comments.comments);
    comments.comments.forEach(c => {
        console.log(c);
        const li = document.createElement("li");
        const img = document.createElement("img");
        const div = document.createElement("div");
        const divName = document.createElement("div");
        const strong = document.createElement("strong");
        const divDate = document.createElement("div");
        const small = document.createElement("small");
        li.classList.add("list-group-item", "d-flex", "flex-row");
        img.classList.add("rounded-circle", "align-self-start", "me-3");
        img.src=c.user.avatar;
        img.alt;
        small.classList.add("text-muted");
        const name: string = c.user.name + ": ";
        strong.append(name);
        divName.append(strong);
        divName.append(c.text);
        const formatter = Intl.DateTimeFormat("en", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "numeric", minute: "numeric"
        });
        small.innerText = formatter.format(new Date(c.date));
        divDate.append(small);
        div.append(divName);
        div.append(divDate);
        li.append(img);
        li.append(div);
        ulIni!.append(li);
        li.addEventListener("click", async () => {
            const uId: string = c.user.id;
            await userService.getUser(uId).then(resp => {
                if(resp.user.me)
                    location.assign("profile.html");
                else
                    location.assign("profile.html?id="+c.user.id);
            });
        });
    });
}).catch(error => {
    console.log(error);
});

commentForm!.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    const text = (<HTMLInputElement>document.getElementById("comment")).value;
    await postsService.postComment(idUrl, {text}).then(result => {
        const ulIni = document.getElementById("comments");
        const c = result as CommentResponse;
        console.log(c.comment);
        const li = document.createElement("li");
        const img = document.createElement("img");
        const div = document.createElement("div");
        const divName = document.createElement("div");
        const strong = document.createElement("strong");
        const divDate = document.createElement("div");
        const small = document.createElement("small");
        li.classList.add("list-group-item", "d-flex", "flex-row");
        img.classList.add("rounded-circle", "align-self-start", "me-3");
        img.src=c.comment.user.avatar; //avatar
        img.alt;
        small.classList.add("text-muted");
        const name: string = c.comment.user.name + ": ";
        strong.append(name);
        divName.append(strong);
        divName.append(c.comment.text);
        const formatter = Intl.DateTimeFormat("en", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "numeric", minute: "numeric"
        });
        small.innerText = formatter.format(new Date(c.comment.date));
        divDate.append(small);
        div.append(divName);
        div.append(divDate);
        li.append(img);
        li.append(div);
            ulIni!.append(li);
            li.addEventListener("click", async () => {
                const uId: string = c.comment.user.id;
                await userService.getUser(uId).then(resp => {
                    if(resp.user.me)
                        location.assign("profile.html");
                    else
                        location.assign("profile.html?id="+c.comment.user.id);
                });
            });
            (<HTMLInputElement>document.getElementById("comment")).value = "";
            console.log((<HTMLInputElement>document.getElementById("comment")).value);
    }).catch(error => 
        console.log(error)
    );
});