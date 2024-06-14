import React, { useEffect, useState } from 'react'
import { SeriesData } from '../../types/SeriesData';
import { PaginationData } from '../../types/Pagination';
import { getSeriesList } from '../../services/SeriesSerivce';
import SeriesItem from './SeriesItem';
import Pagination from '../common/Pagination';
import { functionChange } from '../../type';
import { toast } from 'react-toastify';
import { Empty } from 'antd';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

interface Props {
  searchTxt?: string | undefined;
  onSuccess?: functionChange;
  authorId?: string | null
}

const SeriesItems: React.FC<Props> = (props) => {
  const { searchTxt, onSuccess, authorId } = props;

  const dispatch = useDispatch();

  const [seriesList, setSeriesList] = useState<SeriesData[]>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationData>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getSeriesList(searchTxt, pageNumber, 10, authorId);
      dispatch(actions.controlLoading(false));

      if (!response) {
        return;
      }

      const data = response.data.data;
      const paging = response.data.pagination;

      setSeriesList(data);
      setPagination(paging);

      onSuccess && onSuccess(paging.itemCount);

    }

    fetchData();

  }, [searchTxt, pageNumber, authorId]);

  return (
    <div>
      {seriesList && seriesList.length > 0 ?
        (<div className="series-list-items">
          {seriesList.map((series, index) => (
            <div className='shadow p-3'>
              <SeriesItem key={index} seriesData={series} />
            </div>
          ))}
        </div>) :
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      {pagination && pagination.itemCount > 0 &&
        <Pagination onChangePage={setPageNumber} paging={pagination} />
      }
    </div>
  )
}

export default SeriesItems
