import React from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import * as actions from '../../redux/actions';
import { updateProfile } from '../../services/UserService';
import { updateCurrentLogin } from '../../services/AuthService';
import { UserData } from '../../types/UserData';
import * as Yup from "yup";
import * as formik from 'formik';
import { useDispatch } from 'react-redux';

type FieldType = {
  first_name: string;
  last_name: string;
  gender: number;
  career: string;
  dateOfBirth: string;
};

const ProfileForm: React.FC<{ data: UserData }> = ({ data }) => {
  const dispatch = useDispatch();

  const { Formik } = formik;

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Vui lòng nhập họ"),
    last_name: Yup.string().required("Vui lòng nhập tên")
  });

  const onSubmit = async (values: FieldType) => {
    const filterValues = (values: any) => {
      return Object.keys(values).reduce((acc: any, key: string) => {
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
          acc[key] = values[key];
        }
        return acc;
      }, {});
    };

    const filteredDataForm = filterValues(values);

    dispatch(actions.controlLoading(true));
    const response = await updateProfile(filteredDataForm);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    updateCurrentLogin(filteredDataForm);
    toast.info("Đã cập nhật thông tin");
  }

  return (
    <div className='card card-body'>
      <Formik
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        initialValues={{
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          gender: data.gender,
          career: data.career || '',
          dateOfBirth: moment(data.dateOfBirth).format('YYYY-MM-DD'),
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="first_name">
              <Form.Label><span className='required-label'>*</span>Họ</Form.Label>
              <Form.Control
                size='lg'
                type="text"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                isInvalid={!!errors.first_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label><span className='required-label'>*</span>Tên</Form.Label>
              <Form.Control
                size='lg'
                type="text"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                isInvalid={!!errors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="career">
              <Form.Label>Nghề nghiệp</Form.Label>
              <Form.Control
                placeholder='Nghề nghiệp...'
                size='lg'
                type="text"
                name="career"
                value={values.career}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="gender">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Control
                    size='lg'
                    as="select"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                  >
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                    <option value="3">Khác</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    size='lg'
                    type="date"
                    name="dateOfBirth"
                    value={values.dateOfBirth}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" style={{ fontSize: '16px' }}>
              Lưu
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileForm;
