import React from "react";
import Posts from "./Posts";
import Sidebar from "./Sidebar";

const Feed = () => {
  return (
    <>
      <h2 className="text-2xl">Latest Posts</h2>
      <div className="grid grid-cols-12 gap-8 my-8">
        <Posts />
        <Sidebar />
      </div>
    </>
  );
};

export default Feed;
