import { Article } from "./Article";
import { UserData } from "./UserData";

export type ReportArticleData = {
  id: number;
  reason: number;
  note: string;
  status: number;
  createdAt: string;
  author: UserData;
  article: Article;
}