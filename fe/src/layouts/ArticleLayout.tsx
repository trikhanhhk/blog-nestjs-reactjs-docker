import React from 'react'
import CarouselSlider from '../components/Carousel/CarouselSlider'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { Button } from 'antd'
import TabArticleList from './TabArticleList'

const ArticleLayout = () => {
  const contentStyle: React.CSSProperties = {
    backgroundColor: "#fff"
  }

  return (
    <>
      <Header />
      <div style={contentStyle} className="root mn--max sb--unite sb--pinned hd--expanded card">
        <section id="content" className="content main-layout card">
          <CarouselSlider />
          <div className='row' style={{ backgroundColor: "#0b1a33" }}>
            <div className='d-flex tab-article'>
              <TabArticleList />
            </div>
          </div>
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

export default ArticleLayout
