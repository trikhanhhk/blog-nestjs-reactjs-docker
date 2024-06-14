import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { functionChange } from '../../../type';
import { forgotPassword } from '../../../services/AuthService';

interface Props {
  submitSuccess?: functionChange;
}

const SendEmailToGetToken: React.FC<Props> = (props) => {
  const { submitSuccess } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    email: ''
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    const form = event.currentTarget;

    console.log("validate", form.checkValidity());

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      setIsLoading(false);
      return;
    }

    forgotPassword({ emailAddress: formData.email }).then((response) => {
      submitSuccess && submitSuccess(response.data.data.userId);
      setIsLoading(false);
      toast.info(`Vui lòng kiểm tra email của bạn: ${response.data.data.email}`);
    }).catch(error => {
      setIsLoading(false);
    })
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      email: value
    });
  };

  return (
    <div className='row'>
      <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
        <div className='el-card is-always-shadow'>
          <div className='el-card__body'>
            <h1 className='card-title'>Quên mật khẩu</h1>
            <p className='card-subtitle mt-4'>
              Bạn quên mật khẩu của mình? Đừng lo lắng! Hãy cung cấp cho chúng tôi email bạn sử dụng để đăng ký tài khoản Viblo. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn qua email đó.
            </p>
            <Form method='post' className='py-4' onSubmit={handleSubmit} noValidate validated={validated}>
              <Form.Group className='el-form-item'>
                <Form.Label htmlFor="emailUser">Địa chỉ email của bạn</Form.Label>
                <Form.Control
                  type="email"
                  required
                  id="emailUser"
                  placeholder='Email'
                  name="emailUser"
                  className='el-input'
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập email để lấy mã reset mật khẩu
                </Form.Control.Feedback>
              </Form.Group>
              <div className='d-flex justify-content-end'>
                <Button type="submit" className='btn-submit-email primary' disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Gửi Email cho tôi'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendEmailToGetToken
