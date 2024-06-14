import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { uploadAvatar } from '../../services/UserService';
import { toast } from 'react-toastify';
import DragDropFile from 'drag-drop-file-tk';
import { getCurrentLogin } from '../../services/AuthService';

interface Props {
  isOpen: boolean;
  onClose: (path: string | null) => void;
}

type FieldType = {
  avatar: any;
}

const AvatarUploadModal: React.FC<Props> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [file, setFile] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setConfirmLoading(true);
      const response = await uploadAvatar(formData);
      setConfirmLoading(false);
      if (!response) return;
      props.onClose(response.data.data.path);
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Upload avatar failed:', error);
      setConfirmLoading(false);
      toast.error('error');
    }
  };

  const handleCancel = () => {
    props.onClose(null);
  };

  const handleFileChange = (files: Array<File> | null) => {
    if (!files || files.length == 0) {
      setFile(null);
    } else {
      setFile(files[0]);
    }
  };

  return (
    <Modal show={props.isOpen} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật ảnh đại diện</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile">
            <DragDropFile
              placeholder='Chọn ảnh'
              handleChange={handleFileChange}
              limit={1}
              showMessageLimit
              defaultPreview={getCurrentLogin()?.avatarPath ? [`${process.env.REACT_APP_URL_MINIO}${getCurrentLogin()?.avatarPath}`] : undefined}
              withImagePreview={400}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={confirmLoading}>
          {confirmLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Cập nhật'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvatarUploadModal;
