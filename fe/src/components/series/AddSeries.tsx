import React from 'react'
import SeriesEditor from './SeriesEditor'
import { createSeries } from '../../services/SeriesSerivce'
import { toast } from 'react-toastify'
import Seo from '../common/SEO'
import { useNavigate } from 'react-router-dom'

const AddSeries = () => {
  const navigation = useNavigate();

  const handleSubmit = async (data: any) => {
    const response = await createSeries(data);
    if (response) {
      toast.info("Thêm series thành công");
      navigation(`/series/detail?seriesId=${response.data.data.id}`);
    }
  }
  return (
    <>
      <Seo title='Thêm Series'
        metaDescription='Thêm Series mới'
        metaKeywords='Thêm Series'
      />
      <h2>Thêm Series mới</h2>
      <SeriesEditor handleSubmit={handleSubmit} />
    </>
  )
}

export default AddSeries
