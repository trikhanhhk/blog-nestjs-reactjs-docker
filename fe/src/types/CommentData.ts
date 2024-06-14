import { PaginationData } from "./Pagination";

export interface AuthorDto {
    first_name: string;
    last_name: string;
    email: string;
    avatarPath: string;
}

export interface CommentItem {
    id: number
    content: string;
    vote: number;
    articleId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    parentId: number;
    author: AuthorDto;
}

export interface CommentData {
    comment: CommentItem;
    paginationChild: PaginationData;
    children: CommentItem[];
}