import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="bg-white border-b shadow-lg fixed top-0 left-0 w-full z-10">
        <Nav />
      </div>
      <main className="mt-32 mb-24 w-[95%] mx-auto xl:max-w-[1280px] 2xl:w-full font-poppins font-normal">
        {children}
      </main>
      <div className="bg-white text-gray-700 border-t shadow-lg">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
