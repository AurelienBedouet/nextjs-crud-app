import React from "react";

const TabContent = ({ id, currentTab, children }) => {
  return currentTab === id ? <div>{children}</div> : "";
};

export default TabContent;
