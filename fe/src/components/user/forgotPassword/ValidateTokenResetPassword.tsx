import React, { useState } from 'react';
import { functionChange } from '../../../type';
import { Button, Form, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';

interface Props {
  onSuccess?: functionChange;
  back?: functionChange;
}

const ValidateTokenResetPassword: React.FC<Props> = (props) => {
  const { onSuccess, back } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    token: ''
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

    onSuccess && onSuccess(formData.token);

  };

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    setFormData({
      token: value
    });
  };

  const tooltipToken = (
    <Tooltip id="tooltipToken">
      <strong>Mã xác nhận gồm 10 ký tự!</strong>
    </Tooltip>
  );

  return (
    <div className='row'>
      <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
        <div className='el-card is-always-shadow'>
          <div className='el-card__body'>
            <h1 className='card-title'>Quên mật khẩu</h1>
            <p className='card-subtitle mt-4'>
              Kiểm tra email của bạn và nhập mã xác thực mà chúng tôi vừa gửi cho bạn vào bên dưới, tuyệt đối không chia sẻ mã xác thực cho bất kì ai để tránh các rủi ro về bảo mật. Mã xác thực sẽ có hiệu lực trong vòng 3 phút kể từ khi được gửi.
            </p>
            <Form method='post' className='py-4' onSubmit={handleSubmit} noValidate validated={validated}>
              <Form.Group className='el-form-item'>
                <Form.Label htmlFor="resetToken">Mã kiểm tra từ VIBLO</Form.Label>
                <OverlayTrigger placement="auto" overlay={tooltipToken}>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    minLength={10}
                    required
                    id="resetToken"
                    placeholder='Mã xác thực'
                    name="resetToken"
                    className='el-input'
                    value={formData.token}
                    onChange={handleInputChange}
                    isValid={validated}
                  />
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập nhập mã kiểm tra
                </Form.Control.Feedback>
              </Form.Group>
              <div className='d-flex justify-content-end'>
                {back && <Button onClick={() => back(1)} type="submit" className='btn-submit-email primary'>
                  Quay lại
                </Button>}
                <Button type="submit" className='btn-submit-email primary ms-3' disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> : 'Tiếp theo'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidateTokenResetPassword
