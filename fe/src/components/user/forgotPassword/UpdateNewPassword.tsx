import React, { useEffect, useState } from 'react';
import { functionChange } from '../../../type';
import { Button, Form, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface Props {
  onSuccess: functionChange;
  isLoading?: boolean;
  back?: functionChange;
}

const UpdateNewPassword: React.FC<Props> = (props) => {
  const { onSuccess, isLoading, back } = props;

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu mới')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Xác nhận mật khẩu không khớp')
      .required('Vui lòng xác nhận mật khẩu mới'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      repeatPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSuccess(values.password);
    },
  });

  const tooltipPassword = (
    <Tooltip id="tooltipPassword">
      <p>Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt</p>
    </Tooltip>
  );

  return (
    <div className='row'>
      <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
        <div className='el-card is-always-shadow'>
          <div className='el-card__body'>
            <h1 className='card-title'>Quên mật khẩu</h1>
            <p className='card-subtitle mt-4'>
              Tạo mật khẩu mới
            </p>
            <Form method="post" className='py-4' onSubmit={formik.handleSubmit} noValidate>
              <Form.Group className='el-form-item'>
                <Form.Label htmlFor="password">Mật khẩu mới</Form.Label>
                <OverlayTrigger placement="auto" overlay={tooltipPassword}>
                  <Form.Control
                    type="password"
                    required
                    id="password"
                    placeholder='Mật khẩu mới'
                    name="password"
                    className='el-input'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={!!(formik.touched.password && formik.errors.password)}
                  />
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='el-form-item'>
                <Form.Label htmlFor="repeatPassword">Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  required
                  id="repeatPassword"
                  placeholder='Xác nhận mật khẩu'
                  name="repeatPassword"
                  className='el-input'
                  value={formik.values.repeatPassword}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.touched.repeatPassword && formik.errors.repeatPassword)}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.repeatPassword}</Form.Control.Feedback>
              </Form.Group>

              <div className='d-flex justify-content-end'>
                {back && <Button onClick={() => back(2)} type="submit" className='btn-submit-email primary'>
                  Quay lại
                </Button>}
                <Button type="submit" className='btn-submit-email primary ms-3' disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Đổi mật khẩu'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateNewPassword;
