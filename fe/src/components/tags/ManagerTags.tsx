import { useEffect, useState } from "react";
import { TagData } from "../../types/Tag";
import { PaginationData } from "../../types/Pagination";
import { Column } from "../../types/Column";
import { formatDateTime2 } from "../../untils/time-format";
import DataTable from "../common/DataTable";
import { deleteTag, getListTag, multipleDeleteTag } from "../../services/TagsService";
import Seo from "../common/SEO";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonConfirm from "button-confirm-tk";
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

const ManagerTags = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [refreshData, setRefreshData] = useState(Date.now());

  const [tags, setTags] = useState<TagData[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemPerPage, setItemPerPage] = useState<number>(parseInt(searchParams.get('itemPerPage') || '10'));

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));

  const [keywordSearch, setKeywordSearch] = useState<string>(searchParams.get('search') || '');

  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const handleDeleteMultipleTag = async () => {
    dispatch(actions.controlLoading(true));
    const response = await multipleDeleteTag(selectedItem);
    dispatch(actions.controlLoading(false));

    if (!response) {
      return;
    }

    toast.info("Đã xóa các tag");
    setRefreshData(Date.now());

  }

  const confirm = async (tagId: number) => {
    dispatch(actions.controlLoading(true));
    const response = await deleteTag(tagId);
    dispatch(actions.controlLoading(false));

    if (response) {
      toast.info('Đã xóa tag');
      setRefreshData(Date.now());
    }
  }

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },

    {
      name: "Tag Name",
      element: (row: { tagName: string; }) => <p className='article-description' style={{ maxWidth: "200px" }}>{row.tagName}</p>
    },

    {
      name: "Mô tả",
      element: (row: { description: string }) => <p className='article-description' style={{ maxWidth: "400px" }}>{row.description}</p>
    },

    {
      name: "Số lượt sử dụng",
      element: (row: { numberUse: string }) => <p className='article-description' style={{ maxWidth: "400px" }}>{row.numberUse}</p>
    },

    {
      name: "Ngày Tạo",
      element: (row: { createdAt: string }) => <>{formatDateTime2(row.createdAt)}</>
    },

    {
      name: "Action",
      element: (row: { id: number; }) => (
        <div className="d-flex">
          <Button title="Xem và chỉnh sửa" onClick={() => navigate(`/admin/tags/view?tagId=${row.id}`)}>
            <FontAwesomeIcon icon={faCircleInfo} />
          </Button>

          <ButtonConfirm
            key={row.id}
            onConfirm={() => confirm(row.id)}
            body="Bạn có chắc muốn xóa tag này"
            btnClass="btn btn-danger"
            btnContent={<FontAwesomeIcon icon={faTrash} />}
            okeTxt='Đồng ý'
            closeTxt='Đóng'
            header="Cảnh báo"
          />
        </div>
      )
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getListTag(itemPerPage, currentPage, keywordSearch, undefined);
      dispatch(actions.controlLoading(false));
      if (response) {
        const tags = response.data.data;
        const pagination = response.data.pagination;
        setTags(tags);
        setPaging(pagination);
      }
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
        metaDescription="Trang quản lý tags"
        metaKeywords="Quản lý tags"
        title="Quản lý tags"
      />
      <div className='content__wrap'>
        <DataTable
          name="Quản lý Tags"
          addPath="/admin/tags/add"
          data={tags}
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
          onDelete={handleDeleteMultipleTag}
          defaultValueSearch={keywordSearch}
          defaultItemPerPage={itemPerPage}
        />
      </div>
    </div>
  )
}


export default ManagerTags;
