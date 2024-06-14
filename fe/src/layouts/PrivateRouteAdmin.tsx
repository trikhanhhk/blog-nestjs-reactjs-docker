import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import * as actions from "../redux/actions";
import ForbiddenPage from './error/ForbiddenPage';
import { getCurrentLogin, getToken } from '../services/AuthService';

const PrivateRouteAdmin: React.FC = () => {
  const dispatch = useDispatch();

  const userLogin = getCurrentLogin();

  const token = getToken();

  if (!token) {
    dispatch(actions.showLogin(true));
    return (<ForbiddenPage />);
  }

  if (userLogin.role === "USER") {
    return (<ForbiddenPage />);
  }

  return (
    <Outlet />
  );
}

export default PrivateRouteAdmin;