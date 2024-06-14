import React, { useEffect, useState } from 'react';
import { formatDateTime } from '../../untils/time-format';
import { NotificationData } from '../../types/NotificationData';

interface Props {
  notification: NotificationData;
}

const NotificationItem: React.FC<Props> = (props) => {
  const { notification } = props;
  const [pathNotification, setPathNotification] = useState<string>('#');

  useEffect(() => {
    if (notification.type === "COMMENT") {
      setPathNotification(`/blog/view?id=${notification.relatedId}`)
    } else if (notification.type === "REPORT_RESULT") {
      setPathNotification(`/user/notification?id=${notification.id}`)
    }
  }, [notification])

  return (
    <div className={`list-group-item list-group-item-action d-flex align-items-start mb-3 ${notification.read ? '' : 'unread-notification'}`}>
      <div className="flex-grow-1 ">
        <a href={pathNotification} className="h6 d-block mb-0 stretched-link text-decoration-none">
          <p dangerouslySetInnerHTML={{ __html: notification.content || '' }} className='article-description'></p>
        </a>
        <small className="text-muted">{formatDateTime(notification.createdAt)}</small>
      </div>
    </div>
  )
}

export default NotificationItem
