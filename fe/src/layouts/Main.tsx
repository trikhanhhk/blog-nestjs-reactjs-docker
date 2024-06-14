import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

const Main: React.FC = () => {
  return (
    <div className="root mn--max sb--unite sb--pinned hd--expanded">
      <section id="content" className="content main-layout shadow">
        <div className="content__wrap">
          <Outlet />
        </div>
      </section>
      <Header />
      <Navbar />
      <div className="scroll-container">
        <a href="#root" className="scroll-page rounded-circle ratio ratio-1x1" aria-label="Scroll button"></a>
      </div>
    </div>
  )
}

export default Main;