import React from "react";

const Main = ({ children }) => {
  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className="grid px-6 mx-auto w-full">{children}</div>
    </main>
  );
};

export default Main;
