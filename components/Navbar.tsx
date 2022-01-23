import React, { useState } from "react";
import { FaBars, FaBuffer, FaTimes } from "react-icons/fa";
import { useAuth } from "../lib/auth";

const Navbar = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { user, loggedIn, signOut } = useAuth();

  return (
    //   navbar goes here
    <nav className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* logo */}
            <div>
              <a href="/" className="flex items-center py-5 px-2 text-gray-700">
                <FaBuffer className="w-6 h-6" />
                <span className="font-bold px-2">Home</span>
              </a>
            </div>

            {/* primary nav */}
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="/profile"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                Profile
              </a>
              <a
                href="#"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                Pricing
              </a>
            </div>
          </div>
          {/* secondary nav */}
          {loggedIn ? (
            <div className="hidden md:flex items-center space-x-1">
              ({user?.email})
              <button className="py-5 px-3" onClick={signOut}>
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-1">
              <a href="/auth" className="py-5 px-3">
                Login
              </a>
              <a
                href="/auth"
                className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
              >
                Signup
              </a>
            </div>
          )}
          {/* mobile menu */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuToggle(!menuToggle)}>
              {menuToggle ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu items */}
      <div className={`${!menuToggle ? "hidden" : ""} md:hidden`}>
        <a
          href="/profile"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          Profile
        </a>
        <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">
          Pricing
        </a>

        {loggedIn ? (
          <button
            className="block py-2 px-4 text-sm hover:bg-gray-200"
            onClick={signOut}
          >
            Log out
          </button>
        ) : (
          <div>
            <a
              href="/auth"
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              Login
            </a>
            <a
              href="/auth"
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              Signup
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
