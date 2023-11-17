import { Coordinates } from "../interfaces/coordinates";
import { UserService } from "./user-service";
import { Post } from "../interfaces/post";
import { PostsService } from "./posts-service";
import { CommentsResponse } from "../interfaces/responses";
import { MyGeolocation } from "./my-geolocation";
import { MapService } from "./map-service";

const userService = new UserService();
const postsService = new PostsService();

let comments: CommentsResponse;

export class Utils {

    createHiddenFields(formName: string): void {
        const form = document.getElementById(formName);
        const lat = document.createElement("input");
        lat.type="hidden";
        const lng = document.createElement("input");
        lng.type="hidden";
        lat.id = "lat";
        lng.id = "lng";
        lat.value = "0";
        lng.value = "0";
        form!.append(lat);
        form!.append(lng);
    }
    
    coordinatesMap(coords: Coordinates): void {
        const lat = document.getElementById("lat");
        const lng = document.getElementById("lng");
        (<HTMLInputElement>lat).value = coords.latitude.toString();
        (<HTMLInputElement>lng).value = coords.longitude.toString();
        //console.log(lat, lng);
    }

    checkToken(): void {//(token: string)
        userService.getToken().catch(error => {
            location.assign("login.html");
        });
    }

    createpostDetail(document: Document ,post: Post): HTMLDivElement {
        console.log("->",post);
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

        userName.addEventListener("click", () => {
            location.assign("profile.html?id=" + post.creator.id);
        });
    
        avatar.addEventListener("click", () => {
            location.assign("profile.html?id=" + post.creator.id);
        });

        const col = document.createElement("div");
        col.classList.add("col-auto");
        const deletebtn = document.createElement("button");
        deletebtn.classList.add("btn", "btn-danger", "mr-3", "h-100", "delete");
        if(!post.mine) deletebtn.classList.add("d-none");
        deletebtn.append("Delete");

        deletebtn.addEventListener("click", async () => {
            await postsService.deletePost(post.id);
            if(document.location.href.split("=")[1]) {
                location.assign("index.html");
            } else {
            deletebtn.parentElement!.parentElement!.parentElement!.parentElement!.style.display = "none";
            }
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

        //container!.append(card);

        return card;
    }

    async showMap(lat: number, lng: number): Promise<void> {
        const coords: Coordinates = {latitude: lat, longitude: lng};
        const mapsService = await MapService.createMapService(coords, "map");
        const marker = mapsService.createMarker(coords, "red");
    }
}