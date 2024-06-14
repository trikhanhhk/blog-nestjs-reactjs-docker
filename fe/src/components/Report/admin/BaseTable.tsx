import { Button, DatePicker, Empty, Form, Space, TimeRangePickerProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { PaginationData } from '../../../types/Pagination';
import SearchLive from '../../common/SearchLive';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Column } from '../../../types/Column';
import DataTable from '../../common/DataTable';
import { functionChange } from '../../../type';

type handleChangeFilter = (search: string | null, itemPerPage: number, currentPage: number,
  idReport: number | null, selectedItem: string, fromDate: string | null, toDate: string | null) => void;

interface Props {
  columns: Column[];
  listReport: any[];
  onChangeFilter: handleChangeFilter;
  paging: PaginationData | undefined;
}

const BaseTable: React.FC<Props> = (props) => {
  const { columns, listReport, onChangeFilter, paging } = props;

  const [itemsPerPage, setItemPerPage] = useState<number>(10);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [keywordSearch, setKeywordSearch] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<string>('');

  const [idReport, setIdReport] = useState<number | null>(null);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null)

  const { RangePicker } = DatePicker;

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      setFromDate(dateStrings[0]);
      setToDate(dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: '7 ngày trước', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '14 ngày trước', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '30 ngày trước', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '90 ngày trước', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  const handleSelectedItem = (data: string[]) => {
    setSelectedItem(data.join(','));
  }

  const clearFilter = () => {
    setKeywordSearch(null);
    setFromDate(null);
    setToDate(null)
  }

  useEffect(() => {
    onChangeFilter(keywordSearch, itemsPerPage, currentPage, idReport, selectedItem, fromDate, toDate);
  }, [keywordSearch, itemsPerPage, currentPage, idReport, selectedItem, fromDate, toDate])

  return (
    <div>
      <div className="d-flex gap-1 mb-3">
        <Form
          size="large"
          autoComplete="off"
          layout='vertical'
        >
          <Space>
            <Form.Item
              label="Lọc theo thời gian"
            >
              <Space direction="vertical" size={12}>
                <RangePicker presets={rangePresets} onChange={onRangeChange} />
              </Space>
            </Form.Item>

            <Form.Item
              label="Tìm kiếm theo từ khóa"
            >
              <SearchLive style={{ maxWidth: "300px" }} onChangKeyword={setKeywordSearch} />
            </Form.Item>

            <Form.Item
              label="Tìm kiếm theo ID bị report"
            >
              <SearchLive style={{ maxWidth: "300px" }} placeholder='Tìm kiếm theo ID bị report' onChangKeyword={setIdReport} />
            </Form.Item>

            <Form.Item
              label="Số hàng"
            >
              <select
                style={{ maxWidth: "150px" }}
                className="form-select"
                aria-label="Page Size" title="Page Size"
                onChange={(event) => setItemPerPage(+(event.target.value))}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="10" selected>10</option>
              </select>
            </Form.Item>
          </Space>
        </Form>
        <div className='btn-group'>
          <Button onClick={clearFilter}>
            Clear
          </Button>
        </div>
      </div>
      {listReport && listReport.length > 0 ?
        <div className='content__wrap'>
          <DataTable
            data={listReport}
            columns={columns}
            paging={paging}
            onPageChange={setCurrentPage}
            onChangeSelected={handleSelectedItem}
          />
        </div>
        :
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </div>
  )
}

export default BaseTable
