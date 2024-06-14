import actionType from "../../type";
import { UserData } from "../../types/UserData";

export const login = (userData: UserData) => {
  return {
    type: 'LOGIN',
    payload: userData,
  }
}

export const logout = (): actionType => {
  return {
    type: 'LOGOUT',
  }
}

export const controlLoading = (status: boolean) => {
  return {
    type: "CONTROL_LOADING",
    payload: status,
  }
}

export const showLogin = (status: boolean) => {
  return {
    type: "SHOW_LOGIN_MODAL",
    payload: status,
  }
}

