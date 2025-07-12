import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/merchants", label: "Merchants" },
    { to: "/admin/shops", label: "Shops" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/pending-merchants", label: "Verify Merchants" },
  ];

  const merchantLinks = [
    { to: "/merchant/dashboard", label: "Dashboard" },
    { to: "/merchant/shop", label: "My Shop" },
    { to: "/merchant/products", label: "Products" },
    { to: "/merchant/offers", label: "Offers" },
  ];

  const currentLink = role === "Admin" ? adminLinks : merchantLinks;

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"
    }`;

  return (
    <div className="hidden md:block w-64 bg-gray-100 border-r p-4 h-screen">
      <h1 className="text-2xl font-bold mb-6">{role}</h1>
      <nav>
        {currentLink.map((link, index) => (
          <NavLink key={index} to={link.to} className={linkStyle}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
