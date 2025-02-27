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
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { name: "Santri", path: "/santri", icon: <FaUserGraduate /> },
        { name: "Wali Santri", path: "/wali-santri", icon: <FaUsers /> },
        { name: "Pengajar", path: "/pengajar", icon: <FaChalkboardTeacher /> },
        {
            name: "Jadwal Pengajaran",
            path: "/jadwal-pengajaran",
            icon: <FaCalendar />,
        },
        { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    ];

    return (
        <div
            className={`relative flex h-screen transition-all ${
                isOpen ? "w-64" : "w-24"
            } bg-gray-900 text-white`}
        >
            <div className="flex flex-col w-full">
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
                <nav className="flex-1 mt-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 my-1 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-blue-600"
                                        : "hover:bg-gray-700"
                                } ${isOpen ? "" : "justify-center"}`
                            }
                        >
                            <span className="text-xl text-white">
                                {item.icon}
                            </span>
                            {isOpen && (
                                <span className="ml-3 text-white">
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <button
                className={`absolute top-8 ${isOpen ? "left-56" : "left-18"} ml-2 bg-gray-800 text-white w-[2px] h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-700 transition-all`}
                onClick={toggleSidebar}
            >
                {isOpen ? "<" : ">"}
            </button>
        </div>
    );
};
