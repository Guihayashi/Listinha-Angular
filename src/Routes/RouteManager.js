import HomeController from "../Screens/Home/Home";
import CadastroController from "../Screens/Cadastro/Cadastro";
import { Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "../Store/LoginContext";
import Despesa from '../Screens/Home/Home';

  const RouteManager = () => {
    const context = useContext(LoginContext);
  
    if(context.token !== ""){
      return (
        <Routes>
          <Route path="/" element={<HomeController />} />
          <Route path="cadastro">
            <Route path=":infoID" element={<CadastroController />} />
            <Route path="add" element={<CadastroController />} />
          </Route>
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={<Despesa />} />
        </Routes>
      );
    }
  };
export default RouteManager;