"use client";
import { useEffect, useState } from "react";
import { ArrowRightFromLine, MapPinHouse } from "lucide-react";
import ProfileCircle from "./ProfileCircle";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";

const Sidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const user = useUserStore((state) => state.user);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center transition-all duration-100 h-[calc(100vh-64px)] ${
        sidebarExpanded ? " w-64" : " w-20"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 mt-4 mb-6 flex items-center gap-x-2 hover:scale-110 transition"
      >
        <ArrowRightFromLine size={30} />
        {sidebarExpanded && <h2>Collapse</h2>}
      </button>

      <div className="mb-6 flex hover:scale-110 transition">
        <a
          href="/shelters"
          className="cursor-default flex items-center gap-x-2"
        >
          <MapPinHouse size={30} className="" />
          {sidebarExpanded && <h2>Shelters</h2>}
        </a>
      </div>

      <div className="flex-grow"></div>

      <div className="mb-4 flex items-center gap-x-3">
        <ProfileCircle user={user ? user : { name: "User", email: "Email" }} />
        {sidebarExpanded && (
          <div>
            <p className="font-medium leading-5">
              {user.name.length >= 20
                ? user.name.slice(0, 18) + "..."
                : user.name}
            </p>
            <p className="text-xs text-gray-700">
              {user.email.length >= 21
                ? user.email.slice(0, 20) + "..."
                : user.email}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
