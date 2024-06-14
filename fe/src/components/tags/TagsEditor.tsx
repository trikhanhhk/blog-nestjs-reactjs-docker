import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Spinner } from 'react-bootstrap';
import { TagData } from '../../types/Tag';
import { createTag, updateTag } from '../../services/TagsService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export interface FormTagValues {
  tagName: string;
  description: string;
  tagType: string;
}

interface Props {
  isEdit?: boolean;
  tagData?: TagData;
}

const TagsEditor: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const { isEdit, tagData } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validationSchema = Yup.object().shape({
    tagName: Yup.string().required("Vui lòng nhập tên tag"),
    description: Yup.string().required("Vui lòng nhập mô tả tag"),
    tagType: Yup.string().required("Vui lòng chọn loại tag"),
  });

  // function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: FormTagValues) => {
    let response = null;
    if (isEdit) {
      if (tagData) {
        setIsLoading(true);
        response = await updateTag(data, tagData?.id || -1);
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      response = await createTag(data);
      setIsLoading(false);
    }

    if (response) {
      isEdit ? toast.info('Chỉnh sửa tag thành công') : toast.info('Thêm mới tag thành công');
      navigate('/admin/tags/list');
    }
  };

  return (
    <div className='row'>
      <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
        <div className='el-card is-always-shadow'>
          <div className='row'>
            <div className='d-flex justify-content-center py-4 mb-2 col-12'>
              <div className='logo logo--medium'>
                <img src="/assets/img/logo.svg" alt="Viblo Accounts" className="logo-image" />
              </div>
            </div>
            <div className='d-flex justify-content-center py-4 mb-2 col-12'>
              <h1 className='align-center'>{isEdit ? "Xem và chỉnh sửa tag" : "Thêm mới tag"}</h1>
            </div>
          </div>
          <div className='el-card__body'>
            <Form className='py-4' noValidate onSubmit={handleSubmit(onSubmit)}>

              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Tên Tag</Form.Label>
                <Form.Control
                  {...register("tagName")}
                  defaultValue={tagData?.tagName}
                  size='lg'
                  type="text"
                  isInvalid={isEdit ? false : !!errors.tagName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tagName?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGroupRole">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  {...register("description")}
                  defaultValue={tagData?.description}
                  as="textarea" rows={3}
                  isInvalid={isEdit ? false : !!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGroupStatus">
                <Form.Label>Loại tag</Form.Label>
                <Form.Select
                  {...register("tagType")}
                  isInvalid={isEdit ? false : !!errors.tagType}
                >
                  <option selected={tagData?.tagType === 1} value={1}>Thường</option>
                  <option selected={tagData?.tagType === 2} value={2}>Kỹ năng</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.tagType?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <div className='d-flex justify-content-end'>
                <Button style={{ width: "100%" }} type="submit" className='btn-submit-email btn-primary' disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Cập nhật'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TagsEditor
