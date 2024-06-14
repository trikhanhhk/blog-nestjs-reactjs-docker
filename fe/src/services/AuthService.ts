import { httpClient } from "../helpers/api"
import { RegisterForm } from "../types/RegisterForm";
import { UserData } from "../types/UserData";

export const login = async (loginData: { email: string, password: string }) => {
  return (await httpClient()).post('/auth/login', loginData);
}

export const getToken = () => {
  return localStorage.getItem("access_token") || false;
}

export const getCurrentLogin = (): UserData => {
  return getToken() ? JSON.parse(localStorage.getItem("userData") || '') : null;
}

export const updateCurrentLogin = (newInfo: any): void => {
  const currentLogin = getCurrentLogin();
  const newData: any = { ...currentLogin };
  // Lọc ra các trường có giá trị và thêm vào newData
  Object.entries(newInfo).filter(([key, value]) => value !== null && value !== undefined)
    .forEach(([key, value]) => newData[key] = value);
  localStorage.setItem("userData", JSON.stringify(newData));
}

export const googleLogin = async (token: string) => {
  return (await httpClient()).post('/auth/google-auth', { token: token });
}

export const registerUser = async (formData: RegisterForm) => {
  return (await httpClient()).post("/auth/register", formData);
}

export const logout = () => {

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userData');

  window.location.href = '/';
};


//forgot password
export const forgotPassword = async (data: { emailAddress: string }) => {
  return (await httpClient()).post("/auth/forgotPassword", data);
}

export const updateNewPassword = async (data: { userId: number, resetToken: string, newPassword: string }) => {
  return (await httpClient()).post('/auth/forgotPassword/newPass', data);
}

export const refreshTokenExpired = async (token: string) => {
  return (await httpClient()).post("/auth/refresh-token", { refresh_token: token });
}