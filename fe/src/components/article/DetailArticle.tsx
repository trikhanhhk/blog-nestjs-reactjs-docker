import React from 'react'
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';
import ArticleContent from './ArticleContent';

const DetailArticle: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const status = searchParams.get("status");

  return (
    <>
      {id &&
        <>
          <ArticleContent status={status} withSeo={true} articleId={+id} />
        </>}
    </>
  )
}

export default DetailArticle