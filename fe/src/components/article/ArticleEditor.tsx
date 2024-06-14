import React, { useEffect, useState } from 'react';
import { functionChange } from '../../type';
import QuillEditor from '../common/QuillEditor';
import { Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import { TagData } from '../../types/Tag';
import SelectSearchData from 'select-search-input-tk';
import { PaginationData } from '../../types/Pagination';
import { getListTag } from '../../services/TagsService';
import DragDropFile from 'drag-drop-file-tk';
import * as Yup from "yup";
import * as formik from 'formik';

type ArticleData = {
  title: string;
  thumbnail: File | null;
  description: string;
  keyword: string;
  body: string;
  tag: number[];
}

interface Props {
  title?: string;
  thumbnail?: File | string;
  description?: string;
  keyword?: string;
  body?: string;
  tag?: TagData[] | [];
  isEdit?: boolean;
  submitArticle: functionChange;
}

const ArticleEditor: React.FC<Props> = (props) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File>();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(props.thumbnail ? `${process.env.REACT_APP_URL_MINIO}${props.thumbnail}` : undefined);
  const [pageNumberTag, setPageNumberTag] = useState<number>(1);
  const [pagingTag, setPagingTag] = useState<PaginationData>();

  const { Formik } = formik;

  useEffect(() => {
    fetchTags();
  }, [searchValue, pageNumberTag]);

  const handleSearch = (value: string, top: boolean, bottom: boolean) => {
    if (top && pageNumberTag > 1) setPageNumberTag(pageNumberTag - 1);
    if (bottom && pagingTag?.lastPage && pagingTag.lastPage > pageNumberTag) setPageNumberTag(pageNumberTag + 1);
    if (!top && !bottom) setSearchValue(value);
  };

  const fetchTags = async () => {
    const response = await getListTag(30, pageNumberTag, searchValue, undefined);
    if (response) {
      setTags(response.data.data);
      setPagingTag(response.data.pagination);
    }
  };

  const beforeUpload = async (files: Array<File> | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setThumbnail(file);
    } else {
      setThumbnail(undefined);
    }
  };


  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tiêu đề!'),
    description: Yup.string().required('Vui lòng nhập mô tả ngắn!'),
    keyword: Yup.string().required('Vui lòng nhập từ khóa!'),
    thumbnailRef: Yup.string().when('thumbnailPreview', ([thumbnailPreview], sch) => {
      return thumbnailPreview ? sch.notRequired() : sch.required('Vui lòng chọn một ảnh');
    }),

    selectedTag: Yup.string().required('Vui lòng chọn một tag'),
    body: Yup.string().required('Vui long nhập nội dung bài viết')
      .test('<p><br></p>', 'Vui long nhập nội dung bài viết', value => value !== '<p><br></p>')
  });

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values?.title);
    formData.append("description", values?.description);
    formData.append("keyword", values?.keyword);
    formData.append('tag', values?.selectedTag);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("body", values?.body);
    props.submitArticle(formData);
  }


  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        initialValues={{
          thumbnailPreview: thumbnailPreview || undefined,
          title: props.title || '',
          description: props.description || '',
          keyword: props.keyword || '',
          selectedTag: props.tag ? props.tag.map(item => item.id).join(',') : '',
          body: props.body || '',
          thumbnailRef: thumbnailPreview || ''
        }}
      >

        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label><span className='required-label'>*</span>Tiêu đề bài viết</Form.Label>
              <Form.Control
                type="text"
                name="title"
                isInvalid={!!errors.title}
                onChange={handleChange}
                value={values.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="tag">
              <Form.Label><span className='required-label'>*</span>Tag</Form.Label>
              <Form.Control
                type="hidden"
                name="selectedTag"
                value={values.selectedTag}
                isInvalid={!!errors.selectedTag}
              />
              <SelectSearchData
                data={tags}
                title='tagName'
                value='id'
                onSearch={handleSearch}
                placeholder='Chọn tag'
                defaultValue={props.tag}
                onChange={(data) => handleChange({ target: { name: 'selectedTag', value: data.map(item => item.id).join(',') } })}
              />
              <Form.Control.Feedback type="invalid">{errors.selectedTag}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="thumbnail">
              <Form.Label><span className='required-label'>*</span>Ảnh thumbnail</Form.Label>
              <Form.Control
                name="thumbnailRef"
                type='hidden'
                isInvalid={!!errors.thumbnailRef && !thumbnailPreview}
                value={values.thumbnailRef}
              />
              <DragDropFile
                placeholder='Chọn ảnh'
                handleChange={(data) => {
                  handleChange({ target: { name: 'thumbnailRef', value: (data && data.length > 0) ? '1' : '' } });
                  beforeUpload(data);
                }}
                limit={1}
                showMessageLimit
                defaultPreview={thumbnailPreview ? [thumbnailPreview] : undefined}
                withImagePreview={400}
              />
              <Form.Control.Feedback type="invalid">{errors.thumbnailRef}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label><span className='required-label'>*</span>Mô tả ngắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="keyword">
              <Form.Label><span className='required-label'>*</span>Từ khóa tìm kiếm</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={values.keyword}
                name="keyword"
                onChange={handleChange}
                isInvalid={!!errors.keyword}
              />
              <Form.Control.Feedback type="invalid">{errors.keyword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="bodyTxt">
              <Form.Label><span className='required-label'>*</span>Nội dung bài viết</Form.Label>
              <Form.Control
                type="hidden"
                name="body"
                value={values.body}
                isInvalid={!!errors.keyword}
              />
              <QuillEditor
                data={values.body}
                onDataChange={(data) => handleChange({ target: { name: 'body', value: data } })}
                size={{ height: 700 }}
              />
              <Form.Control.Feedback type="invalid">{errors.body}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary">Lưu Bài Viết</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ArticleEditor;
