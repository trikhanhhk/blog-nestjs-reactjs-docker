import { Form, Input, Modal, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { functionChange } from '../../type';
import { createReportArticle } from '../../services/ArticleService';
import { toast } from 'react-toastify';
import { createReportComment } from '../../services/CommentService';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

interface Props {
  isOpen: boolean;
  type: "article" | "comment" | "series" | "user" | undefined;
  dataId: number | undefined;
  setOpen: functionChange;
}

type FieldType = {
  reason: number;
  note: string;
}

const ModalFormReport: React.FC<Props> = (props) => {

  const { isOpen, type, dataId, setOpen } = props;

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setConfirmLoading(true);

    let fetchApi = null;

    if (type === 'article') {

      fetchApi = createReportArticle;

    } else if (type === 'comment') {

      fetchApi = createReportComment;

    } else if (type === 'series') {

    } else if (type === 'user') {

    }

    const values = await form.validateFields();

    if (!values) {
      return null;
    }

    const data = {
      dataId,
      reason: values.reason,
      note: values.note
    }

    if (fetchApi) {
      dispatch(actions.controlLoading(true));
      const response = fetchApi(data);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      toast.info("Báo cáo thành công");
      setConfirmLoading(false);
      setOpen(false);

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
      confirmLoading={confirmLoading}
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
          label="Lý do báo cáo nội dung này"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng chọn một lý do' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={1}>Spam</Radio>
              <Radio value={2}>Vi phạm điều khoản</Radio>
              <Radio value={3}>Quấy rồi</Radio>
              <Radio value={4}>Vi phạm bản quyền</Radio>
              <Radio value={5}>Bản dịch kém chất lượng</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Nhận xét"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalFormReport
