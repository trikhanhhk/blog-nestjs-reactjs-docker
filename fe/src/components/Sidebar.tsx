import React from "react";

interface SideBarProps {
  children: React.ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__inner scrollable-content">
        <div className="sidebar__wrap">
          {children}
        </div>
      </div>
    </aside>
  )
}

export default SideBar;