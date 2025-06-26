'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { fetchSubscription, fetchPropertyCount } from '@/store/owner/subscriptionSlice';
import type { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isPropertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);

  const subscription = useSelector((state: RootState) => state.subscription.data);
  const propertyCount = useSelector((state: RootState) => state.subscription.propertyCount);
  const loading = useSelector((state: RootState) => state.subscription.loading);

  // Fetch subscription and property count on mount
  useEffect(() => {
    dispatch(fetchSubscription());
    dispatch(fetchPropertyCount());
  }, [dispatch]);

  const isSubscribed =
    !loading &&
    !!(subscription && (subscription.expires_at === null || new Date(subscription.expires_at) > new Date()));

  const reachedPropertyLimit =
    isSubscribed &&
    typeof propertyCount === 'number' &&
    propertyCount >= (subscription?.max_properties || 0);

  const userMessage = reachedPropertyLimit
    ? 'You have reached your property limit. You cannot create more properties.'
    : '';

  const enableAllLinks = isSubscribed;
  const enableAddProperty = isSubscribed && !reachedPropertyLimit;
  const enableSubscription = true;

  const renderLink = (
    href: string,
    icon: string,
    label: string,
    enabled: boolean,
    extraProps = {},
    tooltip?: string
  ) => (
    <div className="relative group">
      <Link
        href={enabled ? href : '#'}
        className={`flex items-center px-3 py-2 rounded transition ${
          enabled
            ? 'hover:bg-blue-800 text-white'
            : 'text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
        tabIndex={enabled ? 0 : -1}
        aria-disabled={!enabled}
        onClick={(e) => {
          if (!enabled) e.preventDefault();
        }}
        {...extraProps}
      >
        {icon && <span className="material-icons mr-3">{icon}</span>} {label}
      </Link>
      {!enabled && tooltip && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-yellow-300 text-black text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition">
          {tooltip}
        </div>
      )}
    </div>
  );

  const toggleDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold text-yellow-400">Owner Dashboard</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
  

          {renderLink('/owner/dashboard', 'dashboard', 'Dashboard', enableAllLinks)}

          {/* Manage Properties dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown(setPropertiesDropdownOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded transition focus:outline-none ${
                enableAllLinks
                  ? 'hover:bg-blue-800'
                  : 'text-gray-400 cursor-not-allowed pointer-events-none'
              }`}
              aria-expanded={isPropertiesDropdownOpen}
              disabled={!enableAllLinks}
              tabIndex={enableAllLinks ? 0 : -1}
              aria-disabled={!enableAllLinks}
              onKeyDown={(e) => {
                if (!enableAllLinks) e.preventDefault();
              }}
            >
              <span className="flex items-center space-x-3">
                <span className="material-icons">home</span>
                <span>Manage Properties</span>
              </span>
              <span className="material-icons">
                {isPropertiesDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {isPropertiesDropdownOpen && enableAllLinks && (
              <ul className="pl-10 mt-2 space-y-1 text-sm text-white">
                <li>
                  {renderLink(
                    '/owner/properties',
                    '',
                    'View Properties',
                    enableAllLinks,
                    { className: 'block px-2 py-1 rounded hover:bg-blue-700 transition' }
                  )}
                </li>
<li>
  {!enableAddProperty ? (
    <div
      title="You have reached your limit of properties you can create with this plan."
      className="block px-2 py-1 rounded bg-blue-800 text-blue-300 cursor-not-allowed"
    >
      Add Property
    </div>
  ) : (
    renderLink(
      '/owner/properties/add',
      '',
      'Add Property',
      true,
      {
        className:
          'block px-2 py-1 rounded hover:bg-blue-700 transition text-white',
      }
    )
  )}
</li>

              </ul>
            )}
          </div>

          {renderLink('/owner/contactCRM', 'message', 'Contact Messages', enableAllLinks)}
          {renderLink('/owner/subscription', 'credit_card', 'Subscription', enableSubscription)}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 text-blue-900 hover:text-yellow-500 transition"
          >
            <span className="material-icons">public</span>
            <span>View Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          >
            <span className="material-icons mr-2">exit_to_app</span> Logout
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;