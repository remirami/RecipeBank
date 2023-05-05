import React from "react";
import StickyNavBar from "./StickyNavbar";

const Layout = ({ children, isLoggedIn, onLogout }) => {
  return (
    <div>
      <StickyNavBar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
