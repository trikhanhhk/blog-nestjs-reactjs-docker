import { FormTagValues } from "../components/tags/TagsEditor";
import { httpClient } from "../helpers/api";

export const getListTag = async (itemPerPage: number, page: number,
  search: string | undefined, orderBy: string | undefined) => {
  let query = `?itemPerPage=${itemPerPage}&page=${page}`;
  query = search ? `${query}&search=${search}` : query;
  query = orderBy ? `${query}&orderBy=${orderBy}` : query;
  return (await httpClient()).get(`/tags${query}`);
}

export const getDetailTag = async (tagId: number) => {
  return (await httpClient()).get(`/tags/${tagId}`);
}

export const createTag = async (tagData: FormTagValues) => {
  return (await httpClient()).post("/tags", tagData);
}

export const updateTag = async (tagData: FormTagValues, tagId: number) => {
  return (await httpClient()).put(`/tags/${tagId}`, tagData);
}

export const deleteTag = async (tagId: number) => {
  return (await httpClient()).delete(`/tags/${tagId}`);
}

export const multipleDeleteTag = async (tagIds: string) => {
  return (await httpClient()).delete(`tags?ids=${tagIds}`)
}