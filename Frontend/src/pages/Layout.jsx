import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 1) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
