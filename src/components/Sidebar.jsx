import { useState } from "react";
import {
  FaCalendar,
  FaChalkboardTeacher,
  FaTachometerAlt,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../context";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Santri", path: "/santri", icon: <FaUserGraduate /> },
    { name: "Wali Santri", path: "/wali-santri", icon: <FaUsers /> },
    { name: "Pengajar", path: "/pengajar", icon: <FaChalkboardTeacher /> },
    {
      name: "Jadwal Pengajaran",
      path: "/jadwal-pengajaran",
      icon: <FaCalendar />,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white transition-all z-50 ${
          isOpen ? "w-64" : "w-24"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center py-6 border-b border-gray-700">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <img
                src={user?.gambar}
                alt="logo user"
                className="w-full h-full object-cover"
              />
            </div>
            {isOpen && <p className="mt-2 text-sm">{user?.username}</p>}
          </div>

          {/* Menu */}
          <nav className="flex-1 mt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-lg transition-all ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  } ${isOpen ? "" : "justify-center"}`
                }
              >
                <span className="text-xl text-white">{item.icon}</span>
                {isOpen && <span className="ml-3 text-white">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          className="absolute top-12 transform -translate-y-1/2 right-[-22px] bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-700 transition-all"
          onClick={toggleSidebar}
        >
          {isOpen ? "<" : ">"}
        </button>
      </div>
    </>
  );
};
