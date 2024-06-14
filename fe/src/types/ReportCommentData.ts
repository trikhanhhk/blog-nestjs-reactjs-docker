import { UserData } from "./UserData";

export type ReportCommentData = {
  id: number;
  reason: number;
  note: string;
  status: number;
  createdAt: string;
  author: UserData;
  comment: Comment;
}