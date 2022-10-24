import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="w-[95%] mx-auto xl:max-w-[1280px] 2xl:w-full font-poppins font-normal">
      <Nav />
      <main className="mt-12">{children}</main>
    </div>
  );
};

export default Layout;
