import React from 'react'
import Seo from '../common/SEO'
import ArticleItems from './ArticleItems'

const ArticleFollow = () => {
  return (
    <>
      <Seo title={`Đang theo dõi`}
        metaDescription="Đang theo dõi"
        metaKeywords="Đang theo dõi"
      />

      <div className="container">
        <ArticleItems type='follow' />
      </div >
    </>

  )
}

export default ArticleFollow
