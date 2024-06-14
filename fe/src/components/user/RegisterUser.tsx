import React, { useState } from 'react'
import { Button, Container, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "../styles/forgotPassword.css";
import { RegisterForm } from '../../types/RegisterForm';
import { registerUser } from '../../services/AuthService';
import { toast } from 'react-toastify';
import * as actions from "../../redux/actions";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';


const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Vui lòng nhập họ"),
    last_name: Yup.string().required("Vui lòng nhập tên"),
    email: Yup.string()
      .email("Email không đúng định dạng")
      .required("Vui lòng nhập email"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
        "Phải chứa ít nhất 8 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
    passwordConfirmation: Yup.string()
      .required("Vui lòng nhập xác nhận mật khẩu")
      .oneOf([Yup.ref("password"), ""], "Không khớp với trường mật khẩu")
  });

  // function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    const response = await registerUser(data);
    if (response) {
      setIsLoading(false);
      toast.info("Đăng ký thành công");
      navigate('/');
      dispatch(actions.showLogin(true));
    }
  };

  return (
    <Container>
      <div className='container my-5'>
        <div className='row'>
          <div className='d-flex justify-content-center py-4 mb-2 col-12'>
            <div className='logo logo--medium'>
              <img src="/assets/img/logo.svg" alt="Viblo Accounts" className="logo-image" />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
            <div className='el-card is-always-shadow'>
              <div className='el-card__body'>
                <h1 className='card-title'>Đăng ký tài khoản cho Viblo</h1>
                <p className='card-subtitle mt-4'>
                  Chào mừng bạn đến <b>Nền tảng Viblo!</b> Tham gia cùng chúng tôi để tìm kiếm thông tin hữu ích cần thiết để cải thiện kỹ năng IT của bạn. Vui lòng điền thông tin của bạn vào biểu mẫu bên dưới để tiếp tục.
                </p>
                <Form className='py-4' noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3" controlId="formGroupFullName">
                    <Form.Label>Họ và tên</Form.Label>
                    <InputGroup size='lg' className="mb-3">
                      <Form.Control
                        {...register("first_name")}
                        placeholder='Họ...'
                        isInvalid={!!errors.first_name}
                        aria-label="First name" />
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name?.message}
                      </Form.Control.Feedback>
                      <Form.Control
                        placeholder='Tên...'
                        {...register("last_name")}
                        isInvalid={!!errors.last_name}
                        aria-label="Last name" />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Địa chỉ email</Form.Label>
                    <Form.Control
                      size='lg'
                      type="email"
                      placeholder="Nhập email..."
                      {...register("email")}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      size='lg'
                      type="password"
                      placeholder="Mật khẩu..."
                      {...register("password")}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGroupPasswordConfirmation">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                      size='lg'
                      type="password"
                      placeholder="Xác nhận mật khẩu..."
                      {...register("passwordConfirmation")}
                      isInvalid={!!errors.passwordConfirmation}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordConfirmation?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className='d-flex justify-content-end'>
                    <Button style={{ width: "100%" }} type="submit" className='btn-submit-email primary' disabled={isLoading}>
                      {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Đăng ký'}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Container>
  )
}

export default RegisterUser;
