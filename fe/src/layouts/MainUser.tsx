import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import CarouselSlider from '../components/Carousel/CarouselSlider'

const contentStyle: React.CSSProperties = {
  backgroundColor: "#fff"
}

const MainUser = () => {
  return (
    <>
      <Header />
      <div style={contentStyle} className="root mn--max sb--unite sb--pinned hd--expanded card">
        <section id="content" className="content main-layout card">
          <CarouselSlider />
          <div className="content__wrap card container shadow">
            <Outlet />
          </div>
        </section>
        {/* <Navbar /> */}
        <div className="scroll-container">
          <a href="#root" className="scroll-page rounded-circle ratio ratio-1x1" aria-label="Scroll button"></a>
        </div>
      </div>
    </>
  )
}

export default MainUser
