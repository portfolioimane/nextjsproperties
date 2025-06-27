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

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  // Determine dashboard link only for admin or owner
  let dashboardLink: string | null = null;
  if (user?.role === 'admin') dashboardLink = '/admin/dashboard';
  else if (user?.role === 'owner') dashboardLink = '/owner/dashboard';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/logo.png`}
            alt="Logo"
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition">
            Properties
          </Link>

          {authChecked && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition focus:outline-none"
              >
                <span className="material-icons text-xl">
                  {isAuthenticated ? 'account_circle' : 'person'}
                </span>
                <span className="ml-2 text-sm font-medium">
                  {isAuthenticated ? user?.name : 'Account'}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-20 py-2 border border-gray-100">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      {dashboardLink && (
                        <Link
                          href={dashboardLink}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600"
          >
            <span className="material-icons text-2xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-2">
          <Link href="/" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
            Home
          </Link>
          <Link
            href="/roomsList"
            className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
          >
            Rooms
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
          >
            Contact
          </Link>

          {authChecked &&
            (isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <Link
                    href="/customerdashboard/profile"
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  >
                    Profile
                  </Link>
                )}

                {dashboardLink && (
                  <Link
                    href={dashboardLink}
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
