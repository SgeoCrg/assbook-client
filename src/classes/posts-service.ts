import { SERVER } from "../constants";
import { Post, PostInsert } from "../interfaces/post";
import { Vote } from "../interfaces/vote";
import { Http } from "./http";

export class PostsService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async getAll(): Promise<Post[]> {
        const resp = await this.#http.get(`${SERVER}/posts`);
        return resp.posts;
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

    async deletePost(id): Promise<Post> {
        return this.#http.delete(`${SERVER}/posts/${id}`);
    }
    // Complete this class
}

