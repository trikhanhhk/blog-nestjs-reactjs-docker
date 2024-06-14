import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Seo from '../common/SEO';
import ArticleItems from './ArticleItems';
import AsideArticleList from './AsideArticleList';

const ArticleList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const authorId: string | null | undefined = searchParams.get("author");
  return (
    <>
      <Seo title={`Bài viết`}
        metaDescription="Bài viết vblo"
        metaKeywords="các bài viết vblo"
      />
      <div className="container articles-list">
        <div className="row">
          <ArticleItems authorId={authorId} tagId={searchParams.get("tag")} col={9} />
          <AsideArticleList />
        </div>
      </div>
    </>
  )
}

export default ArticleList;
