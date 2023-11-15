import { SERVER } from "../constants";
import { Post, PostInsert } from "../interfaces/post";
import { PostsResponse, TokenResponse } from "../interfaces/responses";
import { User, UserLogin } from "../interfaces/user";
import { Vote } from "../interfaces/vote";
import { Http } from "./http";

export class UserService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async getToken() {
        const resp = await this.#http.get(`${SERVER}/auth/validate`);
        //console.log("cargado el token");
        return resp;//.posts;
    }

    async post(user: UserLogin): Promise<TokenResponse> {
        const resp = await this.#http.post(`${SERVER}/auth/login`, user) as TokenResponse;
        localStorage.setItem("token", resp.accessToken);
        console.log(resp);
        return resp;
    }

    async register(user: User): Promise<TokenResponse> {
        const resp = await this.#http.post(`${SERVER}/auth/register`, user) as TokenResponse;
        localStorage.setItem("token", resp.accessToken);
        console.log("->",resp);
        return resp;
    }

    async getUser(userId: string): Promise<User> {
        const resp = await this.#http.get(`${SERVER}/users/${userId}`) as User;
        console.log("->",resp);
        return resp;
    }

    // Complete this class
}
