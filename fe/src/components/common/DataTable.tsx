import React, { ChangeEvent, useEffect, useState } from 'react';
import { Column } from '../../types/Column';
import { PaginationData } from '../../types/Pagination';
import SearchLive from './SearchLive';
import { DatePicker, Space, TimeRangePickerProps } from 'antd';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import ButtonConfirm from 'button-confirm-tk';

type handleChange = (value: any) => void;
type handleChangeDate = (from: string, to: string) => void;
type handleDelete = () => void;
interface PropsTable {
  name?: string;
  addPath?: string;
  data: any[];
  columns: Column[];
  paging?: PaginationData;
  onPageChange: handleChange;
  onItemPerPageChange?: handleChange;
  onSearchChange?: handleChange;
  onDateChange?: handleChangeDate;
  onChangeSelected?: handleChange;
  onDelete?: handleDelete;
  defaultValueSearch?: string;
  defaultItemPerPage?: number;
}

const DataTable: React.FC<PropsTable> = (props: PropsTable) => {
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  const { RangePicker } = DatePicker;

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      onDateChange && onDateChange(dateStrings[0], dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  const { name, addPath, data, columns, paging, onPageChange, onItemPerPageChange, onSearchChange, onChangeSelected, onDelete, onDateChange, defaultValueSearch, defaultItemPerPage } = props;
  const renderHeader = () => {
    return columns?.map((col, index) => <th style={col.style ? col.style : {}} key={index}>{col.name}</th>)
  }

  const onSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const checked = event.target.checked;
    if (checked) {
      if (!selectedItem.includes(value)) {
        setSelectedItem([...selectedItem, value]);
      }
    } else {
      setSelectedItem(prevSelected => {
        return prevSelected.filter(id => id !== value);
      });
    }
  }

  const onselectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      const temp = data.map(item => String(item.id));
      setSelectedItem(temp);
    } else {
      setSelectedItem([]);
    }
  }


  useEffect(() => {
    onChangeSelected && onChangeSelected(selectedItem);
    console.log('Selected item', selectedItem);
  }, [selectedItem])

  const renderData = () => {
    return data?.map((item, index) => (
      <tr key={index}>
        <td key={`checkbox_${index}`}><input checked={selectedItem.includes(String(item.id))} onChange={(event) => onSelected(event)} value={item.id} type='checkbox' className="form-check-input" /></td>
        {
          columns?.map((col, idx) => <td style={col.style ? col.style : {}} key={idx}>{col.element(item)}</td>)
        }
      </tr>
    ))
  }

  const confirmDelete = () => {
    onDelete && onDelete();
  }

  return (
    <div className="card">
      <div className="card-header -4 mb-3">
        {name && <h2 className="card-title mb-3">{name}</h2>}
        <div className="row">

          {/* Left toolbar */}
          <div className="col-md-6 d-flex gap-1 align-items-center mb-3">
            {addPath &&
              <Link to={addPath} className="btn btn-primary hstack gap-2 align-self-center">
                <FontAwesomeIcon icon={faCirclePlus} />
                <span className="vr"></span>
                Thêm mới
              </Link>
            }
            {onDelete && <ButtonConfirm
              header='Cảnh báo'
              body='Bạn có chắc muốn xóa những người này'
              onConfirm={confirmDelete}
              btnContent={<FontAwesomeIcon icon={faTrash} />}
              btnClass='btn btn-danger'
              okeTxt='Đồng ý'
              closeTxt='Thôi'
            />}
          </div>
          {/* END : Left toolbar */}

          {/* Right Toolbar */}
          <div className="col-md-6 d-flex gap-1 align-items-center justify-content-md-end mb-3">
            {onDateChange &&
              <div className='form-group'>
                <Space direction="vertical" size={12}>
                  <RangePicker presets={rangePresets} onChange={onRangeChange} />
                </Space>
              </div>
            }

            {onSearchChange &&
              <div className='form-group'>
                <SearchLive defaultValue={defaultValueSearch} onChangKeyword={onSearchChange} />
              </div>
            }
            <div className="btn-group">
              {onItemPerPageChange &&
                <select className="form-select" aria-label="Page Size" title="Page Size" defaultValue={defaultItemPerPage && defaultItemPerPage} onChange={(event) => {
                  onItemPerPageChange(+(event.target.value));
                }}>
                  <option value="10" selected>10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              }
            </div>
          </div>
          {/* END : Right Toolbar */}

        </div>
      </div>

      <div className="card-body">
        <div className="table-responsove">
          <div className='toolbar'>
            <div className='toolbar-start'></div>
            <div className='toolbar-end'>
              {paging && <>{`Hiển thị ${data.length} trong tổn số ${paging.itemCount} bản ghi`}</>}
            </div>
          </div>
          <table className="table table-striped" style={{ minHeight: "350px" }}>
            <thead>
              <tr>
                <td><input type='checkbox' onChange={(event) => onselectAll(event)} value="multiple" className="form-check-input" /></td>
                {renderHeader()}
              </tr>
            </thead>
            <tbody>
              {renderData()}
            </tbody>
          </table>
        </div>

        {paging && <Pagination onChangePage={onPageChange} paging={paging} />}
      </div >
    </div >
  )
}

export default DataTable
