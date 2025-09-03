import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.querySelector(".main");
    if (main) {
      console.log("should scroll main to top");
      main.scrollTo({
        top: 0,
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
