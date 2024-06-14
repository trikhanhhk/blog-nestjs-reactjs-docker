import { Tabs, TabsProps } from 'antd';
import ManagerReportArticle from './ManagerReportArticle';
import ManagerReportComment from './ManagerReportComment';

const ManagerReport = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Report Bài viết',
      children: <ManagerReportArticle />,
    },
    {
      key: '2',
      label: 'Report bình luận',
      children: <ManagerReportComment />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default ManagerReport
