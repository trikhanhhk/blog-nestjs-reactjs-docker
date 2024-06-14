import React, { useEffect, useState } from 'react';
import { RegisterForm } from '../../../types/RegisterForm';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import * as actions from '../../../redux/actions';
import { useLocation, useNavigate } from 'react-router-dom';
import { createNewUser } from '../../../services/UserService';
import Seo from '../../common/SEO';


interface ErrorsValidate {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  status?: string;
}


const AddUser: React.FC = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({});

  const [formErrors, setFormErrors] = useState<ErrorsValidate>({});

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const onChangDataForm = (event: any) => {
    let { name, value } = event.target;

    setFormData({
      ...formData, [name]: value
    });
  }

  useEffect(() => {
    if (isSubmit) {
      validateForm();
    }
  }, [formData]);

  const validateForm = () => {
    let isValid = true;
    const errors: ErrorsValidate = {};

    if (formData.first_name === '' || formData.first_name === undefined) {
      errors.first_name = 'Vui lòng nhập họ';
    }

    if (formData.last_name === '' || formData.last_name === undefined) {
      errors.last_name = 'Vui lòng nhập tên';
    }

    if (formData.email === '' || formData.email === undefined) {
      errors.email = 'Vui lòng nhập email';
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email);
      if (!valid) {
        errors.email = "Vui lòng nhập email hợp lệ";
      }
    }

    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Vui lòng nhập mật khẩu';
    }

    if (!formData.status || formData.status === undefined) {
      errors.status = 'Vui lòng chọn trạng thái';
    }

    if (Object.keys(errors).length > 0) {
      isValid = false;
      setFormErrors(errors)
    } else {
      setFormErrors({});
    }

    return isValid;
  }

  const onSubmitUser = async (event: any) => {
    event.preventDefault();
    setIsSubmit(true);
    setIsSubmit(true);
    if (validateForm()) {
      dispatch(actions.controlLoading(true));
      const response = createNewUser(formData);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      toast.info("OK");
      navigate('/admin/user/list');
    }
  }

  return (
    <div className='container'>
      <Seo
        title="Thêm mới người dùng"
      />
      <div className="el-card is-always-shadow">
        <div className='row'>
          <div className='d-flex justify-content-center py-4 mb-2 col-12'>
            <div className='logo logo--medium'>
              <img src="/assets/img/logo.svg" alt="Viblo Accounts" className="logo-image" />
            </div>
          </div>
          <div className='d-flex justify-content-center py-4 mb-2 col-12'>
            <h1 className='align-center'>Thêm Mới người dùng</h1>
          </div>
        </div>
        <div className='el-card__body'>
          <form onSubmit={onSubmitUser} className="row g-3">
            <div className="col-md-6">
              <label className="form-label"><span className="required-label">*</span>Họ</label>
              <input type="text" name="first_name" className="form-control" placeholder='Họ' onChange={onChangDataForm} />
              {formErrors.first_name && <p className="error-validate" >{formErrors.first_name}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label"><span className="required-label">*</span>Tên</label>
              <input type="text" name="last_name" className="form-control" placeholder='Tên' onChange={onChangDataForm} />
              {formErrors.last_name && <p className="error-validate" >{formErrors.last_name}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label"><span className="required-label">*</span>Email</label>
              <input type="email" name="email" className="form-control" placeholder='Email người dùng' onChange={onChangDataForm} />
              {formErrors.email && <p className="error-validate" >{formErrors.email}</p>}
            </div>

            <div className="col-md-6">
              <label className="form-label"><span className="required-label">*</span>Password</label>
              <input type="password" name='password' className="form-control" placeholder='Mật khẩu' onChange={onChangDataForm} />
              {formErrors.password && <p className="error-validate" >{formErrors.password}</p>}
            </div>

            <div className="col-md-4">
              <label htmlFor="inputState" className="form-label"><span className="required-label">*</span>Trạng thái</label>
              <select name='status' className="form-select" onChange={(event) => onChangDataForm(event)}>
                <option value="" selected>Choose...</option>
                <option value="1">Active</option>
                <option value="0">Block</option>
              </select>
              {formErrors.status && <p className="error-validate" >{formErrors.status}</p>}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Thêm người dùng</button>
            </div>
          </form>

        </div>
      </div>
    </div>

  )
}

export default AddUser
