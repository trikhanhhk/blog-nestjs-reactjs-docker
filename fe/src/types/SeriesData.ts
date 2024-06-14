import { Article } from "./Article";
import { UserData } from "./UserData";

export type SeriesData = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  articles: Article[];
  author: UserData;
  vote: number;
  view: number;
}