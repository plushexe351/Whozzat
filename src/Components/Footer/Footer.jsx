import { Copyright } from "lucide-react";
import React from "react";
import { GitHub } from "react-feather";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Whozzat. Created by
      <a
        href="github.com/plushexe351"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="creator-name">Ushnish Tapaswi</span>
      </a>
    </footer>
  );
};

export default Footer;
