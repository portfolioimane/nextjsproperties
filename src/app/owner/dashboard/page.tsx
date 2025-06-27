import React from 'react';
import OwnerDashboard from '@/components/owner/ownerDashboard';
// import useSelector or your auth hook to get user role

export default function DashboardPage() {
  // TODO: Replace this with your actual user role selector (from Redux or context)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
         Owner Dashboard
      </h1>
      <p className="mb-6 text-gray-600">
           Welcome to the owner panel
      </p>

       <OwnerDashboard />
    </main>
  );
}
