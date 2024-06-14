import { TagData } from "./Tag";
import { UserData } from "./UserData";

export type Article = {
  id: number | undefined;
  title: string | undefined;
  description: string | undefined;
  keyword: string | undefined;
  view: number | undefined;
  thumbnail: string | undefined;
  body: string | undefined
  createdAt: string | undefined;
  author: UserData | undefined;
  tags: TagData[] | undefined;
  vote: number | undefined;
  status: number;
  countComment: number;
}