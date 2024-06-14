import React, { useState } from 'react';
import { SliderType } from '../../types/SliderType';
import { createSlider, getOneSlider, updateSlider } from '../../services/CarouseService';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import CarouselSliderEditor from './CarouselSliderEditor';
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

const EditCarouselSlider: React.FC<Props> = (props) => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [slider, setSlider] = useState<SliderType | undefined>(undefined);

  if (!id) {
    return null;
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getOneSlider(id + '');
      if (response) {
        setSlider(response.data.data)
      }
    }

    if (id) {
      fetchData();
    }
  }, [id])

  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    try {
      if (values) {

        const keysToCheck = ["name", "description", "link", "slideImage", "status"];

        // Duyệt qua mỗi key
        keysToCheck.forEach(key => {
          // Kiểm tra xem key có trong values không và có giá trị không
          if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
            // Nếu có giá trị, thêm vào formData
            if (key === 'slideImage' && values[key][0] && values[key][0].originFileObj) {
              formData.append(key, values[key][0].originFileObj);
            } else {
              formData.append(key, values[key]);
            }
          }
        });

        console.log("FormData", formData);

        const response = await updateSlider(formData, +id);
        if (response) {
          toast.info('Chỉnh sửa slider thành công');
          navigate("/admin/slider/list");
        }
      } else {

      }
    } catch (error) {
      toast.error("Error")
      console.error(error);
    }
  }

  return (
    <>
      <Seo
        title={`Chỉnh sửa: ${slider?.name}`}
      />
      <div className='card card-body'>
        {slider &&
          <CarouselSliderEditor
            onSubmit={handleSubmit}
            slider={slider}
            isEdit={true}
          />
        }
      </div >
    </>
  )
}

export default EditCarouselSlider
