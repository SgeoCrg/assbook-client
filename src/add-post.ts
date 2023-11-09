"use strict";

import { PostsService } from "./classes/posts-service.ts";
//import { Post } from "./interfaces/post.ts";
import { MapService } from "./classes/map-service.ts";

const postsService = new PostsService();
const mapServices = new MapService();
const newPostForm = document.getElementById("newPlace") as HTMLFormElement;
const errorMsg = document.getElementById("errorMsg");
const imgPreview = document.getElementById("imgPreview");
//const place = document.getElementById("place");
//const locationContainer = document.getElementById("location-container");

async function validateForm(event: Event) {
    event.preventDefault();
    const place = newPostForm.place.value.trim();
    const title = newPostForm.title.value.trim();
    const image: string = newPostForm.image.value ? (<HTMLImageElement>imgPreview).src : "";
    const description = newPostForm.description.value.trim();
    const mood = +newPostForm.mood.value;
    const lat = +newPostForm.lat.value;
    const lng = +newPostForm.lng.value;

    if (!title && !description && (!image && !place)) {
        errorMsg!.classList.remove("hidden");
        setTimeout(() => errorMsg!.classList.add("hidden"), 3000);
    } else {
        try {
            if(image == "") {
                console.log(title, description, mood, lat, lng, place);
                await postsService.post({
                    "title": title, 
                    "description": description,
                    "mood": mood, 
                    "lat": lat, 
                    "lng": lng, 
                    "place": place});
            } else {
                await postsService.post({title, image, description, mood});
            }
            location.assign("index.html");
        } catch(e) {
            alert("Error adding the post");
            console.error(e);
        }
    }
}

const radioButGroup = document.getElementsByName("type");
for(let i = 0; i < radioButGroup.length; i++) {
    radioButGroup[i].addEventListener("change", e => {
        if((<HTMLInputElement>e.srcElement!).id==="postLocation") {
            document.getElementById("photo-group")!.classList.add("d-none");
            document.getElementById("location-group")!.classList.remove("d-none");
            mapServices.showMap();//getMap()
        } else {
            document.getElementById("photo-group")!.classList.remove("d-none");
            document.getElementById("location-group")!.classList.add("d-none");
        }
    } );
} 

function loadImage(event: Event) {
    const file = (event.target)!.files[0];
    const reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        (<HTMLImageElement>imgPreview).classList.remove("d-none");
        (<HTMLImageElement>imgPreview).src = reader.result;
    });
}

function createScript() {
    const script = document.createElement("script");
    //let body = document.getElementsByTagName("body");
    script.src="http://www.bing.com/api/maps/mapcontrol?callback=showMap";//=getMap
    script.defer = true;
    document.body.append(script);
}

function createHiddenFields() {
    const form = document.getElementById("newPlace");
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

newPostForm.image.addEventListener("change", loadImage);
newPostForm!.addEventListener("submit", validateForm);
createScript();
createHiddenFields();