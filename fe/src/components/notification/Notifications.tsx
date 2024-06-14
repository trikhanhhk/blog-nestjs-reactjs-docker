import React, { useEffect, useState } from 'react'
import { getCurrentLogin } from '../../services/AuthService'
import { getNotifications, getNotificationsAdmin, updateRead } from '../../services/NotificationService';
import { PaginationData } from '../../types/Pagination';
import NotificationItem from './NotificationItem';
import { BellOutlined } from '@ant-design/icons';
import { NotificationData } from '../../types/NotificationData';
import { Badge, ButtonGroup, Dropdown, DropdownButton, Tab, Tabs } from 'react-bootstrap';
import { transform } from 'typescript';

const Notification = () => {
  const roleUser = getCurrentLogin().role;

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const [itemPerPage, setItemPerPage] = useState<number>(5);

  const [page, setPage] = useState<number>(1);

  const [paging, setPaging] = useState<PaginationData>();

  const [unreadTotal, setUnreadTotal] = useState<number>(0);

  const [notificationsAdmin, setNotificationsAdmin] = useState<NotificationData[]>([]);

  const [itemPerPageAdmin, setItemPerPageAdmin] = useState<number>(5);

  const [pageAdmin, setPageAdmin] = useState<number>(1);

  const [pagingAdmin, setPagingAdmin] = useState<PaginationData>();

  const [unreadTotalAdmin, setUnreadTotalAdmin] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotifications(itemPerPage, page);
      if (response) {
        const list = response.data.data.notifications;
        const paging = response.data.pagination;
        setUnreadTotal(response.data.data.unreadTotal)
        setNotifications(list);
        setPaging(paging);
      }
    };

    fetchData();
  }, []);

  if (roleUser === "ADMIN") {
    useEffect(() => {
      const fetchData = async () => {
        const response = await getNotificationsAdmin(itemPerPage, page);
        if (response) {
          const list = response.data.data.notifications;
          const paging = response.data.pagination;
          setUnreadTotalAdmin(response.data.data.unreadTotal)
          setNotificationsAdmin(list);
          setPagingAdmin(paging);
        }
      }
      fetchData();
    }, []);
  }

  const handUpdateRead = async (id: number) => {
    const response = await updateRead(id);

    if (response) {
      const item = response.data.data;
      setUnreadTotal(prev => prev - 1);
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === item.id) {
          return item;
        }
        return notification;
      });

      setNotifications(updatedNotifications);
    }
  }

  return (

    <div className="dropdown ms-auto">
      <Dropdown
        id="notification"
        data-bs-theme="light"
      >
        <Dropdown.Toggle variant="">
          <BellOutlined style={{ fontSize: "20px" }} />
          {(unreadTotal + unreadTotalAdmin) > 0 && <Badge bg="danger">{roleUser === "ADMIN" ? (unreadTotal + unreadTotalAdmin) + "" : unreadTotal + ""}</Badge>}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Tabs
            defaultActiveKey="general"
            id="uncontrolled-tab-example"
            className="mb-3 border-bottom py-2 w-md-300px"
            justify
          >

            <Badge bg="danger">{unreadTotal + ""}</Badge>
            <Tab eventKey="general" title={
              <>
                <span style={{ color: 'black' }}>Thông báo</span>
                {unreadTotal > 0 && <Badge bg="danger">{unreadTotal + ""}</Badge>}
              </>
            }>
              <div className="list-group list-group-borderless">
                {/* List item */}
                {notifications && notifications.map(item => (
                  <div key={item.id} onClick={() => handUpdateRead(item.id)}>
                    <NotificationItem notification={item} />
                  </div>
                ))}

                <div className="text-center mb-2">
                  <a href="#" className="btn-link">Xem các thông báo cũ hơn</a>
                </div>

              </div>
            </Tab>

            {roleUser === "ADMIN" &&

              <Tab eventKey="profile" title={
                <>
                  <span style={{ color: 'black' }}>Admin</span>
                  {unreadTotalAdmin > 0 && <Badge bg="danger">{unreadTotalAdmin + ""}</Badge>}
                </>
              }>
                {notificationsAdmin && notificationsAdmin.map(item => (
                  <div key={item.id} onClick={() => handUpdateRead(item.id)}>
                    <NotificationItem notification={item} />
                  </div>
                ))}

                <div className="text-center mb-2">
                  <a href="#" className="btn-link">Xem các thông báo cũ hơn</a>
                </div>
              </Tab>
            }
          </Tabs>
        </Dropdown.Menu>
      </Dropdown>
    </div >

  )
}

export default Notification
