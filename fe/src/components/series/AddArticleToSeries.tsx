import { Button, Form, Input, Modal, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { functionChange } from '../../type';
import { Article } from '../../types/Article';
import { getArticles, updateSeriesArticle } from '../../services/ArticleService';
import { getCurrentLogin } from '../../services/AuthService';
import { toast } from 'react-toastify';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';

interface Props {
  seriesId: number;
  beforeValue?: number[];
  onSuccess: functionChange;
}

type FieldType = {
  numberOder: number;
  articleId: number;
}

const AddArticleToSeries: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const { seriesId, beforeValue, onSuccess } = props;

  const [searchValue, setSearchValue] = useState<string>('')

  const [form] = Form.useForm();

  const [articles, setArticles] = useState<Article[]>();

  const handleSubmit = async () => {
    const values: FieldType = await form.validateFields();
    if (values) {
      dispatch(actions.controlLoading(true));
      const response = await updateSeriesArticle(values.articleId, seriesId, values.numberOder);
      dispatch(actions.controlLoading(false));

      if (!response) {
        return;
      }

      const result = response?.data.data;
      toast.info("Thêm bài viết thành công")
      onSuccess(result);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  }

  useEffect(() => {
    const fetchArticle = async () => {
      const userLogin = getCurrentLogin();
      dispatch(actions.controlLoading(true));
      const response = await getArticles(50, 1, null, userLogin.id, searchValue, null, beforeValue?.join(","));
      dispatch(actions.controlLoading(false));

      if (!response) return;

      const result = response.data.data;
      setArticles(result);
    }

    fetchArticle();
  }, [searchValue, beforeValue])

  return (
    <Form
      form={form}
      name="basic"
      autoComplete="off"
      layout='vertical'
    >
      <Form.Item
        label="Thứ tự hiển thị"
        name="numberOder"
        rules={[{ required: true, message: "Vui lòng nhập thứ tự hiển thị" }]}
      >
        <Input type='number' />
      </Form.Item>
      <Form.Item
        label="Bài viết"
        name="articleId"
        rules={[{ required: true, message: "Vui lòng chọn bài viết" }]}
        style={{ width: "100%" }}
      >
        <Select placeholder="Chọn bài viết" onSearch={handleSearch}>
          {articles && articles.map((article, index) => (
            <Select.Option value={article.id}>
              {article.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button className='btn-primary' onClick={handleSubmit}>Lưu</Button>
      </Form.Item>

    </Form>
  )
}

export default AddArticleToSeries
