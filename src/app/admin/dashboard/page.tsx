import React from 'react';
import AdminDashboard from '@/components/admin/adminDashboard';
// import useSelector or your auth hook to get user role

export default function DashboardPage() {
  // TODO: Replace this with your actual user role selector (from Redux or context)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
         Admin Dashboard
      </h1>
      <p className="mb-6 text-gray-600">
           Welcome to the admin panel
      </p>

       <AdminDashboard />
    </main>
  );
}
