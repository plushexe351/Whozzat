import React from "react";
import "./MobileNav.scss";
import WhozzatLogo from "../../assets/whozzat-logo.png";
import { Sidebar } from "lucide-react";
import { useUI } from "../../Context/UIContext";

const MobileNav = () => {
  const { showSidebar, setShowSidebar } = useUI();

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__logo">
        <Sidebar
          stroke="#c4b6fd"
          size={20}
          className="icon-sidebar"
          onClick={() => setShowSidebar(true)}
        />
        <img src={WhozzatLogo} alt="Whozzat Logo" />
        <h1>Whozzat</h1>
      </div>
    </div>
  );
};

export default MobileNav;
