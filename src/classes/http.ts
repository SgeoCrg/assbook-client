//import { Coordinates } from "../interfaces/coordinates";

export class Http {
    async ajax<T>(
        method: string,
        url: string,
        headers?: HeadersInit,
        body?: string
    ): Promise<T> {
        const token = localStorage.getItem("token");
        if (token) headers = { ...headers, Authorization: "Bearer " + token };

        const resp = await fetch(url, { method, headers, body });
        if (!resp.ok) throw await resp.json();
        if (resp.status != 204) {
            return await resp.json();
        } else {
            return null as T;
        }
    }

    get<T>(url: string): Promise<T> {
        return this.ajax<T>("GET", url);
    }

    post<T,U>(url: string, data: U): Promise<T> {
        return this.ajax<T>(
            "POST",
            url,
            {
                "Content-Type": "application/json",
            },
            JSON.stringify(data)
        );
    }

    put<T, U>(url: string, data: U): Promise<T> {
        return this.ajax<T>(
            "PUT",
            url,
            {
                "Content-Type": "application/json",
            },
            JSON.stringify(data)
        );
    }

    delete<T>(url: string): Promise<T> {
        return this.ajax<T>("DELETE", url);
    }
/*
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
    }*/
}