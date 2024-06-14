import { Button, Form, Input, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { SliderType } from '../../types/SliderType';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';

type FieldType = {
  name: string;
  description: string;
  slideImage: any;
  status: "on" | "off";
  link: string;
}

interface Props {
  slider?: SliderType;
  onSubmit: (values: FieldType) => Promise<void>;
  isEdit?: boolean;
}

const CarouselSliderEditor: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const { slider, onSubmit, isEdit } = props;

  const [sliderPreview, setSliderPreview] = useState<string | null>(slider && slider?.imagePath ? `${process.env.REACT_APP_URL_MINIO}${slider.imagePath}` : null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error(error);
    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setSliderPreview(result);
    };
    return false; // Prevent upload
  };



  return (
    <div className='card card-body'>
      <Form
        form={form}
        size="large"
        autoComplete="off"
        layout='vertical'
      >
        <Form.Item label="Tên slider"
          rules={[{ required: !isEdit, message: 'Vui lòng nhập tên' }]}
          name="name">
          <Input defaultValue={slider?.name} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input defaultValue={slider?.description} />
        </Form.Item>
        <Form.Item name="status"
          rules={[{ required: !isEdit, message: "Vui lòng chọn trạng thái" }]}
          label="Trạng thái"
        >
          <Select
            style={{ minWidth: "200px" }}
            placeholder="Chọn trạng thái hiển thị"
            defaultValue={slider?.status}
          >
            <Select.Option value="on">ON</Select.Option>
            <Select.Option value="off">OFF</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Ảnh Slide"
          name="imagePath"
          valuePropName="fileList"
          rules={[{ required: !isEdit, message: 'Vui lòng chọn ảnh!' }]}
          getValueFromEvent={normFile}
        >
          {sliderPreview && <div className='row'>
            <img src={sliderPreview} alt="" style={{ width: "600px" }} />
          </div>}
          <Upload
            beforeUpload={beforeUpload}
            listType="picture-card"
            showUploadList={false}
            onChange={(info) => {
              if (info.fileList.length > 1) {
                info.fileList.splice(0, 1); // Giới hạn số lượng file được chọn là 1
              }
            }}
          >
            <div>
              <PlusOutlined />
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="link" label="Truy cập tới">
          <Input defaultValue={slider?.link} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' onClick={handleSubmit}>Lưu</Button>
        </Form.Item>
      </Form>
    </div >
  )
}

export default CarouselSliderEditor;
