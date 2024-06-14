import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: "white !important" }} className="mt-auto card">
      <nav className="nav flex-column gap-1 flex-md-row gap-md-3 ms-md-auto" style={{ rowGap: '0', marginTop: '0', marginBottom: '0', textAlign: "center", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white !important", textAlign: "center" }} className="text-nowrap mb-4 mb-md-0">Copyright © 2024 <a href="/" >VIBLO</a></div>
      </nav>
    </footer>
  );
}

export default Footer;