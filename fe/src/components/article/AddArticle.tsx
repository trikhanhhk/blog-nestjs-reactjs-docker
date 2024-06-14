import React from 'react';
import Seo from '../common/SEO';
import ArticleEditor from './ArticleEditor';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createArticle } from '../../services/ArticleService';
import { useNavigate } from 'react-router-dom';

const AddArticle: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (formData: FormData) => {
    dispatch(actions.controlLoading(true));
    const response = await createArticle(formData);
    dispatch(actions.controlLoading(false));

    if (!response) {
      return;
    }

    toast.info('Đã thêm bài viết');
    navigate(`/blog/edit?id=${response.data.data.id}`)
  };
  return (
    <>
      <Seo
        title="Thêm bài viết mới"
        metaKeywords="Thêm bài viết mới"
        metaDescription="Tạo bài viết mới với Viblo"
      />

      <div>
        <h2>Thêm bài viết mới</h2>
        <ArticleEditor submitArticle={handleSubmit} />
      </div>
    </>
  );
};

export default AddArticle;
