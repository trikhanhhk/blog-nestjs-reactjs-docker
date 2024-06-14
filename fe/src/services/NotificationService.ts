import { httpClient } from "../helpers/api"

export const getNotifications = async (itemPerPage: number, page: number) => {
  return (await httpClient()).get(`/notifications?itemPerPage=${itemPerPage}&page=${page}`);
}

export const getNotificationsAdmin = async (itemPerPage: number, page: number) => {
  return (await httpClient()).get(`/notifications/admin?itemPerPage=${itemPerPage}&page=${page}`);
}

export const updateRead = async (id: number) => {
  return (await httpClient()).put(`/notifications/${id}`);
}

export const getOneNotification = async (id: number) => {
  return (await httpClient()).get(`/notifications/${id}`);
}