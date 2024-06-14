import { httpClient } from "../helpers/api"
import { getToken } from "./AuthService";

export const getSeriesList = async (search: string | undefined, page: number, itemPerPage: number = 10, userId: string | undefined | null) => {
  let query = `?page=${page}&itemPerPage=${itemPerPage}`;

  if (search != undefined) {
    query = `${query}&search=${search}`;
  }

  if (userId) {
    query = `${query}&userId=${userId}`;
  }

  return (await httpClient()).get(`/series${query}`);
}

export const getDetailSeries = async (seriesId: number) => {
  return (await httpClient()).get(`/series/${seriesId}`);
}

export const createSeries = async (data: any) => {
  return getToken() ? (await httpClient()).post(`/series`, data) : null;
}

export const editSeries = async (data: any, seriesId: number) => {
  return getToken() ? (await httpClient()).put(`/series/${seriesId}`, data) : null;
}

export const deleteSeries = async (seriesId: number) => {
  return getToken() ? (await httpClient()).delete(`series/${seriesId}`) : null;
}

export const getVotedSeries = async (seriesId: number) => {
  return getToken() ? (await (await httpClient()).get(`/series/${seriesId}/vote`)) : null;
}

export const getCountSeries = async (time: 'week' | 'month' | 'year' | undefined, from: string | undefined, to: string | undefined) => {
  let query = "";

  if (time) {
    query = `${query}&time=${time}`;
  }

  if (from && to) {
    query = `${query}&from=${from}&to=${to}`;
  }

  return (await httpClient()).get(`/series/count${query}`);
}
