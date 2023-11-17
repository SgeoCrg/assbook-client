import { SERVER } from "../constants";
import { Post, PostInsert } from "../interfaces/post";
import { PostsResponse, TokenResponse, UserResponse } from "../interfaces/responses";
import { User, UserLogin, UserPasswordEdit, UserProfileEdit } from "../interfaces/user";
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

    async updateAvatar(avatarCh: string): Promise<User> {
        const avatar = {"avatar": avatarCh};
        const resp = await this.#http.put(`${SERVER}/users/me/avatar`, avatar) as User;
        return resp;
    }

    async updatePassword(passwordCh: string): Promise<void> {
        const password = {"password": passwordCh} as UserPasswordEdit;
        const resp = await this.#http.put(`${SERVER}/users/me/password`, password) as void;
        return resp;
    }

    async updateUser(email: string, name: string): Promise<void> {
        //console.log(user);
        const user = {"name": name, "email": email } as UserProfileEdit;
        const resp = await this.#http.put(`${SERVER}/users/me`, { name, email }) as void;
        console.log(resp);
        return resp;
    }

    // Complete this class
}
