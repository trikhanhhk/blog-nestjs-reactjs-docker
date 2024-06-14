import React, { useEffect, useState } from 'react'
import Seo from '../common/SEO'
import { useLocation } from 'react-router-dom';
import ArticleEditor from './ArticleEditor';
import { getArticleEdit, updateArticle } from '../../services/ArticleService';
import { Article } from '../../types/Article';
import { toast } from 'react-toastify';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';

const EditArticle = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [articleData, setArticleData] = useState<Article | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;

    dispatch(actions.controlLoading(true));
    const response = await updateArticle(parseInt(id), formData);
    dispatch(actions.controlLoading(false));

    if (!response) {
      return;
    }

    toast.info("Cập nhật bài viết thành công")
  }

  useEffect(() => {
    const fetchArticleEdit = async () => {
      if (!id) return;

      dispatch(actions.controlLoading(true));
      const response = await getArticleEdit(parseInt(id));
      dispatch(actions.controlLoading(false));

      if (!response) return;

      setArticleData(response.data.data);

    }

    fetchArticleEdit();
  }, []);


  return (
    <>
      <Seo
        title='Chỉnh sửa bài viết'
        metaKeywords='Chỉnh sửa bài viếti'
        metaDescription='Chỉnh sửa bài viết Viblo'
      />
      {articleData &&
        <div>
          <h2>Chỉnh sửa bài viết</h2>
          <ArticleEditor
            title={articleData?.title}
            description={articleData?.description}
            body={articleData?.body}
            isEdit={true}
            keyword={articleData?.keyword}
            thumbnail={articleData?.thumbnail}
            submitArticle={handleSubmit}
            tag={articleData?.tags}
          />
        </div>
      }
    </>
  )
}

export default EditArticle
