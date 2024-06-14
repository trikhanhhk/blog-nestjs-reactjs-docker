import React, { useEffect, useState } from 'react';
import { Article } from '../../../types/Article';
import { PaginationData } from '../../../types/Pagination';
import DataTable from '../../common/DataTable';
import { Column } from '../../../types/Column';
import { banArticle, deleteArticle, getArticles } from '../../../services/ArticleService';
import { formatDateTime2 } from '../../../untils/time-format';
import ViewArticleModal from './ViewArticleModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEye, faRotateLeft, faSquareCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import ButtonConfirm from 'button-confirm-tk';
import { toast } from 'react-toastify';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

const ManagerArticle = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [refreshData, setRefreshData] = useState(Date.now());

  const [listArticle, setListArticle] = useState<Article[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemPerPage, setItemPerPage] = useState<number>(parseInt(searchParams.get('itemPerPage') || '10'));

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));

  const [keywordSearch, setKeywordSearch] = useState<string>(searchParams.get('search') || '');

  const [selectedItem, setSelectedItem] = useState<string>('');

  const [isOpenViewArticle, setIsOpenViewArticle] = useState<boolean>(false);
  const [articleViewId, setArticleViewId] = useState<number | undefined>();

  const initDataStatus = (type: "status") => {
    const data = searchParams.get(type);

    if (data === "null" || data === undefined) {
      return undefined;
    }

    if (data === "1") {
      return "1";
    }

    if (data === "2") {
      return "2";
    }
  }

  const [status, setStatus] = useState<"1" | "2" | undefined>(() => initDataStatus("status"));

  const handleChangeData = (value: "1" | "2" | undefined, type: "status") => {

    setStatus(value)

    if (value) {
      searchParams.set(type, value);
    } else {
      searchParams.delete(type);
    }

    changeUrl();

  }

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const handleDeleteUser = () => {

  }

  const confirm = (userId: number) => {

  }

  const confirmDelete = async (id: number) => {
    dispatch(actions.controlLoading(true));
    const response = await deleteArticle(id);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Đã xóa bài viết");
    setRefreshData(Date.now());
  }

  const confirmBan = async (id: number, status: number) => {
    dispatch(actions.controlLoading(true));
    const response = await banArticle(id, status);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Thành công");
    setRefreshData(Date.now());
  }

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },

    {
      name: "",
      element: (row: { thumbnail: string }) => <img src={`${process.env.REACT_APP_URL_MINIO}${row.thumbnail}`} style={{ width: "70px" }} />
    },

    {
      name: "Title",
      element: (row: { title: string; }) => <p className='article-description' style={{ maxWidth: "200px" }}>{row.title}</p>
    },

    {
      name: "Mô tả ngắn",
      element: (row: { description: string }) => <p className='article-description' style={{ maxWidth: "250px" }}>{row.description}</p>
    },

    {
      name: "Keyword",
      element: (row: { keyword: string }) => <p className='article-description' style={{ maxWidth: "150px" }}>{row.keyword}</p>
    },

    {
      name: (
        <Dropdown style={{ zIndex: "500" }} as={ButtonGroup}>
          <Button variant="info">{`Status${': ' + (status ? status == "1" ? "Published" : "Hạn chế" : 'Tất cả')}`}</Button>
          <Dropdown.Toggle split variant="success" />
          <Dropdown.Menu className="super-colors">
            <Dropdown.Item onClick={() => handleChangeData('1', "status")}>Published</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData('2', "status")}>Hạn chế</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData(undefined, "status")}>Tất cả</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      element: (row: { status: number }) => (<p className='article-description'>
        {row.status === 1 ?
          <FontAwesomeIcon
            style={{
              color: "green",
              fontSize: "25px"
            }}
            icon={faSquareCheck}
          />
          :

          <FontAwesomeIcon
            style={{
              color: "red",
              fontSize: "25px"
            }}
            icon={faBan}
          />
        }
      </p>),

      style: { textAlign: "center" }
    },

    {
      name: "Tag",
      element: (row: { tags: { id: number, tagName: string }[] }) => (
        <div style={{ maxWidth: "200px" }} className='d-flex gap-2 flex-wrap article-description'>
          {row.tags && row.tags.map(tag => (
            <div className="btn btn-xs btn-light">{tag.tagName}</div>
          ))}
        </div>
      )
    },

    {
      name: "Tác giả",
      element: (row: { author: { first_name: string, last_name: string } }) => <>{`${row.author.first_name} ${row.author.last_name}`}</>
    },

    {
      name: "Ngày Viết",
      element: (row: { createdAt: string }) => <>{formatDateTime2(row.createdAt)}</>
    },

    {
      name: "Action",
      element: (row: { id: number, status: number }) => (
        <div className="d-flex">

          <Button title='Xem nội dung' className="btn btn-success" onClick={() => {
            setArticleViewId(row.id);
            setIsOpenViewArticle(true);
          }}>
            <FontAwesomeIcon icon={faEye} />
          </Button>

          {/* <ButtonConfirm
            header='Cảnh báo'
            body='Bạn có chắc muốn xóa bài viết này'
            onConfirm={() => confirmDelete(row.id)}
            btnContent={<FontAwesomeIcon icon={faTrash} />}
            btnClass='btn btn-danger'
            okeTxt='Đồng ý'
            closeTxt='Đóng'
          /> */}

          <ButtonConfirm
            header='Cảnh báo'
            body={row.status === 1 ? 'Bài viết sẽ bị hạn chế và chỉ có tác giả mới đọc được bài này' : 'Bạn có muốn bỏ hạn chế bài viết này'}
            onConfirm={() => confirmBan(row.id, row.status === 1 ? 2 : 1)}
            btnContent={row.status === 1 ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faRotateLeft} />}
            btnClass={row.status === 1 ? 'btn btn-warning' : 'btn btn-primary'}
            okeTxt='Đồng ý'
            closeTxt='Đóng'
          />
        </div>
      )
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true))
      const response = await getArticles(itemPerPage, currentPage, null, null, keywordSearch, null, '', status);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      const data = response.data.data;
      const pagination = response.data.pagination;
      setListArticle(data);
      setPaging(pagination)
    }

    fetchData();

  }, [location, refreshData]);

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  return (
    <div>
      <div className='content__wrap'>
        <DataTable
          name="Quản lý bài viết"
          addPath="/blog/add"
          data={listArticle}
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

          defaultValueSearch={keywordSearch}
          defaultItemPerPage={itemPerPage}

          onChangeSelected={handleSelectedItem}
        // onDelete={handleDeleteUser}
        />
      </div>

      <ViewArticleModal articleId={articleViewId} isOpen={isOpenViewArticle} onClose={setIsOpenViewArticle} />
    </div>
  )
}

export default ManagerArticle
