import { Utils } from "./classes/utils";

const utils = new Utils();

utils.checkToken(localStorage.getItem("token")!);