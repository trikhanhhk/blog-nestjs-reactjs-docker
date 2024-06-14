import { useEffect, useState } from 'react'
import DataTable from '../../common/DataTable';
import { UserData } from '../../../types/UserData';
import { Column } from '../../../types/Column';
import { useDispatch } from 'react-redux';
import * as actions from '../../../redux/actions';
import { toast } from "react-toastify";
import { PaginationData } from '../../../types/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteMultipleUser, deleteOneUser, getListUser, restoreUser, updateStatusUser } from '../../../services/UserService';
import ButtonConfirm from 'button-confirm-tk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faLockOpen, faRotateLeft, faTrash, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime2 } from '../../../untils/time-format';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { faSquareCheck, faSquareMinus } from '@fortawesome/free-regular-svg-icons';

const ListUser = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [refreshData, setRefreshData] = useState(Date.now());

  const [listUser, setListUser] = useState<UserData[]>([]);

  const [paging, setPaging] = useState<PaginationData>();

  const [itemsPerPage, setItemPerPage] = useState<number>(parseInt(searchParams.get("itemsPerPage") || "10"));

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get("page") || "1"));

  const [keywordSearch, setKeywordSearch] = useState<string>(searchParams.get("search") || '');

  const initDataStatus = (type: "status" | "isDelete") => {
    const data = searchParams.get(type);

    if (data === "null" || data === undefined) {
      return undefined;
    }

    if (data === "1") {
      return "1";
    }

    if (data === "0") {
      return "0";
    }
  }

  const [isDelete, setIsDelete] = useState<"0" | "1" | undefined>(() => initDataStatus('isDelete'));

  const [status, setStatus] = useState<"0" | "1" | undefined>(() => initDataStatus('status'));

  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const updateStatus = async (id: number, status: 0 | 1) => {
    dispatch(actions.controlLoading(true));
    const res = await updateStatusUser(id, status);
    dispatch(actions.controlLoading(false));

    if (!res) return;

    setRefreshData(Date.now());
  }

  const handleDeleteUser = async () => {
    if (!selectedItem) {
      toast.error('Không có user nào được chọn');
      return;
    }

    dispatch(actions.controlLoading(true));
    const response = await deleteMultipleUser(selectedItem);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Đã xóa nhiều người dùng", { position: "top-right" });
    setRefreshData(Date.now());

  }

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  const confirmDelete = async (userId: number) => {
    dispatch(actions.controlLoading(true));
    const response = await deleteOneUser(userId);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info("Đã xóa người dùng", { position: "top-right" });
    setRefreshData(Date.now());
  }

  const confirmRestoreDelete = async (id: number) => {
    dispatch(actions.controlLoading(true));
    const response = await restoreUser(id);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info(`Đã khôi phục user: ${response.data.data.id} |  ${response.data.data.first_name}  ${response.data.data.last_name}`);
    setRefreshData(Date.now());
  }

  const handleChangeData = (value: "0" | "1" | undefined, type: "status" | "isDelete") => {

    type === "status" ? setStatus(value) : setIsDelete(value);

    if (value) {
      searchParams.set(type, value);
    } else {
      searchParams.delete(type);
    }

    changeUrl();

  }

  const columns: Column[] = [
    {
      name: "ID",
      element: (row: { id: number; }) => <>{row.id}</>
    },

    {
      name: "Avatar",
      element: (row: { avatarPath: string }) => (
        <img
          src={row.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${row.avatarPath}` : "/assets/img/profile-photos/5.png"}
          alt="Avatar"
          className="rounded-circle"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      )
    },

    {
      name: "Họ tên",
      element: (row: { first_name: string; last_name: string }) => <>{`${row.first_name} ${row.last_name}`}</>
    },

    {
      name: "Email",
      element: (row: { email: string }) => <>{row.email}</>
    },

    {
      name: (
        <Dropdown style={{ zIndex: "500" }} as={ButtonGroup}>
          <Button variant="info">{`Trạng thái xóa${': ' + (isDelete ? isDelete == "1" ? "Đã xóa" : "Chưa xóa" : 'Tất cả')}`}</Button>
          <Dropdown.Toggle split variant="success" />
          <Dropdown.Menu className="super-colors">
            <Dropdown.Item onClick={() => handleChangeData('1', "isDelete")}>Đã xóa</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData('0', "isDelete")}>Chưa xóa</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData(undefined, "isDelete")}>Tất cả</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      element: (row: { isDelete: 0 | 1 }) => <>{
        row.isDelete === 0 ?
          <FontAwesomeIcon
            icon={faSquareMinus}
            style={{
              color: "#9fcc2e",
              fontSize: "25px"
            }}
          />
          : <FontAwesomeIcon
            style={{
              color: "red",
              fontSize: "25px"
            }}
            icon={faSquareCheck}
          />

      }</>,
      style: { textAlign: "center" }
    },

    {
      name: (
        <Dropdown style={{ zIndex: "500" }} as={ButtonGroup}>
          <Button variant="info">{`Trạng thái hoạt động${': ' + (status ? status == "1" ? "Active" : "Inactive" : 'Tất cả')}`}</Button>
          <Dropdown.Toggle split variant="success" />
          <Dropdown.Menu className="super-colors">
            <Dropdown.Item onClick={() => handleChangeData('1', "status")}>Active</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData('0', "status")}>Inactive</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChangeData(undefined, "status")}>Tất cả</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      element: (row: { status: 0 | 1 }) => <>{
        row.status === 1 ?
          <FontAwesomeIcon
            icon={faSquareCheck}
            style={{
              color: "#9fcc2e",
              fontSize: "25px"
            }}
          />
          : <FontAwesomeIcon
            style={{
              color: "orange",
              fontSize: "25px"
            }}
            icon={faLock}
          />

      }</>,
      style: { textAlign: "center" }
    },

    {
      name: "Ngày cập nhật",
      element: (row: { updatedAt: string }) => <>{formatDateTime2(row.updatedAt)}</>
    },

    {
      name: "Action",
      element: (row: { id: number, isDelete: 0 | 1, status: 0 | 1 }) => (
        <div className="d-flex">
          <Button title='Xem & chỉnh sửa' className="btn btn-success" onClick={() => navigate(`/admin/user/view?userId=${row.id}`)}><FontAwesomeIcon icon={faEye} /></Button>
          <ButtonConfirm
            header={row.isDelete === 0 ? 'Cảnh báo!' : 'Chú ý!'}
            body={row.isDelete === 0 ? 'Bạn có chắc muốn xóa người này' : 'Bạn có chắc muốn khôi phục người này'}
            onConfirm={() => { row.isDelete === 0 ? confirmDelete(row.id) : confirmRestoreDelete(row.id) }}
            btnContent={row.isDelete === 0 ? <FontAwesomeIcon icon={faTrash} /> : <FontAwesomeIcon title='Khôi phục' icon={faRotateLeft} />}
            btnClass={row.isDelete === 0 ? 'btn btn-danger' : ''}
            okeTxt='Đồng ý'
            closeTxt='Đóng'
          />

          <ButtonConfirm
            header={row.status === 1 ? 'Cảnh báo!' : 'Chú ý!'}
            body={row.status === 1 ? 'Bạn có chắc muốn đưa người này vào danh sách hạn chế' : 'Bạn có chắc muốn khôi phục status người này'}
            onConfirm={() => { updateStatus(row.id, row.status === 1 ? 0 : 1) }}
            btnContent={row.status === 1 ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon title='Khôi phục' icon={faLockOpen} />}
            btnClass={row.status === 1 ? 'btn btn-warning' : 'btn bt-success'}
            okeTxt='Đồng ý'
            closeTxt='Đóng'
          />
        </div>
      )
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getListUser(keywordSearch, isDelete, status, currentPage, itemsPerPage);

      if (!response) return;

      const data = response.data.data;
      const pagination = response.data.pagination;
      setListUser(data);
      setPaging(pagination);
      dispatch(actions.controlLoading(false));
    }

    fetchData();

  }, [refreshData, location]);
  return (
    <div>
      <div className='content__wrap'>
        <DataTable
          name="Quản lý người dùng"
          addPath="/admin/user/add"
          data={listUser}
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

          defaultValueSearch={searchParams.get("search") || ''}

          onChangeSelected={handleSelectedItem}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  )
}

export default ListUser
