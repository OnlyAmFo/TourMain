import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//this is used to smooth scrolling to top on new page
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
