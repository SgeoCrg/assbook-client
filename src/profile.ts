"use strict";

import { UserService } from "./classes/user-service";
import { Utils } from "./classes/utils";
import { User } from "./interfaces/user";

const utils = new Utils();
let prof: User;
const userService = new UserService();
const userName = document.getElementById("name");
const emailPrincipal = document.querySelector("#email > small");
const img = document.getElementById("avatar");
const editProfileBtn = document.getElementById("editProfile");
const editPasswordBtn = document.getElementById("editPassword");
const editAvatarBtn = document.querySelector(".btn-sm");
const logout = document.getElementById("logout");
const avatarInput = document.getElementById("avatarInput");
const cancelBtn = document.getElementById("cancelEditProfile");
const profileForm = document.getElementById("profileForm") as HTMLFormElement;
const passwordForm = document.getElementById("passwordForm") as HTMLFormElement;
const cancelEditPasswordBtn = document.getElementById("cancelEditPassword");

utils.checkToken();

const userId = document.URL.split("=")[1];
if(userId) {
    console.log(userId);
    await userService.getUser(userId).then(result => {
        prof = result.user;
    }).catch(error => {
        console.log(error);
        window.history.back();
    });
} else {
    console.log("me");
    await userService.getUser("me").then(result => {
        prof = result.user;
    }).catch(error => {
        console.log(error);
    });
}

if(!prof.me) {
    editPasswordBtn?.classList.add("d-none");
    editProfileBtn?.classList.add("d-none");
    editAvatarBtn?.classList.add("d-none");
}

console.log(prof.email);
console.log(editProfileBtn);

userName!.innerText = prof.name;
emailPrincipal!.innerHTML = prof.email;
img!.src = prof.avatar;
utils.showMap(prof.lat, prof.lng);

logout?.addEventListener("click", () => {
    localStorage.setItem("token", "");
    location.assign("login.html");
});

editProfileBtn?.addEventListener("click", profileFormActivated);
editPasswordBtn?.addEventListener("click", passwordFormActivated);
cancelBtn?.addEventListener("click", profileFormDeactivated);
cancelEditPasswordBtn?.addEventListener("click", passwordFormDeactivated);

avatarInput?.addEventListener("change", loadImage);

function passwordFormActivated(): void {
    document.getElementById("profileInfo")?.classList.add("d-none");
    document.getElementById("passwordForm")?.classList.remove("d-none");
}

function passwordFormDeactivated(): void {
    (<HTMLInputElement>passwordForm.querySelector("#password"))!.value = "";
    (<HTMLInputElement>passwordForm.querySelector("#password2"))!.value = "";
    document.getElementById("profileInfo")?.classList.remove("d-none");
    document.getElementById("passwordForm")?.classList.add("d-none");
}

function profileFormDeactivated(): void {
    (<HTMLInputElement>profileForm.querySelector("#email"))!.value = "";
    (<HTMLInputElement>profileForm.querySelector("#name"))!.value = "";
    document.getElementById("profileInfo")?.classList.remove("d-none");
    document.getElementById("profileForm")?.classList.add("d-none");
}

function profileFormActivated(): void {
    document.getElementById("profileInfo")?.classList.add("d-none");
    document.getElementById("profileForm")?.classList.remove("d-none");
    (<HTMLInputElement>profileForm.querySelector("#email"))!.value = emailPrincipal!.innerHTML;
    (<HTMLInputElement>profileForm.querySelector("#name"))!.value = userName!.innerText;
}

passwordForm.addEventListener("submit", validatePassword);
profileForm.addEventListener("submit", validateProfile);

async function validateProfile(event: Event): Promise<void> {
    event.preventDefault();
    const email = (<HTMLInputElement>profileForm.querySelector("#email"))!.value;
    const name = (<HTMLInputElement>profileForm.querySelector("#name"))!.value;

    if(email == "" || name == "")
        alert("Fileds must not be empty");
    else {
        await userService.updateUser(email, name).then(resp => {
            alert("user updated");
            userName!.innerText = ((<HTMLInputElement>profileForm.querySelector("#name"))!.value);
            emailPrincipal!.innerHTML = ((<HTMLInputElement>profileForm.querySelector("#email"))!.value);
            profileFormDeactivated();
        }).catch(error => {
            console.log(error);
        });
    }
}

async function validatePassword(event: Event): Promise<void> {
    event?.preventDefault();
    const pass = (<HTMLInputElement>passwordForm.querySelector("#password"))!.value;
    const pass2 = (<HTMLInputElement>passwordForm.querySelector("#password2"))!.value;
    if(pass == "" || pass != pass2) {
        alert("Passwords must be equals and cannot be empty");
    } else {
        console.log(pass);
        await userService.updatePassword(pass).then(result => {
            alert("password updated");
            passwordFormDeactivated();
        }).catch(error => {
            console.log(error);
        });
    }
}

async function loadImage(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    const imgPreview = document.createElement("img");
    let avatarChanged: string;
    imgPreview.classList.add("d-none");

    if (file) reader.readAsDataURL(file);

    reader.addEventListener("load", async () => {
        (<HTMLImageElement>imgPreview).src = reader.result as string;
        avatarChanged = reader.result as string;
        console.log("->",reader.result as string);
        await userService.updateAvatar(avatarChanged).then(resp => {
            console.log(resp);
            changeAvatar(resp.avatar);
        }).catch(error => {
            console.log(error);
        });
        editAvatarBtn?.append(imgPreview);
    });
    
    function changeAvatar(avatar: string): void {
        (<HTMLImageElement>img)!.src = avatar;
    }

}