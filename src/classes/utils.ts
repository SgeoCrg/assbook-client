import { Coordinates } from "../interfaces/coordinates";

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

    checkToken(token: string): void {
        if(token == "")
            location.assign("login.html");
    }
}