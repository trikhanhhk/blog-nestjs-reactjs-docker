
import React from "react";
import { Link } from "react-router-dom";
import { getCurrentLogin, getToken, logout } from "../services/AuthService";
import LinkToProfile from "../components/user/LinkToProfile";
import SearchEverything from "../components/SearchEverything/SearchEverything";
import Notification from "../components/notification/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faRightFromBracket, faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import * as action from '../redux/actions'
import { useDispatch } from 'react-redux';
import { Button } from "react-bootstrap";

const Header: React.FC = () => {
  const handleLogout = () => {
    logout();
  };

  const dispatch = useDispatch();

  const userData = getCurrentLogin();

  return (
    <header className="header bottom-shadow">
      <div className="header__inner">
        <div className="main-navbar__container container px-md-0">

          {/* Content Header - Left Side: */}
          <div className="main-navbar__grow d-flex">
            {/* Brand */}
            <div className="main-navbar__logo d-block mr-lg-5">
              <Link to="/" className="brand-img-custom">
                <img src="/assets/img/logo.svg" alt="Nifty Logo" />
              </Link>
            </div>
          </div>

          <div className="main-navbar__right">
            <div className="d-flex">
              <SearchEverything style={{ maxWidth: "400px" }} />
            </div>

            {getToken() ?
              <>
                <Notification />

                <div className="dropdown ms-auto">

                  {/* Toggler */}
                  <a type="button" data-bs-toggle="dropdown">
                    <img className="rounded-circle mb-0" src={userData && userData.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${userData.avatarPath}` : "/assets/img/profile-photos/5.png"} alt="Profile Picture" loading="lazy" style={{ width: "40px", height: "40px" }} />
                  </a>

                  {/* User dropdown menu */}
                  <div className="dropdown-menu dropdown-menu-end w-md-450px">

                    {/* User dropdown header */}
                    <div className="d-flex align-items-center border-bottom px-3 py-2">
                      <div className="flex-shrink-0">
                        <img className="img-sm rounded-circle" src={userData && userData.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${userData.avatarPath}` : "/assets/img/profile-photos/5.png"} alt="Profile Picture" loading="lazy" />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="mb-0"><LinkToProfile userId={userData.id} classSize="h5" userName={`${userData.first_name} ${userData.last_name}`} /></div>
                        <span className="text-muted fst-italic">{userData.email}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`col-md-${userData.role === 'ADMIN' || userData.role === 'POST_ADMIN' ? '6' : '12'}`}>
                        <Link to={`/user/profile?userId=${userData.id}`} className="list-group-item list-group-item-action">
                          <FontAwesomeIcon icon={faUser} /> Trang cá nhân
                        </Link>
                      </div>
                      {(userData.role === 'ADMIN' || userData.role === 'POST_ADMIN') && <div className={`col-md-6`}>
                        <Link to="/admin" className="list-group-item list-group-item-action">
                          <FontAwesomeIcon icon={faLock} /> Trang quản trị
                        </Link>
                      </div>}
                    </div>
                    <div className="row">
                      <a style={{ textAlign: "center" }} onClick={handleLogout} className="list-group-item list-group-item-action">
                        <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                      </a>

                    </div>
                  </div>
                </div>
                {/* End - User dropdown */}
              </>
              :
              <div className="ms-3">
                <a onClick={() => { dispatch(action.showLogin(true)) }} className="btn-link" style={{ fontSize: "12px" }}>
                  <FontAwesomeIcon icon={faRightToBracket} />&nbsp;<span>Đăng nhập/Đăng ký</span>
                </a>
              </div>

            }

          </div>

          {/* Content Header - Right Side: */}


          <div className="header__content-end" style={{ display: "contents" }}>
            {/* Notification Dropdown */}

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;