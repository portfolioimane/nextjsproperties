'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { checkAuth, logout } from '@/store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, authChecked } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Trigger checkAuth every time the component is mounted or refreshed
  useEffect(() => {
    dispatch(checkAuth()); // Dispatch checkAuth on mount or refresh
    // Force reload on refresh (this is optional and should be used with caution)
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  // Don't render until auth check is done
  if (!authChecked) return null;

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Property Listing App
        </Link>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link href="/roomsList" className="text-gray-700 hover:text-blue-500">
            Rooms
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-500">
            Contact
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              <span className="material-icons">
                {isAuthenticated ? 'account_circle' : 'person'}
              </span>
              <span className="ml-1">{isAuthenticated ? user?.name : 'Account'}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-40 z-20">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/customerdashboard/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/customerdashboard/mybookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-500"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2">
          <Link
            href="/"
            className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
          >
            Home
          </Link>
          <Link
            href="/roomsList"
            className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
          >
            Rooms
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
          >
            Contact
          </Link>
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/customerdashboard/profile"
                className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
              >
                Profile
              </Link>
              <Link
                href="/customerdashboard/mybookings"
                className="block text-gray-700 hover:bg-gray-200 px-2 py-1"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 hover:bg-gray-200 px-2 py-1"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
