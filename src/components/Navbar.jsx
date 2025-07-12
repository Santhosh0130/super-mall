import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => {
          navigate("/");
          closeMobileMenu();
        }}
      >
        Smart Mall
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <button
          onClick={() => navigate("/")}
          className="text-gray-700 hover:text-blue-600 font-semibold"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-blue-600 font-semibold"
        >
          Profile
        </button>

        <span className="text-gray-600">Hi, {userName || "Guest"}</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile hamburger icon */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          className="focus:outline-none"
        >
          {/* Hamburger icon: 3 bars */}
          <svg
            className="w-8 h-8 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              // X icon when menu open
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger bars when menu closed
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col py-4 space-y-3 md:hidden z-50">
          <button
            onClick={() => {
              navigate("/");
              closeMobileMenu();
            }}
            className="text-gray-700 px-6 py-2 text-left hover:bg-gray-100"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              closeMobileMenu();
            }}
            className="text-gray-700 px-6 py-2 text-left hover:bg-gray-100"
          >
            Profile
          </button>
          <div className="px-6 py-2 text-gray-600">Hello, {userName || "Guest"}</div>
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
