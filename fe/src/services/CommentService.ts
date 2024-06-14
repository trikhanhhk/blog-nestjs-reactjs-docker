import { httpClient } from "../helpers/api"
import { getToken } from "./AuthService";

export const saveComment = async (comment: any) => {
  return (await (await httpClient()).post("/comment-socket", comment));
}

export const getCommentDetail = async (id: number) => {
  return (await httpClient()).get(`/comment-socket/${id}`);
}

export const getListComment = async ({ articleId = -1, isParent = true, parentId = -1, page = 1 }) => {
  console.log("service print article", articleId);
  return (await (await httpClient()).get(`/comment-socket?itemPerPage=5&page=${page}&articleId=${articleId}&isParent=${isParent}&parentId=${parentId}`));
}

export const getListCommentChild = async (parentId: number, page: number) => {
  return (await (await httpClient()).get(`/comment-socket/child-comment?itemPerPage=5&page=${page}&parentId=${parentId}`));
}

export const getVotedComment = async (commentId: number) => {
  return getToken() ? (await (await httpClient()).get(`/comment-socket/${commentId}/vote`)) : null;
}

//Report comment
export const createReportComment = async (data: any) => {
  return getToken() ? (await httpClient()).post(`/reportComment/`, data) : null;
}

//lấy ra danh sách report bài viết
export const getListReportComment = async (
  itemPerPage: number, pageNumber: number, search: string | null, commentSearch: number | null,
  from: string | null, to: string | null
) => {
  let query = `?itemPerPage=${itemPerPage}&page=${pageNumber}`;

  if (search) {
    query = `${query}&search=${search}`;
  }

  if (commentSearch) {
    query = `${query}&commentId=${commentSearch}`;
  }
  if (from && to) {
    query = `${query}&from=${from}&to=${to}`;
  }

  return getToken() ? (await httpClient()).get(`/reportComment${query}`) : null;
}

//thay đổi trạng thái (status)
export const updateStatusReportComment = async (id: number, data: any) => {
  return getToken() ? (await httpClient()).put(`reportComment/${id}/status`, data) : null;
}