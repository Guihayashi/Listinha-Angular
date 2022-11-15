import HomeController from "../Screens/Home/Home";
import DetailController from "../Screens/Detail/Detail";
import { Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "../Store/LoginContext";
import Login from '../Screens/Login/Login';

  const RouteManager = () => {
    const context = useContext(LoginContext);
  
    if(context.token !== ""){
      return (
        <Routes>
          <Route path="/" element={<HomeController />} />
          <Route path="detail">
            <Route path=":infoID" element={<DetailController />} />
            <Route path="add" element={<DetailController />} />
          </Route>
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      );
    }
  };
export default RouteManager;