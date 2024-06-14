import React from 'react';
import { CSSProperties } from "react";
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import LoginModal from '../components/LoginModal';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import Footer from './Footer';
// import { RootState } from '../redux/reducers/reducers';

interface OverrideCSSProperties extends CSSProperties {
  position?: "absolute" | "relative" | "fixed" | undefined;
}

const override: OverrideCSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  backgroundColor: "rgb(0 0 0 / 30%)",
  zIndex: "99999",
  padding: "20px",
  borderRadius: "8px",
  width: "100%",
  height: "100%"
}


const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const statusLoading = useSelector((state: any) => state.globalLoading.status);
  const statusOpenLogin = useSelector((state: any) => state.showLoginModal.status)
  return (
    <div>
      <BeatLoader margin={"auto"} loading={statusLoading} color="#ffff" cssOverride={override} />
      <Outlet />
      <ToastContainer />
      <LoginModal onClose={() => {
        dispatch(actions.showLogin(false));
      }
      } isOpen={statusOpenLogin} />
      <Footer />
    </div>
  );
}

export default Layout;