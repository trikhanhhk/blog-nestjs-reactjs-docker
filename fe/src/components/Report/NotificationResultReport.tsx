import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import { getDetailReportArticle, getDetailReportComment } from '../../services/ReportService';
import { getOneNotification } from '../../services/NotificationService';
import { NotificationData } from '../../types/NotificationData';

const NotificationResultReport = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [title, setTitle] = useState<string>('');

  const [notification, setNotification] = useState<NotificationData>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }

      const response = await getOneNotification(+id);

      if (!response) return;

      const notificationData = response.data.data;
      setNotification(notificationData);

    }

    fetchData();
  }, [id, type]);

  return (
    <Container>
      {notification &&
        <div className="mb-4">
          <h3 dangerouslySetInnerHTML={{ __html: notification.content || '' }}></h3>
          <div className='row' dangerouslySetInnerHTML={{ __html: notification.contentDetail || '' }}>

          </div>
        </div>
      }
    </Container>
  )
}

export default NotificationResultReport
