import { Utils } from "./classes/utils";
import { PostsService } from "./classes/posts-service";
import { Post } from "./interfaces/post";
import { CommentsResponse } from "./interfaces/responses";
import { UserService } from "./classes/user-service";

const utils = new Utils();
const postsService = new PostsService();
const logout = document.getElementById("logout");
const container = document.getElementById("cardContainer");
const commentForm = document.getElementById("commentForm");
let comments: CommentsResponse;
const userService = new UserService();

/*function createDetail(post: Post): void {
    console.log(post);
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
    avatar.src = post.creator.avatar;
    col1.append(avatar);

    const col2 = document.createElement("div");
    col2.classList.add("col");
    const userName = document.createElement("div");
    userName.classList.add("name");
    userName.innerText = post.creator.name.toString();
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
    if(!post.mine) deletebtn.classList.add("d-none");
    deletebtn.append("Delete");

    deletebtn.addEventListener("click", async () => {
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
    const small = document.createElement("small");
    small.classList.add("text-muted", "likes");

    let likesString = (post.totalLikes == 1 || post.totalLikes == -1) ? " like": " likes";
    let totalLikes = post.totalLikes;
    small.innerText = totalLikes + likesString;

    like.addEventListener("click", async () => {
        if (post.likes === null || post.likes === false) { // like not selected
            await postsService.postVote(post.id, true);// as Vote.likes);//Vote.likes//true
            totalLikes = (post.likes === null) ? totalLikes +=1: totalLikes +=2;
            post.likes = true;
            likesString = (totalLikes == 1 || totalLikes == -1) ? " like": " likes";
            small.innerText = totalLikes + likesString;
        } else { // Already selected
            await postsService.deleteVote(post.id);
            post.likes = null;
            totalLikes -= 1;
            likesString = (totalLikes == 1 || totalLikes == -1) ? " like": " likes";
            small.innerText = totalLikes + likesString;
        }
        like.classList.toggle("text-primary");
        dislike.classList.remove("text-danger");
    });
    dislike.addEventListener("click", async () => {
        if (post.likes === true || post.likes === null) { // dislike not selected
            await postsService.postVote(post.id, false);// , false);
            totalLikes = (post.likes === null) ? totalLikes -=1: totalLikes -=2;
            post.likes = false;
            likesString = (totalLikes == 1 || totalLikes == -1) ? " like": " likes";
            small.innerText = totalLikes + likesString;
        } else { // Already selected
            await postsService.deleteVote(post.id);
            post.likes = null;
            totalLikes += 1;
            likesString = (totalLikes == 1 || totalLikes == -1) ? " like": " likes";
            small.innerText = totalLikes + likesString;
        }
        like.classList.remove("text-primary");
        dislike.classList.toggle("text-danger");
    });

    likesDiv.append(small);
    col3.append(like, dislike, likesDiv);

    row.append(col1, col2, col, col3);

    cardFooter.append(row);
    card.append(cardFooter);

    container!.append(card);

}*/

utils.checkToken();

logout?.addEventListener("click", () => {
    localStorage.setItem("token", "");
});

const idUrl = document.location.href.split("=")[1];

postsService.get(idUrl).then(postsResp => {
    const post = postsResp as Post;
    container!.replaceChildren();
    const choosenPost =post.post;
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

commentForm?.addEventListener("submit", async () => {
    const text = document.getElementById("comment") as HTMLInputElement;
    await postsService.postComment(idUrl, text.value);
});