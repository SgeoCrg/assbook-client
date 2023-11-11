"use strict";

import { PostsService } from "./classes/posts-service.ts";
//import { Post } from "./interfaces/post.ts";
import { MapService } from "./classes/map-service.ts";
import { MyGeolocation } from "./classes/my-geolocation.ts";
import { Coordinates } from "./interfaces/coordinates.ts";
import { Http } from "./classes/http.ts";
import { Utils } from "./classes/utils.ts";

const postsService = new PostsService();
const newPostForm = document.getElementById("newPlace") as HTMLFormElement;
const errorMsg = document.getElementById("errorMsg");
const imgPreview = document.getElementById("imgPreview");
const http = new Http();
const utils = new Utils();
//const place = document.getElementById("place");
//const locationContainer = document.getElementById("location-container");

async function validateForm(event: Event): Promise<void> {
    event.preventDefault();
    let place = newPostForm.place.value.trim();
    const title = (newPostForm.elements.namedItem("title") as HTMLInputElement).value;//newPostForm.title.value.trim();
    const image: string = newPostForm.image.value ? (<HTMLImageElement>imgPreview).src : "";
    const description = newPostForm.description.value.trim();
    const mood = +newPostForm.mood.value;
    const lat = +newPostForm.lat.value;
    const lng = +newPostForm.lng.value;

    if (!title && !description && (!image && (!place && !document.getElementById("lat")?.classList.contains("on")))) {
        errorMsg!.classList.remove("hidden");
        setTimeout(() => errorMsg!.classList.add("hidden"), 3000);
    } else {
        try {
            if(image == "") {
                if(place == "" && document.getElementById("lat")?.classList.contains("on"))
                    place = "Mi ubicacion";
                console.log(title, description, mood, lat, lng, place);
                await postsService.post({
                    title, 
                    description,
                    mood, 
                    lat, 
                    lng, 
                    place});
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
            switchAddress(true);
            document.getElementById("photo-group")!.classList.add("d-none");
            document.getElementById("location-group")!.classList.remove("d-none");
            showMap();//mapServices.showMap();//getMap()
        } else {
            document.getElementById("photo-group")!.classList.remove("d-none");
            document.getElementById("location-group")!.classList.add("d-none");
            switchAddress(false);
        }
    } );
} 

function loadImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        imgPreview!.classList.remove("d-none");
        (<HTMLImageElement>imgPreview)!.src = reader.result as string;
    });
}

function createScript(): void {
    const script = document.createElement("script");
    //let body = document.getElementsByTagName("body");
    script.src="http://www.bing.com/api/maps/mapcontrol?callback=getMap";//=showMap
    script.defer = true;
    document.body.append(script);
}

/*function createHiddenFields(formName: string): void {
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
}*/

async function showMap(): Promise<void> {
    const coords = await MyGeolocation.getLocation();
    //const lat = document.getElementById("lat");
    //const lng = document.getElementById("lng");
    //(<HTMLInputElement>lat).value = coords.latitude.toString();
    //(<HTMLInputElement>lng).value = coords.longitude.toString();
    coordinatesMap(coords);
    const mapsService = await MapService.createMapService(coords, "map");
    const marker = mapsService.createMarker(coords, "red");
    const autosuggest = await mapsService.getAutoSuggestManager();
    autosuggest.attachAutosuggest("#place", "#location-container", (result) => {//("#search", "#searchcontainer",
        marker.setLocation(result.location);
        mapsService.map.setView({center: result.location});
        //(<HTMLInputElement>lat).value = result.location.latitude.toString();
        //(<HTMLInputElement>lng).value = result.location.longitude.toString();
        coordinatesMap(result.location);
    });
}

function coordinatesMap(coords: Coordinates): void {
    const lat = document.getElementById("lat");
    const lng = document.getElementById("lng");
    (<HTMLInputElement>lat).value = coords.latitude.toString();
    (<HTMLInputElement>lng).value = coords.longitude.toString();
}

function switchAddress(bool: boolean): void {
    const lat = document.getElementById("lat");
    const lng = document.getElementById("lng");
    if(bool) {
        lat?.classList.add("on");
        lng?.classList.add("on");
    } else {
        lat?.classList.remove("on");
        lng?.classList.remove("on");
    }
}
utils.checkToken(localStorage.getItem("token")!);

newPostForm.image.addEventListener("change", loadImage);
newPostForm.addEventListener("submit", validateForm);

createScript();
utils.createHiddenFields("newPlace");