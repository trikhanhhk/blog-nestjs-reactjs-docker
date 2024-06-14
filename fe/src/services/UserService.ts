import { httpClient } from "../helpers/api"
import { AdminUpdateUser } from "../types/AdminUpdateUser";
import { RegisterForm } from "../types/RegisterForm";
import { getCurrentLogin, getToken } from "./AuthService";

//thêm mới người dùng
export const createNewUser = async (data: RegisterForm) => {
  return (await httpClient()).post(`/user`, data);
}

//Lấy thông tin người dùng follow, đã follow hay chưa
export const checkFollowUser = async (followId: number) => {
  return getToken() ? (await httpClient())
    .get(`/user/${followId}/follow`) : null;
}

//Xử lý follow và undFollow người dùng
export const handleFollowUser = async (followId: number, type: "follow" | "unfollow") => {
  return getToken() ? (await httpClient())
    .post(`/user/${followId}/follow?type=${type}`) : null;
}

//lấy ra danh sách user, hỗ trợ phân trang và tìm kiếm
export const getListUser = async (search: string | undefined, isDelete: "0" | "1" | undefined, status: "0" | "1" | undefined, pageNumber: number = 1, itemPerPage: number = 10) => {
  let query = `?itemPerPage=${itemPerPage}&page=${pageNumber}`;

  if (search) {
    query = `${query}&search=${search}`;
  }

  if (typeof isDelete !== 'undefined') {
    query = `${query}&isDelete=${isDelete}`;
  }

  if (typeof status !== 'undefined') {
    query = `${query}&status=${status}`;
  }

  return (await httpClient()).get(`/user${query}`);
}

//lấy thông tin người dùng từ bằng id người dùng
export const getUserProfileById = async (userId: number) => {
  return (await httpClient())
    .get(`user/${userId}`)
}

//Cập nhật ảnh đại diện user 
export const uploadAvatar = async (form: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return (await httpClient())
    .post("/user/uploadAvatar", form, config);
}


//cập nhật liên kết 
export const updateSocialLink = async (data: any) => {
  return (await httpClient())
    .put(`/user/${getCurrentLogin().id}/updateSocialLink`, data);
}

//Cập nhật thông tin người dùng
export const updateProfile = async (data: any) => {
  return (await httpClient())
    .put(`/user/${getCurrentLogin().id}/updateUserProfile`, data);
}

//Xóa một người dùng
export const deleteOneUser = async (id: number) => {
  return (await httpClient()).delete(`/user/${id}`);
}

//xóa nhiều người dùng
export const deleteMultipleUser = async (ids: string) => {
  return (await httpClient()).delete(`/user?delete_ids=${ids}`)
}

//bỏ xóa:
export const restoreUser = async (id: number) => {
  return (await httpClient()).put(`/user/${id}/restoreUser`);
}

//Thay đổi mật khẩu
export const updatePassword = async (data: { oldPassword: string, newPassword: string }) => {
  return (await httpClient())
    .put(`/user/${getCurrentLogin().id}/updatePassword`, data);
}

//Danh sách người theo dõi
export const getUserFollowers = async (userId: number, page: number) => {
  return (await httpClient())
    .get(`user/${userId}/userFollowers?page=${page}&itemPerPage=20`)
}

//Danh sách người đang theo dõi
export const getUserFollowing = async (userId: number, page: number) => {
  return (await httpClient())
    .get(`user/${userId}/userFollowings?page=${page}&itemPerPage=20`);
}



/**
 * Lấy ra tổng người dùng
 * Thống kê theo khoảng thời gian
 */

export const getCountUser = async (time: 'week' | 'month' | 'year' | undefined, from: string | undefined, to: string | undefined) => {
  let query = "";

  if (time) {
    query = `${query}&time=${time}`;
  }

  if (from && to) {
    query = `${query}&from=${from}&to=${to}`;
  }

  return (await httpClient()).get(`user/count?${query}`);
}

//Admin cập nhật thông tin ngươi dùng
export const adminUpdateUser = async (userId: number, data: AdminUpdateUser) => {
  return (await httpClient()).put(`/user/${userId}`, data);
}


//update status
export const updateStatusUser = async (userId: number, status: 0 | 1) => {
  return (await httpClient()).put(`user/${userId}/status`, { status });
}