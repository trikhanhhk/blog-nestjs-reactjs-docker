import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentLogin, getToken } from '../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const TabArticleList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("/blog/list");
  const location = useLocation();
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleClick = (type: "series" | "article") => {
    const status = getCurrentLogin().status;

    if (status === 1) {
      type === "series" ? navigate('/series/add') : navigate('/blog/add');
    } else {
      toast.warning("Tài khoản của bạn đang bị khóa tính năng này. Vui lòng liên hệ quản trị viên để biết lý do");
    }
  }

  return (
    <nav className="nav nav-article" style={{ margin: "0 auto", color: "#fff" }}>
      <Link
        className={`nav-link ${activeTab === "/blog/list" ? 'active' : ''}`}
        to="/blog/list"
        onClick={() => handleTabClick("/blog/list")}
      >
        MỚI NHẤT
      </Link>
      <Link
        className={`nav-link ${activeTab === "/series/list" ? 'active' : ''}`}
        to="/series/list"
        onClick={() => handleTabClick("/series/list")}
      >
        SERIES
      </Link>
      {getToken() &&
        <Link
          className={`nav-link ${activeTab === "/blog/list/follow" ? 'active' : ''}`}
          to="/blog/list/follow"
          onClick={() => handleTabClick("/blog/list/follow")}
        >
          ĐANG THEO DÕI
        </Link>
      }

      {getToken() &&
        <a onClick={() => handleClick('article')} className="nav-link">
          <Button style={{ backgroundColor: "#5488c7", borderColor: "#5488c7", color: "#fff" }}>
            <span><FontAwesomeIcon icon={faPen} /> VIẾT BÀI</span>
          </Button>
        </a>
      }

      {getToken() &&
        <a onClick={() => handleClick('series')} className="nav-link">
          <Button style={{ backgroundColor: "#5488c7", borderColor: "#5488c7", color: "#fff" }}>
            <span><FontAwesomeIcon icon={faPlus} /> TẠO SERIES</span>
          </Button>
        </a>
      }
    </nav>
  );
};

export default TabArticleList;
