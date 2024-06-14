import React, { useState } from 'react';
import { SliderType } from '../../types/SliderType';
import { createSlider } from '../../services/CarouseService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CarouselSliderForm from './CarouselSliderEditor';
import Seo from '../common/SEO';

interface Props {
  slider?: SliderType;
}

type FieldType = {
  name: string;
  description: string;
  slideImage: any;
  status: "on" | "off";
  link: string;
}

const AddCarouselSlider: React.FC<Props> = (props) => {

  const navigate = useNavigate();

  const handleSubmit = async (values: FieldType) => {
    const formData = new FormData();
    try {
      if (values) {
        console.log("values", values);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("link", values.link);
        formData.append("slideImage", values.slideImage[0].originFileObj);
        formData.append("status", values.status);

        console.log("FormData", formData);

        const response = await createSlider(formData);
        if (response) {
          toast.info('Thêm thành công');
          navigate("/admin/slider/list");
        }
      } else {

      }
    } catch (error) {
      toast.error("Vui lòng nhập đầy đủ các trường bắt buộc")
      console.error(error);
    }
  }

  return (
    <>
      <Seo
        metaDescription='Thêm mới Slider'
        title='Thêm mới Slider'
        metaKeywords='Thêm mới Slider'
      />
      <div className='row'>
        <div className='offset-md-1 offset-lg-2 col-sm-12 col-md-10 col-lg-8'>
          <div className='el-card is-always-shadow'>
            <div className='el-card__body'>
              <h3>Thêm mới Slider, Banner</h3>
              <CarouselSliderForm
                onSubmit={handleSubmit}
              />
            </div >
          </div>
        </div>
      </div>
    </>
  )
}

export default AddCarouselSlider
