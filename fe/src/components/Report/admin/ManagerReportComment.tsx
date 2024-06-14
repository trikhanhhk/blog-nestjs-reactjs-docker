import React, { useEffect, useState } from 'react'
import { ReportCommentData } from '../../../types/ReportCommentData';
import { PaginationData } from '../../../types/Pagination';
import { Column } from '../../../types/Column';
import { CommentData, CommentItem } from '../../../types/CommentData';
import { formatDateTime2 } from '../../../untils/time-format';
import StatusReport from './StatusReport';
import { Button, Popconfirm, Spin, Tooltip } from 'antd';
import BtnViewArticle from '../../common/BtnViewArticle';
import { Article } from '../../../types/Article';
import { DeleteOutlined, FolderViewOutlined } from '@ant-design/icons';
import { getListReportComment } from '../../../services/CommentService';
import BaseTable from './BaseTable';

const ManagerReportComment = () => {
  const [refreshData, setRefreshData] = useState(Date.now());

  const [listReport, setListReport] = useState<ReportCommentData[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [keywordSearch, setKeywordSearch] = useState<string | null>(null);

  const [commentIdSearch, setCommentIdSearch] = useState<number | null>(null);

  const [selectedItem, setSelectedItem] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

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
    setCommentIdSearch(articleSearch);
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
      name: "Comment",
      element: (row: { comment: CommentItem }) => (
        <>
          <p className='article-description' style={{ maxWidth: "200px" }}>{row.comment.content}</p>
          <p><b>ID: </b>{row.comment.id}</p>
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
        <StatusReport type='comment' onSubmit={setRefreshData} dataId={row.id} status={row.status} />
      )
    },

    {
      name: "Action",
      element: (row: { id: number, article: Article }) => (
        <div className="text-nowrap text-center">
          <Tooltip title="Xem chi tiết">
            <Button type="primary"><a href={`/admin/report/detail?reportId=${row.id}&type=comment`}><FolderViewOutlined /></a></Button>
          </Tooltip>
          <BtnViewArticle articleId={row.id} />
          <Popconfirm
            title="Cảnh báo"
            description="Bạn có chắc muốn xóa Report này này"
            onConfirm={() => confirm(row.id)}
          >
            <Button type="dashed"><DeleteOutlined /></Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  useEffect(() => {
    setLoading(true);

    getListReportComment(itemsPerPage, currentPage, keywordSearch, commentIdSearch, fromDate, toDate).then(response => {
      if (response) {
        console.log("data report", response)
        const data = response.data.data;
        const pagination = response.data.pagination;

        setListReport(data);
        setPaging(pagination);
        setLoading(false);
      }
    }).catch(error => {
      console.log(error.data.data.message);
      setLoading(false)
    })
  }, [currentPage, itemsPerPage, keywordSearch, refreshData, fromDate, toDate]);
  return (
    <div>
      <h2 className="card-title mb-3">Quản lý report comment</h2>
      <Spin size="large" spinning={loading} tip="Loading...">
        <BaseTable
          paging={paging}
          columns={columns}
          listReport={listReport}
          onChangeFilter={onChangeFilter}
        />
      </Spin>
    </div>
  )
}

export default ManagerReportComment
