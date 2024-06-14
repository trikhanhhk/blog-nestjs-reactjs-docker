import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const PublicRoute: React.FC = () => {
  // const token = localStorage.getItem('access_token') || false;
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (token) {
  //     navigate('/', { replace: true }); // Chuyển hướng đến trang chính (home)
  //   }
  // }, [token, navigate]);

  return <Outlet />;
};


export default PublicRoute;