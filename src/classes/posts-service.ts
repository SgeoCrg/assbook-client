import { SERVER } from "../constants";
import { Post, PostInsert } from "../interfaces/post";
import { PostsResponse } from "../interfaces/responses";
import { Vote } from "../interfaces/vote";
import { Http } from "./http";

export class PostsService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async getAll(): Promise<PostsResponse> {
        const resp = await this.#http.get(`${SERVER}/posts`) as PostsResponse;
        console.log("cargados todos los posts");
        return resp;//.posts;
    }

    async post(post: PostInsert): Promise<PostInsert> {
        const resp = await this.#http.post(`${SERVER}/posts`, post) as PostInsert;
        return resp;//.post;
    }

    async postVote(id: number, vote: Vote): Promise<Vote> {
        return this.#http.post(`${SERVER}/posts/${id}/likes`, { likes: vote });
    }

    async deleteVote(id: number): Promise<Vote> {
        return this.#http.delete(`${SERVER}/posts/${id}/likes`);
    }

    async deletePost(id: number): Promise<Post> {
        return this.#http.delete(`${SERVER}/posts/${id}`);
    }
    // Complete this class
}

