import React from 'react'
import { Link } from 'react-router-dom';

interface Props {
  userId: number;
  userName?: string;
  classSize?: string
  email?: string
}

const LinkToProfile: React.FC<Props> = (props) => {
  const { userId, userName, classSize, email } = props;
  return (
    <div>
      <Link className={`${classSize ? classSize : "h6"} btn-link`} to={`/user/profile?userId=${userId}`}>
        {userName}
      </Link>
      <br />
      <label style={{ fontSize: "10px" }}>
        {email && email}
      </label>
    </div>
  )
}

export default LinkToProfile
