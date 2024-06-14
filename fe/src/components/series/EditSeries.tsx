import React, { useEffect, useState } from 'react'
import Seo from '../common/SEO'
import SeriesEditor from './SeriesEditor'
import { editSeries, getDetailSeries } from '../../services/SeriesSerivce'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SeriesData } from '../../types/SeriesData';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

const EditSeries = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const seriesId = searchParams.get("seriesId");

  const [seriesData, setSeriesData] = useState<SeriesData>()

  const navigate = useNavigate();

  const fetchSeriesData = async () => {
    dispatch(actions.controlLoading(true));
    const res = await getDetailSeries(parseInt(seriesId || "-1"));
    dispatch(actions.controlLoading(false));

    if (!res) return;

    setSeriesData(res.data.data);
  }

  useEffect(() => {
    if (seriesId) {
      fetchSeriesData();
    }
  }, [seriesId])

  const handleSubmit = async (data: any) => {
    if (seriesId) {
      dispatch(actions.controlLoading(true));
      const res = await editSeries(data, +seriesId);
      dispatch(actions.controlLoading(false));

      if (!res) {
        return;
      }

      toast.info("Cập nhật series thành công");

      navigate(`/series/detail?seriesId=${seriesId}`);
    }
  }

  return (
    <div>
      <Seo title='Chỉnh sửa series'
        metaDescription='Chỉnh sửa series'
        metaKeywords='Chỉnh sửa series'
      />
      <h2>Chỉnh sửa series</h2>
      {seriesData && <SeriesEditor
        title={seriesData?.title}
        body={seriesData?.description}
        handleSubmit={handleSubmit}
      />}

    </div>
  )
}

export default EditSeries
