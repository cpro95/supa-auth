import React, { useState } from "react";
import Link from "next/link";
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
              <Link href="/">
                <a className="flex items-center py-5 px-2 text-gray-700">
                  <FaBuffer className="w-6 h-6" />
                  <span className="font-bold px-2">Home</span>
                </a>
              </Link>
            </div>

            {/* primary nav */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/profile">
                <a className="py-5 px-3 text-gray-700 hover:text-gray-900">
                  Profile
                </a>
              </Link>
              <Link href="/posts">
                <a className="py-5 px-3 text-gray-700 hover:text-gray-900">
                  Posts
                </a>
              </Link>
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
              <Link href="/auth">
                <a className="py-5 px-3">Login</a>
              </Link>
              <Link href="/auth">
                <a className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">
                  Signup
                </a>
              </Link>
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
        <Link href="/profile">
          <a className="block py-2 px-4 text-sm hover:bg-gray-200">Profile</a>
        </Link>
        <Link href="/posts">
          <a className="block py-2 px-4 text-sm hover:bg-gray-200">Posts</a>
        </Link>

        {loggedIn ? (
          <button
            className="block py-2 px-4 text-sm hover:bg-gray-200"
            onClick={signOut}
          >
            Log out
          </button>
        ) : (
          <div>
            <Link href="/auth">
              <a className="block py-2 px-4 text-sm hover:bg-gray-200">Login</a>
            </Link>
            <Link href="/auth">
              <a className="block py-2 px-4 text-sm hover:bg-gray-200">
                Signup
              </a>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
