import React from 'react';
import ItemWidget from './ItemWidget';
import { Link } from 'react-router-dom';
import { getCurrentLogin } from '../../services/AuthService';

const DashboardAdmin = () => {
  return (
    <>
      <div className='content__wrap'>
        <div className='row'>
          <ItemWidget background='bg-cyan' type='user' href={getCurrentLogin()?.role === 'ADMIN' ? `/admin/user/list` : "#"} />
          <ItemWidget background='bg-purple' type='article' href='/admin/blog/list' />
          <ItemWidget background='bg-orange' type='series' href='/admin/series/list' />
        </div>
      </div>
    </>
  )
}

export default DashboardAdmin
