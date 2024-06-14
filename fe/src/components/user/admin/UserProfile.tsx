import { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import * as Yup from "yup";
import { adminUpdateUser, getUserProfileById } from '../../../services/UserService';
import { UserData } from '../../../types/UserData';
import { useLocation } from 'react-router-dom';
import LinkToProfile from '../LinkToProfile';
import { AdminUpdateUser } from '../../../types/AdminUpdateUser';
import { toast } from 'react-toastify';
import * as actions from '../../../redux/actions'
import { useDispatch } from 'react-redux';
import * as formik from 'formik';
import { getCurrentLogin } from '../../../services/AuthService';

type FormValues = AdminUpdateUser;

const UserProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");


  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserData>()

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Vui lòng nhập họ"),
    last_name: Yup.string().required("Vui lòng nhập tên"),
    role: Yup.string().required("Vui lòng chọn vai trò"),
    status: Yup.string().required("Vui lòng chọn trạng thái"),
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data)
    if (userId) {
      dispatch(actions.controlLoading(true));
      setIsLoading(true);
      const response = await adminUpdateUser(+userId, data);
      setIsLoading(false);
      dispatch(actions.controlLoading(false))

      if (!response) {
        return;
      }

      toast.info("Cập nhật thành công");
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getUserProfileById(userId ? +userId : -1);
      dispatch(actions.controlLoading(false));
      if (!response) {
        return;
      }
      const user = response.data.data;
      setUserProfile(user);
    }

    fetchData();
  }, []);

  const { Formik } = formik;

  return (
    <div className='row'>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-4">
            <img
              src={userProfile?.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${userProfile?.avatarPath}` : "/assets/img/profile-photos/5.png"}
              alt="Avatar"
              className="rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <p>
              <LinkToProfile userId={userProfile?.id || -1} userName={`${userProfile?.first_name} ${userProfile?.last_name}`} />
            </p>
          </div>
        </div>
      </div>
      <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
        <div className='el-card is-always-shadow'>
          <div className='el-card__body'>
            <h1 className='card-title'>Tài khoản người dùng</h1>
            <p className='card-subtitle mt-4'>
              Xem và chỉnh sửa tài khoản
            </p>
            {userProfile && <Formik
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              initialValues={{
                first_name: userProfile?.first_name || "",
                last_name: userProfile?.last_name || "",
                role: userProfile?.role || "",
                status: userProfile.status
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form className='py-4' noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formGroupFullName">

                    <Form.Label><span className='required-label'>*</span>Họ và tên</Form.Label>
                    <InputGroup size='lg' className="mb-3">
                      <Form.Control
                        name="first_name"
                        value={values.first_name}
                        placeholder='Họ...'
                        isInvalid={!!errors.first_name}
                        onChange={handleChange}
                        aria-label="First name" />
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>

                      <Form.Control
                        name="last_name"
                        value={values.last_name}
                        placeholder='Tên...'
                        isInvalid={!!errors.last_name}
                        onChange={handleChange}
                        aria-label="Last name" />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>

                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Địa chỉ email</Form.Label>
                    <Form.Control
                      size='lg'
                      type="email"
                      disabled={true}
                      defaultValue={userProfile?.email}
                      name="email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupRole">
                    <Form.Label><span className='required-label'>*</span>Vai trò</Form.Label>
                    <Form.Select
                      value={values.role}
                      onChange={handleChange}
                      name="role"
                      disabled={userProfile.id === getCurrentLogin().id}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                      <option value="POST_ADMIN">ADMIN POST</option>
                    </Form.Select>
                    {userProfile.id === getCurrentLogin().id && <small>Bạn không thể tự thay đổi quyền của bản thân</small>}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupStatus">
                    <Form.Label><span className='required-label'>*</span>Trạng thái</Form.Label>
                    <Form.Select
                      value={values.status}
                      onChange={handleChange}
                      name="status"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                  <div className='d-flex justify-content-end'>
                    <Button style={{ width: "100%" }} type="submit" className='btn-submit-email primary' disabled={isLoading}>
                      {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Cập nhật'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
