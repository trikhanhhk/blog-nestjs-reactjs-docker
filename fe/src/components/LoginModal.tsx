import { Modal } from 'antd';
import React from 'react';
import LoginForm from './LoginForm';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = (props) => {
  const handleCancel = () => {
    props.onClose();
  };

  return (
    <Modal
      title={null}
      open={props.isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <LoginForm onSuccess={handleCancel} isPopup={true} />
    </Modal>
  );
};

export default LoginModal;
