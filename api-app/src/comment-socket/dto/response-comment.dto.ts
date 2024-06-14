import { Pagination } from "src/helper/generatePaging";
import { Comment } from "../entities/comment-socket.entity";

export class AuthorDto {
    firstName: string;
    lastName: string;
    email: string;
    avatarPath: string;
}

export class ResponseCommentDto {
    comment: Comment;
    paginationChild: Pagination;
    children: Comment[];
}