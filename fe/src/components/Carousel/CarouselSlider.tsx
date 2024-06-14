import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { getCarouse } from '../../services/CarouseService';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const imagesStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  maxHeight: "160px",
  display: "block",
  margin: "0 auto"
}

const CarouselSlider = () => {
  const [sliders, setSliders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCarouse();

      if (!response) return;

      setSliders(response.data.data);
    }

    fetchData();
  }, []);


  return (
    <Carousel autoplay>
      {sliders && sliders.map((slide, index) => (
        <a key={index} style={contentStyle} href={slide.link ? slide.link : "#"}>
          <img style={imagesStyle} src={`${process.env.REACT_APP_URL_MINIO}${slide.imagePath}`} />
        </a>
      ))}
    </Carousel>
  );
}

export default CarouselSlider
