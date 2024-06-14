import { httpClient } from "../helpers/api";
import { getToken } from "./AuthService";

//Lấy danh sách article
export const getArticles = async (
  itemPerPage: number, pageNumber: number, tagId: any,
  authorId: any, search: string = "", seriesId: number | null = null, notIn: string = "", status: "1" | "2" | undefined = undefined) => {

  let query = `?itemPerPage=${itemPerPage}&page=${pageNumber}`;

  query = `${query}${search != "" ? "&search=" + search : ""}`;
  query = `${query}${tagId ? "&tag=" + tagId : ""}`;
  query = `${query}${authorId ? "&userId=" + authorId : ""}`;
  query = `${query}${notIn != "" ? "&notIn=" + notIn : ""}`;
  query = `${query}${seriesId ? "&seriesId=" + seriesId : ""}`;
  query = `${query}${status ? "&status=" + status : ""}`;


  return (await (await httpClient()).get(`/articles${query}`));
}

export const uploadImageCk = async (formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  return (await httpClient()).post('/articles/cke-upload', formData, config);
}

export const createArticle = async (
  formData: FormData
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  return (await httpClient()).post('/articles', formData, config);
}

//Lấy tổng article
export const getCountArticle = async (time: 'week' | 'month' | 'year' | undefined, from: string | undefined, to: string | undefined) => {
  let query = "";

  if (time) {
    query = `${query}&time=${time}`;
  }

  if (from && to) {
    query = `${query}&from=${from}&to=${to}`;
  }

  return (await httpClient()).get(`/articles/count${query}`);
}


//Lấy các article mà user follow author
export const getArticleByFollow = async () => {
  return (await httpClient()).get("/articles/1/following");
}

//xem chi tiết article
export const getDetailArticle = async (articleId: number) => {
  return (await httpClient()).get(`articles/${articleId}`);
}

//lấy chi tiết article để edit
export const getArticleEdit = async (articleId: number) => {
  return (await httpClient()).get(`articles/${articleId}/getEdit`);
}

//lấy thông tin người dùng đã vote hay chưa
export const getVotedArticle = async (articleId: number) => {
  return getToken() ? (await (await httpClient()).get(`/articles/${articleId}/vote`)) : null;
}

//cập nhật article
export const updateArticle = async (articleId: number, form: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return getToken() ? (await httpClient()).put(`/articles/${articleId}`, form, config) : null;
}


//Xóa article;
export const deleteArticle = async (id: number) => {
  return (await httpClient()).delete(`/articles/${id}`);
}

export const banArticle = async (id: number, status: number) => {
  return (await httpClient()).put(`/articles/${id}/status`, { status });
}

//Thêm article vào series
export const updateSeriesArticle = async (articleId: number, seriesId: number, numberOder: number = -1, type: string | null = null) => {
  return getToken() ? (await httpClient()).put(`/articles/${articleId}/updateSeries?seriesId=${seriesId}${numberOder != -1 ? `&numberOder=${numberOder}` : ""}${type ? `&type=${type}` : ""}`) : null;
}

//Report bài viết
export const createReportArticle = async (data: any) => {
  return getToken() ? (await httpClient()).post(`/articlesReport/`, data) : null;
}

//lấy ra danh sách report bài viết
export const getListReportArticle = async (
  itemPerPage: number, pageNumber: number, search: string | null, articleSearch: number | null,
  from: string | null, to: string | null
) => {
  let query = `?itemPerPage=${itemPerPage}&page=${pageNumber}`;

  if (search) {
    query = `${query}&search=${search}`;
  }

  if (articleSearch) {
    query = `${query}&articleId=${articleSearch}`;
  }
  if (from && to) {
    query = `${query}&from=${from}&to=${to}`;
  }

  return getToken() ? (await httpClient()).get(`/articlesReport${query}`) : null;
}

//thay đổi trạng thái (status report)
export const updateStatusReportArticle = async (id: number, data: any) => {
  return getToken() ? (await httpClient()).put(`articlesReport/${id}/status`, data) : null;
}