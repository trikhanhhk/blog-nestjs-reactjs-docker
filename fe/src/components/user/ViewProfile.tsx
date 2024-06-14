import React, { useEffect, useState } from 'react'
import ProfileUserTab from './ProfileUserTab'
import { useLocation } from 'react-router-dom';
import ProfileToolBar from './ProfileToolBar';

const ViewProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  console.log("userId", userId);


  return (
    <div className='shadow p-1'>
      <ProfileToolBar userId={parseInt(userId || "-1")} />
      <ProfileUserTab userId={userId || null} />
    </div>
  )
}

export default ViewProfile
