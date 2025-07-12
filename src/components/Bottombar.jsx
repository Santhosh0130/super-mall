import React from "react";
import { NavLink } from "react-router-dom";
import {
    Home,
    Store,
    Package,
    Percent,
    Users,
    ShieldCheck,
} from "lucide-react";

const BottomBar = ({ role }) => {
    const adminLinks = [
        { to: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
        { to: "/admin/merchants", icon: <Users size={20} />, label: "Merchants" },
        { to: "/admin/shops", icon: <Store size={20} />, label: "Shops" },
        { to: "/admin/products", icon: <Package size={20} />, label: "Products" },
        { to: "/admin/pending-merchants", icon: <ShieldCheck size={20} />, label: "Verify" },
    ];

    const merchantLinks = [
        { to: "/merchant/dashboard", icon: <Home size={20} />, label: "Home" },
        { to: "/merchant/shop", icon: <Store size={20} />, label: "Shop" },
        { to: "/merchant/products", icon: <Package size={20} />, label: "Products" },
        { to: "/merchant/offers", icon: <Percent size={20} />, label: "Offers" },
    ];

    const links = role === "Admin" ? adminLinks : merchantLinks;

    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 py-2 ${isActive ? "text-blue-600" : "text-gray-500"
        }`;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex md:hidden z-50">
            {links.map((link, index) => (
                <NavLink key={index} to={link.to} className={linkStyle}>
                    {link.icon}
                    <span className="text-xs mt-1">{link.label}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default BottomBar;
