import React, { useEffect, useState } from 'react';
import Seo from '../common/SEO'
import { useLocation } from 'react-router-dom';
import { TagData } from '../../types/Tag';
import TagsEditor from './TagsEditor';
import { getDetailTag } from '../../services/TagsService';

const EditTag = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("tagId");

  const [tagData, setTagData] = useState<TagData>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await getDetailTag(+id);

        if (response) {
          setTagData(response.data.data);
        }
      }
      fetchData();
    }
  }, [id]);

  return (
    <>
      <Seo
        metaDescription='Xem và sửa tag'
        metaKeywords='Xem và sửa tag'
        title='Xem và sửa tag'
      />
      <TagsEditor isEdit={true} tagData={tagData} />
    </>
  )
}

export default EditTag;
