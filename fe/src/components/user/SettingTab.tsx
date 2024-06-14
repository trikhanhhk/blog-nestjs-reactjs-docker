import { Tabs, TabsProps } from 'antd';
import React from 'react'
import { getCurrentLogin } from '../../services/AuthService';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';

const SettingTab: React.FC = () => {
  const currentLogin = getCurrentLogin();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin của tôi',
      children: <ProfileForm data={currentLogin} />,
    },
    {
      key: '2',
      label: 'Mật khẩu',
      children: <ChangePasswordForm data={currentLogin} />,
    },
    {
      key: '3',
      label: 'Các thông tin khác',
      children: "Chức năng đang được cập nhật",
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default SettingTab
