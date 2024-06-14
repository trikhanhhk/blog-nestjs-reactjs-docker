import React, { useState } from 'react';
import {
  BookOutlined,
  UserOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  LoginOutlined,
  FlagFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { Link } from "react-router-dom";
import LinkToProfile from "../components/user/LinkToProfile";
import { getCurrentLogin, logout } from '../services/AuthService';
import * as action from '../redux/actions'
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTag } from '@fortawesome/free-solid-svg-icons';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const user = getCurrentLogin();
const items: MenuItem[] = [
  getItem(<Link to='/admin' className='nav-link'>Dashboard</Link>, 'dasboard', <FontAwesomeIcon icon={faHouse} />),

  user?.role === 'ADMIN' ? getItem('Người dùng', 'subUser', <UserOutlined />, [
    getItem(<Link to='/admin/user/add' className='nav-link'>Thêm mới</Link>, 'subUser1', <UserAddOutlined />),
    getItem(<Link to='/admin/user/list' className="nav-link">Danh sách</Link>, 'subUser2', <UnorderedListOutlined />),
  ]) : null,

  getItem('Bài viết', 'subPost', <BookOutlined />, [
    getItem(<Link to='/admin/blog/list' className="nav-link">Quản lý</Link>, 'subPost2', <UnorderedListOutlined />),
  ]),

  getItem('Series', 'subSeries', <BookOutlined />, [
    getItem(<Link to='/admin/series/list' className="nav-link">Quản lý</Link>, 'subSeries1', <UnorderedListOutlined />),
  ]),

  getItem('Report', 'subReport', <FlagFilled />, [
    getItem(<Link to='/admin/report/list' className="nav-link">Quản lý</Link>, 'subReport1', <UnorderedListOutlined />),
  ]),

  getItem('Tag, Chủ đề', 'subTag', <FontAwesomeIcon icon={faTag} />, [
    getItem(<Link to='/admin/tags/list' className="nav-link">Quản lý</Link>, 'subTag1', <UnorderedListOutlined />),
    getItem(<Link to='/admin/tags/add' className="nav-link">Thêm mới</Link>, 'subTag2', <FileAddOutlined />),
  ]),

  getItem('Banner Hiển thị', 'subBanner', <BookOutlined />, [
    getItem(<Link to='/admin/slider/list' className="nav-link">Quản lý</Link>, 'subBanner1', <UnorderedListOutlined />),
    getItem(<Link to='/admin/slider/add' className="nav-link">Thêm mới</Link>, 'subBanner2', <FileAddOutlined />),
  ]),
];

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("access_token") || false;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav id="mainnav-container" className="mainnav">
      <div className="mainnav__inner">

        {/* Navigation menu */}
        <div className="mainnav__top-content scrollable-content pb-5">

          {/* Profile Widget */}
          <div className="mainnav__profile mt-3 d-flex3">
            {/* Profile picture  */}
            {accessToken ? <>
              <div className="mininav-toggle text-center py-2">
                <img className="mainnav__avatar img-md rounded-circle borde"
                  src={user.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${user.avatarPath}` : "/assets/img/profile-photos/5.png"}
                  alt="Profile Picture" loading="lazy" />
              </div>

              <div className="mininav-content collapse d-mn-max">
                <div className="d-grid">

                  {/* User name and position */}
                  <button className="d-block btn shadow-none p-2" data-bs-toggle="collapse" data-bs-target="#usernav" aria-expanded="false" aria-controls="usernav">
                    <span className="dropdown-toggle d-flex justify-content-center align-items-center">
                      {/* <h6 className="mb-0 me-3">{`${user.first_name} ${user.last_name}`}</h6> */}
                      <LinkToProfile userId={user.id} userName={`${user.first_name} ${user.last_name}`} />
                    </span>
                    <small className="text-muted">{user.role === 'ADMIN' ? 'Administrator' : 'Post Admin'}</small>
                  </button>

                  {/* Collapsed user menu */}
                  <div id="usernav" className="nav flex-column collapse">
                    <a onClick={handleLogout} className="nav-link">
                      <i className="demo-pli-unlock fs-5 me-2"></i>
                      <span className="ms-1">Logout</span>
                    </a>
                  </div>

                </div>
              </div>
            </> : <Button onClick={() => dispatch(action.showLogin(true))} className="btn-link"> <LoginOutlined /> Đăng nhập/Đăng ký </Button>}

          </div>

          <div style={{ width: 210 }}>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['subUser']}
              mode="inline"
              theme="light"
              items={items}
            />
          </div>

        </div>
        {/* End - Navigation menu */}

        {/* Bottom navigation menu */}
        <div className="mainnav__bottom-content border-top pb-2">
          <ul id="mainnav" className="mainnav__menu nav flex-column">
            <li className="nav-item has-sub">
              <a onClick={handleLogout} className="nav-link mininav-toggle collapsed" aria-expanded="false">
                <i className="demo-pli-unlock fs-5 me-2"></i>
                <span className="nav-label ms-1">Logout</span>
              </a>
              <ul className="mininav-content nav flex-column collapse">
                <li className="nav-item">
                  <a href="#" className="nav-link">This device only</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">All Devices</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#" aria-disabled="true">Lock screen</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        {/* End - Bottom navigation menu */}

      </div>
    </nav>
  )
}

export default Navbar;