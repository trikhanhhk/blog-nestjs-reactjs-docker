import React, { useEffect, useState } from 'react';
import { Article } from '../../../types/Article';
import { PaginationData } from '../../../types/Pagination';
import DataTable from '../../common/DataTable';
import { Column } from '../../../types/Column';
import { formatDateTime2 } from '../../../untils/time-format';
import { getSeriesList } from '../../../services/SeriesSerivce';
import * as actions from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import Seo from '../../common/SEO';

const ManagerSeries = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [refreshData, setRefreshData] = useState(Date.now());

  const [listSeries, setListSeries] = useState<Article[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemPerPage, setItemPerPage] = useState<number>(parseInt(searchParams.get('itemPerPage') || '10'));

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));

  const [keywordSearch, setKeywordSearch] = useState<string>(searchParams.get('search') || '');

  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const handleDeleteUser = () => {

  }

  const confirm = (userId: number) => {

  }

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },
    {
      name: "Title",
      element: (row: { title: string; }) => <p className='article-description' style={{ maxWidth: "200px" }}>{row.title}</p>
    },

    {
      name: "Mô tả",
      element: (row: { description: string }) => <div className='article-description lh-lg' dangerouslySetInnerHTML={{ __html: row.description || '' }} style={{ maxWidth: "400px" }}></div>
    },

    {
      name: "Tác giả",
      element: (row: { author: { first_name: string, last_name: string } }) => <>{`${row.author.first_name} ${row.author.last_name}`}</>
    },

    {
      name: "Ngày Tạo",
      element: (row: { createdAt: string }) => <>{formatDateTime2(row.createdAt)}</>
    },

    {
      name: "Action",
      element: (row: { id: number; }) => (

        <Button title='Xem' className="btn btn-success" onClick={() => navigate(`/admin/series/view?seriesId=${row.id}`)}><FontAwesomeIcon icon={faEye} /></Button>
      )
    }
  ]

  useEffect(() => {

    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getSeriesList(keywordSearch, currentPage, itemPerPage, undefined);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      const data = response.data.data;
      const pagination = response.data.pagination;
      setListSeries(data);
      setPaging(pagination);
    }

    fetchData();
  }, [location, refreshData]);

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  return (
    <div>
      <Seo
        title='Quản lý series'
        metaDescription='Quản lý series'
        metaKeywords='Quản lý series'
      />
      <div className='content__wrap'>
        <DataTable
          name="Quản lý Series"
          addPath="/series/add"
          data={listSeries}
          columns={columns}
          paging={paging}
          onPageChange={(data) => {
            setCurrentPage(data);
            searchParams.set('page', data);
            changeUrl();
          }}

          onItemPerPageChange={(data) => {
            setItemPerPage(data);
            searchParams.set('itemPerPage', data);
            changeUrl();
          }}
          onSearchChange={(data) => {
            setKeywordSearch(data);
            searchParams.set('search', data);
            changeUrl();
          }}

          onChangeSelected={handleSelectedItem}
          onDelete={handleDeleteUser}
          defaultValueSearch={keywordSearch}
          defaultItemPerPage={itemPerPage}
        />
      </div>
    </div>
  )
}

export default ManagerSeries
