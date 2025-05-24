'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { checkAuth, logout } from '@/store/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; // <-- for App Router


interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isPropertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
    const [isAmenitiesDropdownOpen, setAmenitiesDropdownOpen] = useState(false);
    const [isCustomizeDropdownOpen, setCustomizeDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
    const [isReviewsDropdownOpen, setReviewsDropdownOpen] = useState(false);
    const [isCustomersDropdownOpen, setCustomersDropdownOpen] = useState(false);

    const toggleDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter((prev) => !prev);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        router.push('/'); // Redirect to home
    };

    return (
        <div className="flex min-h-screen overflow-hidden">
            <aside className="w-64 bg-[#1E40AF] text-white p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-[#CA8A04]">Admin Dashboard</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-2 hover:bg-[#1A3D8A] p-2 rounded transition-colors"
                        >
                            <i className="material-icons">dashboard</i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setAmenitiesDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">home_repair_service</i>
                                <span>Manage Amenities</span>
                            </div>
                            <i className="material-icons">{isAmenitiesDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isAmenitiesDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/amenities" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        View Amenities
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/amenities/add" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Add Amenity
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setPropertiesDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">shopping_bag</i>
                                <span>Manage Properties</span>
                            </div>
                            <i className="material-icons">{isPropertiesDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isPropertiesDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/properties" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        View Properties
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/properties/add" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Add Property
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link href="/admin/bookings" className="flex items-center space-x-2 hover:bg-[#1A3D8A] p-2 rounded transition-colors">
                            <i className="material-icons">assignment_turned_in</i>
                            <span>Manage Bookings</span>
                        </Link>
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setCustomersDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">people</i>
                                <span>Manage Customers</span>
                            </div>
                            <i className="material-icons">{isCustomersDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isCustomersDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/customers" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        View Customers
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setReviewsDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">reviews</i>
                                <span>Manage Reviews</span>
                            </div>
                            <i className="material-icons">{isReviewsDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isReviewsDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/reviews" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        All Reviews
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/reviews/add" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Add Review
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setCustomizeDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">palette</i>
                                <span>Customize Website</span>
                            </div>
                            <i className="material-icons">{isCustomizeDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isCustomizeDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/generalcustomize" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        General
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/customize/homepageheader" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Hero Section
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div
                            onClick={() => toggleDropdown(setSettingsDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">settings</i>
                                <span>Manage Settings</span>
                            </div>
                            <i className="material-icons">{isSettingsDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isSettingsDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/paymentsetting" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Payments
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/emailsetting" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        Email Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/smssetting" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        SMS Settings
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link href="/admin/contact-messages" className="flex items-center space-x-2 hover:bg-[#1A3D8A] p-2 rounded transition-colors">
                            <i className="material-icons">message</i>
                            <span>Contact Messages</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-[#1E40AF] hover:text-[#CA8A04]"
                        target="_blank"
                    >
                        <i className="material-icons">public</i>
                        <span>View Website</span>
                    </Link>

                    <button onClick={handleLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-700">
                        <i className="material-icons">exit_to_app</i>
                        <span>Logout</span>
                    </button>
                </div>

                {/* Render the child pages here */}
    {children}
  </main>
        </div>
    );
};

export default AdminLayout;
