import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getListUser } from '../../services/UserService';
import { PaginationData } from '../../types/Pagination';
import { UserData } from '../../types/UserData';
import UserItems from '../user/UserItems';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';

const ResultSearchAuthor = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("text");

  const [paging, setPaging] = useState<PaginationData>();
  const [pageNumber, setPagNumber] = useState<number>(1);

  const [userList, setUserList] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        dispatch(actions.controlLoading(true));
        const response = await getListUser(search, "0", undefined, pageNumber, 20);
        dispatch(actions.controlLoading(false));

        const { data, pagination } = response.data;
        setUserList(data);
        setPaging(pagination);
      }
    }

    fetchData();
  }, [location]);

  return (
    <>
      <div className='toolbar'>
        <div className='toolbar-start'></div>
        <div className='toolbar-end'>{`Có ${paging?.itemCount} kết quả được tìm thấy`}</div>
      </div>
      <UserItems onChangePage={setPagNumber} paging={paging} userList={userList} />
    </>
  )
}

export default ResultSearchAuthor
