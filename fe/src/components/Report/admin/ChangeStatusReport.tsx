import { Form, Modal, Radio, Space } from 'antd';
import React from 'react';
import { functionChange } from '../../../type';
import { updateStatusReportArticle } from '../../../services/ArticleService';
import { toast } from 'react-toastify';
import { updateStatusReportComment } from '../../../services/CommentService';
import { Dispatch } from 'redux';
import * as actions from '../../../redux/actions';
import { useDispatch } from 'react-redux';

interface Props {
  isOpen: boolean;
  type: "article" | "comment" | "series" | "user" | undefined;
  dataId: number | undefined;
  setOpen: functionChange;
  onSubmit?: functionChange;
}

type FieldType = {
  status: number;
  messageToUser: string;
}


const ChangeStatusReport: React.FC<Props> = (props) => {
  const { isOpen, type, dataId, setOpen, onSubmit } = props;

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values: FieldType = await form.validateFields();

      if (values && dataId) {
        const data = {
          status: values.status,
          message: values.messageToUser
        }
        let response = null;
        dispatch(actions.controlLoading(true));
        if (type === "article") {
          response = await updateStatusReportArticle(dataId, data);
        } else if (type === "comment") {
          response = await updateStatusReportComment(dataId, data);
        }
        dispatch(actions.controlLoading(false));
        if (response) {
          onSubmit && onSubmit(Date.now());
          toast.info("Cập nhật trạng thái thành công");
          setOpen(false);
        }
      }

    } catch (error) {

    }
  }

  const handleCancel = () => {
    setOpen(false);
  }

  return (
    <Modal
      title="Nội dung báo cáo"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="basic"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        size="large"
        layout='vertical'
      >

        <Form.Item
          label="Thay đổi trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn một trạng thái' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={2}>Khóa (ẩn nội dung)</Radio>
              <Radio value={3}>Không vi phạm</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangeStatusReport
