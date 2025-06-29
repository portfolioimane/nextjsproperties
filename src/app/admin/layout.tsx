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
    const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
    const [isOwnersDropdownOpen, setOwnersDropdownOpen] = useState(false);

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
                <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">Admin Dashboard</h2>
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
                            onClick={() => toggleDropdown(setOwnersDropdownOpen)}
                            className="flex items-center justify-between space-x-2 hover:bg-[#1A3D8A] p-2 rounded cursor-pointer transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <i className="material-icons">people</i>
                                <span>Manage Owners</span>
                            </div>
                            <i className="material-icons">{isOwnersDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                        </div>
                        {isOwnersDropdownOpen && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <Link href="/admin/owners" className="block hover:bg-[#1A3D8A] p-2 rounded">
                                        View Owners
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
                              
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link href="/admin/plans" className="flex items-center space-x-2 hover:bg-[#1A3D8A] p-2 rounded transition-colors">
                            <i className="material-icons">assignment_turned_in</i>
                            <span>Manage Plans</span>
                        </Link>
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
                       
                            </ul>
                        )}
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
