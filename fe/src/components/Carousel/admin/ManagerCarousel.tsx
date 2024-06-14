import React, { useEffect, useState } from 'react'
import DataTable from '../../common/DataTable'
import { SliderType } from '../../../types/SliderType'
import { Column } from '../../../types/Column';
import { Button, ButtonGroup, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PaginationData } from '../../../types/Pagination';
import { deleteMultipleSlider, deleteOneSlider, getSliders } from '../../../services/CarouseService';
import { useLocation, useNavigate } from 'react-router-dom';
import ToggleButtonStatus from './ToggleButtonStatus';
import * as actions from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import ButtonConfirm from 'button-confirm-tk';
import Seo from '../../common/SEO';

const ManagerCarousel = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sliders, setSliders] = useState<SliderType[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get("page") || "1"));

  const [itemPerPage, setItemPerPage] = useState<number>(parseInt(searchParams.get("itemPerPage") || "10"));

  const [keywordSearch, setKeywordSearch] = useState<string>(searchParams.get("search") || '');

  const [statusSearch, setStatusSearch] = useState<string | undefined | null>(searchParams.get("status"));

  const [refreshData, setRefreshData] = useState(Date.now());

  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const handleDeleteSlider = async () => {
    if (!selectedItem) {
      toast.error('Không có user nào được chọn');
      return;
    }

    dispatch(actions.controlLoading(true));
    const response = await deleteMultipleSlider(selectedItem);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Xóa slide thành công", { position: "top-right" });
    setRefreshData(Date.now());
  }

  const confirmDelete = async (id: number) => {
    dispatch(actions.controlLoading(true));
    const response = await deleteOneSlider(id);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Xóa slide thành công", { position: "top-right" });
    setRefreshData(Date.now());
  }

  const handleChangeStatus = (status: string | undefined) => {
    setStatusSearch(status);
    if (status === undefined) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    changeUrl();
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getSliders(itemPerPage, currentPage, keywordSearch, statusSearch);
      dispatch(actions.controlLoading(false));

      if (!response) {
        return;
      }

      const data = response.data.data;
      const paging = response.data.pagination;

      setSliders(data);
      setPaging(paging);
    }

    fetchData();

  }, [location, refreshData]);

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },

    {
      name: "Tiêu đề",
      element: (row: { name: string }) => <>{row.name}</>
    },

    {
      name: "Mô tả",
      element: (row: { description: string; }) => <>{row.description}</>
    },

    {
      name: "Link",
      element: (row: { link: string; }) => <>{row.link}</>
    },

    {
      name: "Ảnh",
      element: (row: { imagePath: string; }) => <><img src={`${process.env.REACT_APP_URL_MINIO}${row.imagePath}`} style={{ width: "250px" }} /></>,
      style: { width: "250px !important" }
    },

    {
      name: (
        <Dropdown style={{ zIndex: "500" }} as={ButtonGroup}>
          <Button variant="info">{`Trạng thái${': ' + (statusSearch ? statusSearch : 'Tất cả')}`}</Button>
          <Dropdown.Toggle split variant="success" />
          <Dropdown.Menu className="super-colors">
            <Dropdown.Item onClick={() => handleChangeStatus('on')}>On</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeStatus('off')}>Off</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeStatus(undefined)}>Tất cả</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      element: (row: { status: "on" | "off", id: number }) => (
        <ToggleButtonStatus status={row.status} id={row.id} />
      ),

      style: { textAlign: "center" }
    },

    {
      name: "Action",
      element: (row: { id: number; }) => (
        <div style={{ textAlign: "center", display: "flex" }}>
          <Button title='Xem & chỉnh sửa' className="btn btn-success" onClick={() => navigate(`/admin/slider/edit?id=${row.id}`)}>
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <ButtonConfirm
            header='Cảnh báo'
            body='Bạn có chắc muốn xóa slide này'
            onConfirm={() => confirmDelete(row.id)}
            btnContent={<FontAwesomeIcon icon={faTrash} />}
            btnClass='btn btn-danger'
            okeTxt='Đồng ý'
            closeTxt='Đóng'
          />
        </div>
      ),

      style: { textAlign: "center", margin: "0 auto" }

    }
  ];

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  return (
    <div className='content__wrap'>
      <Seo
        title='Quản lý Slider'
        metaDescription='Quản lý Slider'
        metaKeywords='Quản lý Slider'
      />
      <DataTable
        name="Quản lý Slider"
        data={sliders}
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
        onDelete={handleDeleteSlider}
        addPath='/admin/slider/add'
        defaultValueSearch={keywordSearch}
        defaultItemPerPage={itemPerPage}
      />
    </div>
  )
}

export default ManagerCarousel
