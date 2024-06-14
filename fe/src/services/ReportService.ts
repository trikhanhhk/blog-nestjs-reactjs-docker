import { httpClient } from "../helpers/api"

export const getDetailReportArticle = async (id: number) => {
  return (await httpClient()).get(`articlesReport/${id}`)
}

export const getDetailReportComment = async (id: number) => {
  return (await httpClient()).get(`reportComment/${id}`)
}