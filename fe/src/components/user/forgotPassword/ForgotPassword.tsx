import React, { useState } from 'react';
import SendEmailToGetToken from './SendEmailToGetToken';
import "../../styles/forgotPassword.css";
import ValidateTokenResetPassword from './ValidateTokenResetPassword';
import UpdateNewPassword from './UpdateNewPassword';
import { updateNewPassword } from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<number>();
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const nextStep2 = (userId: number) => {
    setUserId(userId);
    setCurrentStep(2);
  }

  const nextStep3 = (resetToken: string) => {
    setToken(resetToken);
    setCurrentStep(3);
  }

  const updatePassword = async (newPassword: string) => {
    if (userId) {
      const response = await updateNewPassword({
        newPassword,
        userId,
        resetToken: token
      })
      setIsLoading(false);

      if (response.data) {
        toast.info("Thay đổi mật khẩu thành công");
        const data = response.data;
        console.log(data);
        localStorage.setItem("access_token", data.data.accessToken);
        localStorage.setItem("refresh_token", data.data.refreshToken);
        localStorage.setItem("userData", JSON.stringify(data.data.userData));


        navigate('/');
      }

    }
  }

  const renderStepForm = () => {
    if (currentStep === 1) {
      return (
        <SendEmailToGetToken submitSuccess={nextStep2} />
      );
    } else if (currentStep === 2) {
      return (
        <ValidateTokenResetPassword back={setCurrentStep} onSuccess={nextStep3} />
      );
    } else if (currentStep === 3) {
      return (
        <UpdateNewPassword back={setCurrentStep} onSuccess={updatePassword} isLoading={isLoading} />
      );
    }
  };

  return (
    <div className='container my-5'>
      <div className='row'>
        <div className='d-flex justify-content-center py-4 mb-2 col-12'>
          <div className='logo logo--medium'>
            <img src="/assets/img/logo.svg" alt="Viblo Accounts" className="logo-image" />
          </div>
        </div>
      </div>
      {renderStepForm()}
    </div>
  );
};

export default ForgotPassword;
