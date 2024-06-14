import React, { useEffect, useState } from 'react'
import { PaginationData } from '../../../types/Pagination';
import { Column } from '../../../types/Column';
import { formatDateTime2 } from '../../../untils/time-format';
import { Button, Tooltip } from 'antd';
import { FolderViewOutlined } from '@ant-design/icons';
import { getListReportArticle } from '../../../services/ArticleService';
import { ReportArticleData } from '../../../types/ReportArticleData';
import { Article } from '../../../types/Article';
import StatusReport from './StatusReport';
import BaseTable from './BaseTable';
import BtnViewArticle from '../../common/BtnViewArticle';
import * as actions from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const ManagerReportArticle = () => {
  const dispatch = useDispatch();

  const [refreshData, setRefreshData] = useState(Date.now());

  const [listReport, setListReport] = useState<ReportArticleData[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [keywordSearch, setKeywordSearch] = useState<string | null>(null);

  const [articleIdSearch, setArticleIdSearch] = useState<number | null>(null);

  const [selectedItem, setSelectedItem] = useState<string>('');

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const handleDeleteUser = () => {

  }

  const confirm = (userId: number) => {

  }

  const onChangeFilter = (search: string | null, itemPerPage: number, currentPage: number,
    articleSearch: number | null, selectedItem: string, fromDate: string | null, toDate: string | null) => {
    setKeywordSearch(search);
    setItemPerPage(itemPerPage);
    setCurrentPage(currentPage);
    setArticleIdSearch(articleSearch);
    setSelectedItem(selectedItem);
    setFromDate(fromDate);
    setToDate(toDate);
  }

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },

    {
      name: "Lý do",
      element: (row: { reason: number; }) => (
        <div>
          {row.reason === 1 ? "Spam" : ""}
          {row.reason === 2 ? "Vi phạm điều khoản" : ""}
          {row.reason === 3 ? "Quấy rồi" : ""}
          {row.reason === 4 ? "Vi phạm bản quyền" : ""}
          {row.reason === 5 ? "Bản dịch kém chất lượng" : ""}

        </div>
      )
    },

    {
      name: "Nhận xét",
      element: (row: { note: string }) => <p className='article-description' style={{ maxWidth: "200px" }}>{row.note}</p>
    },

    {
      name: "Bài viết",
      element: (row: { article: Article }) => (
        <>
          <p className='article-description' style={{ maxWidth: "200px" }}>{row.article.title}</p>
          <p><b>ID: </b>{row.article.id}</p>
        </>
      )
    },

    {
      name: "Người report",
      element: (row: { author: { first_name: string, last_name: string } }) => <>{`${row.author.first_name} ${row.author.last_name}`}</>
    },

    {
      name: "Ngày report",
      element: (row: { createdAt: string }) => <>{formatDateTime2(row.createdAt)}</>
    },

    {
      name: "Trạng thái",
      style: { textAlign: "center" },
      element: (row: { id: number, status: 1 | 2 | 3 }) => (
        <StatusReport type='article' onSubmit={setRefreshData} dataId={row.id} status={row.status} />
      )
    },

    {
      name: "Action",
      element: (row: { id: number, article: Article }) => (
        <div className="text-nowrap text-center">
          <BtnViewArticle articleId={row.id} />
        </div>
      )
    }
  ]

  useEffect(() => {

    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getListReportArticle(itemsPerPage, currentPage, keywordSearch, articleIdSearch, fromDate, toDate);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      const data = response.data.data;
      const pagination = response.data.pagination;

      setListReport(data);
      setPaging(pagination);
    }

    fetchData();
  }, [currentPage, itemsPerPage, keywordSearch, refreshData, fromDate, toDate]);
  return (
    <div>
      <h2 className="card-title mb-3">Quản lý report bài viết</h2>
      <BaseTable
        paging={paging}
        columns={columns}
        listReport={listReport}
        onChangeFilter={onChangeFilter}
      />
    </div>
  )
}

export default ManagerReportArticle
