"use client";

import React, { useState } from "react";

import { FaBars, FaHome, FaUser } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 bg-gray-800 text-white h-full flex flex-col",
        isSidebarOpen ? "w-60" : "w-16",
      )}
    >
      <Button onClick={toggleSidebar} className="p-2 bg-gray-900 hover:bg-gray-700 flex items-center justify-center">
        <FaBars />
      </Button>
      <div className="flex flex-col flex-grow">
        <div className="p-4 flex items-center">
          <FaHome className="inline-block mr-2" />
          {isSidebarOpen && <span>Dashboard</span>}
        </div>
        <div className="p-4 flex items-center">
          <FaUser className="inline-block mr-2" />
          {isSidebarOpen && <span>Users</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
