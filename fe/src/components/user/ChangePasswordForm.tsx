import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { UserData } from '../../types/UserData';
import { updatePassword } from '../../services/UserService';

interface Props {
  data: UserData;
}

const ChangePasswordForm: React.FC<Props> = ({ data }) => {
  const validationSchema = Yup.object().shape({
    oldPassword: data.flagFirst ? Yup.string() : Yup.string().required('Vui lòng nhập mật khẩu cũ!'),
    newPassword: Yup.string()
      .required('Vui lòng nhập mật khẩu!')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số!'),
    confirmNewPassword: Yup.string()
      .required('Vui lòng xác nhận mật khẩu!')
      .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp!'),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      flagFirst: data.flagFirst,
    },
    validationSchema,
    onSubmit: async (values) => {
      const dataForm = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      if (data.flagFirst) {
        dataForm.newPassword = values.newPassword;
      }

      try {
        const response = await updatePassword(dataForm);

        if (response) {
          console.log("result update password", response);
          toast.info("Thay đổi mật khẩu thành công");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className='card card-body'>
      <Form onSubmit={formik.handleSubmit}>
        {data.flagFirst && <h4>Hãy thiết lập mật khẩu cá nhân của bạn</h4>}
        {!data.flagFirst && (
          <Form.Group controlId="oldPassword">
            <Form.Label><span className='required-label'>*</span>Mật khẩu cũ</Form.Label>
            <Form.Control
              type="password"
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.oldPassword && formik.touched.oldPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.oldPassword}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        <Form.Group controlId="newPassword">
          <Form.Label><span className='required-label'>*</span>{data.flagFirst ? "Mật khẩu" : "Mật khẩu mới"}</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.newPassword && formik.touched.newPassword}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.newPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="confirmNewPassword">
          <Form.Label><span className='required-label'>*</span>Xác nhận</Form.Label>
          <Form.Control
            type="password"
            name="confirmNewPassword"
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.confirmNewPassword && formik.touched.confirmNewPassword}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.confirmNewPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary" style={{ fontSize: "16px" }}>
          Lưu
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
