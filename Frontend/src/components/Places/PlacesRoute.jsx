import React from "react";
import { Routes, Route } from "react-router-dom";
import Mountain1 from "./Mountains/Mountain1";
import Mountain2 from "./Mountains/Mountain2";
import Mountain3 from "./Mountains/Mountain3";
import Mountain4 from "./Mountains/Mountain4";
import Mountain5 from "./Mountains/Mountain5";
import Mountain6 from "./Mountains/Mountain6";

const PlacesRoute = () => {
  return (
    <Routes>
      <Route path="mountain-1" element={<Mountain1 />} />
      <Route path="mountain-2" element={<Mountain2 />} />
      <Route path="mountain-3" element={<Mountain3 />} />
      <Route path="mountain-4" element={<Mountain4 />} />
      <Route path="mountain-5" element={<Mountain5 />} />
      <Route path="mountain-6" element={<Mountain6 />} />
    </Routes>
  );
};

export default PlacesRoute;
