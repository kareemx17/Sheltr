"use client";
import { useState } from "react";
import { ArrowRightFromLine } from "lucide-react";

const Sidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 h-[calc(100vh-64px)] bg-amber-300 ${
        sidebarExpanded ? "w-64" : "w-24"
      }`}
    >
      <button onClick={toggleSidebar} className="p-2">
        <ArrowRightFromLine />
      </button>
    </div>
  );
};

export default Sidebar;
