import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import SeriesItems from '../series/SeriesItems';
import Seo from '../common/SEO';

const ResultSearchSeries = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("text");

  const [itemCount, setItemCount] = useState<number>(0);

  return (
    <>
      <div className='toolbar'>
        <div className='toolbar-start'></div>
        <div className='toolbar-end'>{`Có ${itemCount} kết quả tìm được tìm thấy`}</div>
      </div>
      <SeriesItems searchTxt={search || undefined} onSuccess={setItemCount} />
    </>
  )
}

export default ResultSearchSeries
