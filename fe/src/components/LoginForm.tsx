import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import "./styles/login.css";
import { CSSProperties, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin, login } from '../services/AuthService';
import { functionVoid } from '../type';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import * as actions from '../redux/actions'
import { useDispatch } from 'react-redux';

interface Props {
  goHome?: boolean;
  onSuccess?: functionVoid;
  isPopup?: boolean;
}

const LoginForm: React.FC<Props> = (props) => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { goHome, onSuccess, isPopup } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Vui lòng nhập email')
      .email('Email không đúng định dạng'),

    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });


  const googleLoginClick = useGoogleLogin({
    onSuccess: async tokenResponse => {

      dispatch(actions.controlLoading(true));
      const data = await googleLogin(tokenResponse.access_token);
      dispatch(actions.controlLoading(false));
      dispatch(actions.showLogin(false));

      if (!data) return;

      localStorage.setItem("access_token", data.data.data.accessToken);
      localStorage.setItem("refresh_token", data.data.data.refreshToken);
      localStorage.setItem("userData", JSON.stringify(data.data.data.userData));
      onSuccess && onSuccess();
      goHome ? navigate("/") : window.location.reload();
    }
  });

  const onSubmit = async (value: any) => {
    dispatch(actions.controlLoading(true));
    const data = await login({ ...value });
    dispatch(actions.controlLoading(false));
    if (!data) {
      return;
    }

    localStorage.setItem("access_token", data.data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.data.refreshToken);
    localStorage.setItem("userData", JSON.stringify(data.data.data.userData));
    onSuccess && onSuccess
    goHome ? navigate("/") : window.location.reload();
  }

  const style: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }

  return (
    <div className='container' style={isPopup ? {} : style}>
      <div className='row justify-content-center' style={{ display: "flex" }}>
        <div className={`${isPopup ? '' : 'col-md-8 col-lg-6 col-xl-5'}`}>
          <div className={`${isPopup ? '' : "el-card is-always-shadow"}`}>
            <div className='el-card__body'>
              <div className='mb-6 text-center'>
                <img src="/assets/img/logo.svg" alt="Viblo Accounts" className="logo-image" />
              </div>
              <div className='my-4 text-center'>
                <h5>Đăng nhập vào Viblo</h5>
              </div>
              <div className='login-form'>
                <Form className='py-4' noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <InputGroup size='lg' className="mb-3">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px" }} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("email")}
                        placeholder='Địa chỉ email'
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupPassword">
                    <InputGroup size='lg' className="mb-3">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} style={{ fontSize: "20px" }} />
                      </InputGroup.Text>
                      <Form.Control
                        type='password'
                        {...register("password")}
                        placeholder='Mật khẩu...'
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <div className='d-flex justify-content-end'>
                    <Button style={{ width: "100%" }} type="submit" className='btn-submit-email primary' disabled={isLoading}>
                      {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Đăng nhập'}
                    </Button>
                  </div>
                  <div className='d-flex justify-content-between my-2'>
                    <Link className='btn-link' to="/forgotpassword">Quên mật khẩu</Link>
                    <Link className='btn-link' to="/register">Tạo tài khoản</Link>
                  </div>
                </Form>
                <div className='d-flex align-items-center justify-content-between my-4'>
                  <hr className="flex-fill m-0" />
                  <span className="mx-3">
                    Đăng nhập bằng
                  </span>
                  <hr className="flex-fill m-0" />

                </div>
                <div style={{ textAlign: 'center' }}>
                  <a className='btn social-button' onClick={() => googleLoginClick()} >
                    <span><FontAwesomeIcon style={{ fontSize: "20px", color: "#db4437" }} icon={faGoogle} /></span>
                    <span className='h5 text-button'>Google</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default LoginForm;
