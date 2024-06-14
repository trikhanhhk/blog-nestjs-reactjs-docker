import React, { useEffect, useState } from 'react'
import { getUserFollowers, getUserFollowing } from '../../services/UserService';
import { UserData } from '../../types/UserData';
import { PaginationData } from '../../types/Pagination';
import UserItem from './UserItem';
import Pagination from '../common/Pagination';
import { Empty } from 'antd';
import UserItems from './UserItems';

interface Props {
  userId: string | null;
  type: "follower" | "following";
}

const UserList: React.FC<Props> = (props) => {
  const userId = props.userId;
  const [userList, setUserList] = useState<UserData[]>([]);
  const [paging, setPaging] = useState<PaginationData>();
  const [page, setPage] = useState<number>(1)
  useEffect(() => {
    if (userId) {
      if (props.type === 'follower') {
        getUserFollowers(parseInt(userId), page).then((response) => {
          const data = response.data;
          setUserList(data.data);
          setPaging(data.pagination);
        })
      } else if (props.type === 'following') {
        getUserFollowing(parseInt(userId), page).then((response) => {
          const data = response.data;
          setUserList(data.data);
          setPaging(data.pagination);
        })
      }
    }
  }, [userId])
  return (
    <UserItems onChangePage={setPage} paging={paging} userList={userList} />
  )
}

export default UserList
