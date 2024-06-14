import React, { useState } from 'react'
import ArticleItems from '../article/ArticleItems';
import { useLocation } from 'react-router-dom';
import Seo from '../common/SEO';

const ResultArticleSearch: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("text");
  const [totalResult, setTotalResult] = useState<number>(0);

  return (
    <div>
      <div className='toolbar'>
        <div className='toolbar-start'></div>
        <div className='toolbar-end'>{`Có ${totalResult} kết quả tìm được tìm thấy`}</div>
      </div>
      <ArticleItems onSuccess={(value) => setTotalResult(value)} searchText={search || ''} />
    </div>
  )
}

export default ResultArticleSearch
