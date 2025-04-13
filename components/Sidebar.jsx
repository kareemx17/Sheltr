"use client";
import { useState } from "react";
import { ArrowRightFromLine, MapPinHouse } from "lucide-react";
import ProfileCircle from "./ProfileCircle";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center transition-all duration-100 h-[calc(100vh-64px)] ${
        sidebarExpanded ? " w-64" : " w-20"
      }`}
    >
      <motion.button
        onClick={toggleSidebar}
        className="p-2 mt-4 mb-4 transition-colors"
        whileHover={{ scale: 1.1, rotate: sidebarExpanded ? -180 : 0 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ArrowRightFromLine size={30} />
      </motion.button>

      <motion.div
        className="mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <a href="/shelters" className="cursor-default">
          <MapPinHouse size={30} className=""/>
        </a>
      </motion.div>

      <motion.div
        className="flex-grow"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      <motion.div
        className="mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ProfileCircle />
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
