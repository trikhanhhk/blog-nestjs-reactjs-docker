import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const MainUserWithoutCarousel = () => {
  return (
    <>
      <Header />
      <div className="root mn--max sb--unite sb--pinned hd--expanded">
        <section id="content" className="content main-layout">
          <div className="content__wrap card container shadow">
            <Outlet />
          </div>
        </section>
        <div className="scroll-container">
          <a href="#root" className="scroll-page rounded-circle ratio ratio-1x1" aria-label="Scroll button"></a>
        </div>
      </div>
    </>
  )
}

export default MainUserWithoutCarousel
