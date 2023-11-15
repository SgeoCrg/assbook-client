import { MyGeolocation } from "./classes/my-geolocation";
import { UserService } from "./classes/user-service";
import { Utils } from "./classes/utils";

const utils = new Utils();
const userService = new UserService();

const newUserForm = document.getElementById("form-register") as HTMLFormElement;
const imgPreview = newUserForm.imgPreview;
const coords = await MyGeolocation.getLocation();

async function validateForm(event: Event): Promise<void> {
    event.preventDefault();
    const name = (newUserForm.elements.namedItem("name")as HTMLInputElement).value;
    const email = newUserForm.email.value;
    const email2 = newUserForm.email2.value;
    const password = newUserForm.password.value;
    const lat = +newUserForm.lat.value;
    const lng = +newUserForm.lng.value;
    if(email != email2)
        alert("Email and repeated email must be equals");
    else
        if(name == "" || email == "" || password == "" || newUserForm.avatar.value == "")
            alert("you must fill all the fields");
        else {
            //console.log(name, email, password, lat, lng);
            const avatar: string = newUserForm.avatar.value ? (<HTMLImageElement>imgPreview).src : "";
            await userService.register({
                name,
                email,
                password,
                avatar,
                lat,
                lng
            }).then(respuesta => {
                console.log(respuesta);
                alert("User created successfully");
                location.assign("login.html");
            }).catch(error => alert(error.message[0]));
        }
    //COMPROBAR CORREO == CORREO2
    //COMPROBAR NO CAMPOS VACIOS
    //HACER EL CATCH o EL THEN
}

function loadImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        imgPreview!.classList.remove("d-none");
        (<HTMLImageElement>imgPreview).src = reader.result as string;
    });
}

utils.coordinatesMap(coords);
newUserForm.avatar.addEventListener("change", loadImage);
newUserForm.addEventListener("submit", validateForm);
