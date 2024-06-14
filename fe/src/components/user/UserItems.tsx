import React from 'react'
import { UserData } from '../../types/UserData'
import { PaginationData } from '../../types/Pagination';
import UserItem from './UserItem';
import Pagination from '../common/Pagination';
import { functionChange } from '../../type';
import { Empty } from 'antd';

interface Props {
  userList: UserData[];
  paging: PaginationData | undefined;
  onChangePage: functionChange;
}

const UserItems: React.FC<Props> = (props) => {
  const { userList, paging, onChangePage } = props;
  return (
    <div>
      {userList.length > 0 ?
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}>
            {userList.map((user) => (
              <UserItem key={user.id} user={user} />
            ))}

          </div>
          {paging && <Pagination onChangePage={(page) => onChangePage(page)} paging={paging} />}
        </div>
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </div >
  )
}

export default UserItems
