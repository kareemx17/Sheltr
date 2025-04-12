"use client";
import { useState } from "react";
import { ArrowRightFromLine } from "lucide-react";
import ProfileCircle from "./ProfileCircle";

const Sidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 h-[calc(100vh-64px)] bg-amber-300 ${
        sidebarExpanded ? "w-64" : "w-20"
      }`}
    >
      <button onClick={toggleSidebar} className="p-2 mt-4">
        <ArrowRightFromLine size={30} />
      </button>

      <div className="flex-grow"></div>

      <div className="mb-4">
        <ProfileCircle />
      </div>
    </div>
  );
};

export default Sidebar;
