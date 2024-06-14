import { Tabs, TabsProps } from 'antd';
import React, { useState } from 'react'
import ArticleItems from '../article/ArticleItems';
import UserList from './UserFlowList';
import SeriesItems from '../series/SeriesItems';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  userId: string | null;
}

const ProfileUserTab: React.FC<Props> = (props) => {
  const { userId } = props;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const navigate = useNavigate();

  if (!userId) return;

  const [currentTab, setCurrentTab] = useState<string>(searchParams.get("tab") || '1');

  const onChange = (key: string) => {
    setCurrentTab(key);
    searchParams.set("tab", key);
    searchParams.delete("page");
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Bài viết',
      children: <ArticleItems authorId={userId} />,
    },
    {
      key: '2',
      label: 'Series',
      children: <SeriesItems authorId={userId} />,
    },
    {
      key: '3',
      label: 'Người theo dõi',
      children: < UserList type='follower' userId={userId} />,
    },
    {
      key: '4',
      label: 'Đang theo dõi',
      children: < UserList type='following' userId={userId} />,
    },
  ];

  return (
    <div>
      <Tabs activeKey={currentTab} items={items} onChange={onChange} />
    </div>
  )
}

export default ProfileUserTab