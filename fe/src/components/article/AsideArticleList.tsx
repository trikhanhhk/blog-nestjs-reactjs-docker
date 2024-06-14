import React, { useEffect, useState } from 'react'
import { TagData } from '../../types/Tag'
import { getListTag } from '../../services/TagsService';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

const AsideArticleList = () => {
  const dispatch = useDispatch();


  const [tags, setTags] = useState<TagData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getListTag(10, 1, undefined, 'numberUse');
      dispatch(actions.controlLoading(false))
      if (!response) {
        return;
      }
      const tags = response.data.data;
      setTags(tags);
    }

    fetchData();
  }, [])

  return (
    <div className="col-lg-3 order-lg-1 mb-3 sidebar__inner scrollable-content">
      <span className="fs-4 mb-2 fw-bold text-capitalize">Top Tag</span>
      <div className="d-flex flex-column">
        {tags.slice(0, 5).map((tag, index) => (
          <a href={`/blog/list?tag=${tag.id}`} key={index} className="top-tag d-flex align-items-center justify-content-between border-bottom py-2">
            <span>{tag.tagName}</span>
            <span className="bg-green">{tag.numberUse}</span>
          </a>
        ))}
      </div>
      <div className="d-flex flex-wrap my-5">
        {tags.slice(5).map((tag, index) => (
          <a key={index} className="tag-item items bg-gray"
            data-bs-toggle="tooltip" data-bs-placement="top"
            title={tag.tagName} href={`/blog/list?tag=${tag.id}`}>{tag.tagName}</a>
        ))}
      </div>
    </div>
  );
}

export default AsideArticleList
