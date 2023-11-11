import { SERVER } from "../constants";
import { Post, PostInsert } from "../interfaces/post";
import { PostsResponse, TokenResponse } from "../interfaces/responses";
import { UserLogin } from "../interfaces/user";
import { Vote } from "../interfaces/vote";
import { Http } from "./http";

export class UserService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async post(user: UserLogin): Promise<TokenResponse> {
        const resp = await this.#http.post(`${SERVER}/auth/login`, user) as TokenResponse;
        localStorage.setItem("token", resp.accessToken);
        console.log(resp);
        return resp;
    }

    // Complete this class
}
