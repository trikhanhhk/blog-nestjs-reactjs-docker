import React from 'react'
import { useLocation } from 'react-router-dom';
import ProfileToolBar from './ProfileToolBar';
import SettingTab from './SettingTab';

const SettingUser = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  console.log("userId", userId);


  return (
    <div className=''>
      <ProfileToolBar userId={parseInt(userId || "-1")} />
      <SettingTab />
    </div>
  )
}

export default SettingUser
