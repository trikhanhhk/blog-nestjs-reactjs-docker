import React from 'react'
import Seo from '../common/SEO'
import TagsEditor from './TagsEditor'

const AddTag = () => {
  return (
    <>
      <Seo
        metaDescription='Thêm mới tag'
        metaKeywords='Thêm mới tag'
        title='Thêm mới tag'
      />

      <div>
        <TagsEditor />
      </div>
    </>
  )
}

export default AddTag
