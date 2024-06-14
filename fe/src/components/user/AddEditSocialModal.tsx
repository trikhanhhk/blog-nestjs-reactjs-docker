import { DiscordFilled, FacebookFilled, GithubFilled } from '@ant-design/icons';
import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react';
import { updateSocialLink } from '../../services/UserService';

interface Props {
  isOpen: boolean;
  onClose: (data: any) => void;
  data: {
    githubLink: string | null,
    facebookLink: string | null,
    discordLink: string | null
  }
}

type FieldType = {
  facebookLink: string;
  discordLink: string;
  githubLink: string
};

const linkRegex = /^(ftp|http|https):\/\/[^ "]+$/;

const AddEditSocialModal: React.FC<Props> = (props) => {
  const { data } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const validateLink = (_: any, value: string) => {

    if (!value || linkRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Liên kết không hợp lệ'));
  };


  const handleSubmit = async () => {
    try {
      const values: FieldType = await form.validateFields();
      if (values) {
        setConfirmLoading(true);
        const data = await updateSocialLink({ discordLink: values.discordLink, facebookLink: values.facebookLink, githubLink: values.githubLink });
        setConfirmLoading(false);
        props.onClose(values);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    props.onClose(null);
  }

  return (
    <Modal
      title="Thêm liên kết"
      visible={props.isOpen}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          label={<FacebookFilled style={{ fontSize: '24px' }} />}
          name="facebookLink"
          rules={[{ validator: validateLink }]}
        >
          <Input defaultValue={data.facebookLink ? data.facebookLink : ""} />
        </Form.Item>

        <Form.Item
          label={<GithubFilled style={{ fontSize: '24px' }} />}
          name="githubLink"
          rules={[{ validator: validateLink }]}
        >
          <Input defaultValue={data.githubLink ? data.githubLink : ""} />
        </Form.Item>

        <Form.Item
          label={<DiscordFilled style={{ fontSize: '24px' }} />}
          name="discordLink"
          rules={[{ validator: validateLink }]}
        >
          <Input defaultValue={data.discordLink ? data.discordLink : ""} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddEditSocialModal
