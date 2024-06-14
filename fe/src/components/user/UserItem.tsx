import React from 'react'
import { UserData } from '../../types/UserData'
import { Link } from 'react-router-dom';
import BtnFollow from '../common/BtnFollow';

interface Props {
  user: UserData
}

const UserItem: React.FC<Props> = (props) => {
  const user = props.user;
  const avatarPath = user.avatarPath;
  return (
    <div className="card user-item-card">
      <div className="card-body">
        {/* Profile picture and short information */}
        <div className="d-flex align-items-center position-relative pb-3">
          <div className="flex-shrink-0">
            <img className="img-md rounded-circle" src={avatarPath && avatarPath != "" ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} alt="Profile Picture" loading="lazy" />
          </div>
          <div className="flex-grow-1 ms-3">
            <Link to={`/user/profile?userId=${user.id}`} className="h5 stretched-link btn-link">{`${user.first_name} ${user.last_name}`}</Link>
            <p className="text-muted m-0">{user.email}</p>
            <p className="text-muted m-0">{user.career && user.career}</p>
          </div>
        </div>
        <p>{user.career}</p>
        {/* END : Profile picture and short information */}

        {/* Options buttons */}
        <div className="mt-3 pt-2 text-center border-top">
          <div className="d-flex justify-content-center gap-3">
            <BtnFollow userId={user.id} />
          </div>
        </div>
        {/* END : Options buttons */}

      </div>
    </div>
  )
}

export default UserItem
