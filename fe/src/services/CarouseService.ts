import { httpClient } from "../helpers/api"

export const getCarouse = async () => {
  return (await httpClient()).get("/slider/carousel")
}

export const getSliders = async (itemPerPage: number, pageNumber: number, search: string | undefined | null = undefined, status: string | undefined | null = undefined) => {
  let query = `?itemPerPage=${itemPerPage}&page=${pageNumber}`;
  query = search ? `${query}&search=${search}` : query;
  query = status ? `${query}&status=${status}` : query;

  return (await httpClient()).get(`/slider${query}`);
}

export const getOneSlider = async (id: string) => {
  return (await httpClient()).get(`/slider/${id}`);
}

export const createSlider = async (formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return (await httpClient()).post("/slider", formData, config);
}

export const updateSlider = async (formData: FormData, sliderId: number) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  return (await httpClient()).put(`/slider/${sliderId}`, formData, config);
}

export const updateStatusSlider = async (sliderId: number) => {
  return (await httpClient()).put(`/slider/${sliderId}/status`);
}

export const deleteOneSlider = async (id: number) => {
  return (await httpClient()).delete(`/slider/${id}`);
}

export const deleteMultipleSlider = async (ids: string) => {
  return (await httpClient()).delete(`slider?ids=${ids}`);
}