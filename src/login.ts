"use strict";

import { UserService } from "./classes/user-service.ts";
import { MyGeolocation } from "./classes/my-geolocation.ts";
import { Utils } from "./classes/utils.ts";

const userService = new UserService();
const utils = new Utils();

const formLogin = document.getElementById("form-login") as HTMLFormElement;

async function validateForm(event: Event): Promise<void> {
    event.preventDefault();
    const email = formLogin.email.value.trim();
    const password = formLogin.password.value.trim();

    if(!(email && password))
        alert("CAMPO VACIO");
    else {
        const lat = +formLogin.lat.value;
        const lng = +formLogin.lng.value;
        try {
            await userService.post({
                email,
                password,
                lat,
                lng});
            console.log(email, password, lat, lng);
            location.assign("index.html");
        } catch(e) {
            alert("Error login");
            console.error(e);
        }
    }
}

async function takeCoords(): Promise<void> {
    const coords = await MyGeolocation.getLocation();
    utils.coordinatesMap(coords);
}

formLogin.addEventListener("submit", validateForm);
utils.createHiddenFields("form-login");
takeCoords();
localStorage.setItem("token", "");
//mando USERLOGIN
//recibo TOKEN RESPONSE