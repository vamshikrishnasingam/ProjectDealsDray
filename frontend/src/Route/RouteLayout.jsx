import React, { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import NaigationBar from "../components/Navbar/NavigationBar";
import "./RouteLayout.css";
import Logo from "../components/Logo/Logo";

function RouteLayout() {
  return (
    // Render content once data is loaded
    <div>
      <div>
        <Logo />
        <NaigationBar />
      </div>
      <div className="page">
        <Outlet />
      </div>
    </div>
  );
}

export default RouteLayout;
