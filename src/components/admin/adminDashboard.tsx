'use client';


import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchOwners,
  fetchAllProperties,
  fetchSubscriptions,
} from '@/store/dashboardSlice';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  const {
    ownersCount,
    allPropertiesCount,
    subscriptions,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchOwners());
    dispatch(fetchAllProperties());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {error && (
        <p className="col-span-full text-red-600 font-semibold">{error}</p>
      )}

      <Card title="Total Owners" count={ownersCount} loading={loading} />
      <Card title="Total Properties" count={allPropertiesCount} loading={loading} />
      <Card title="Paid Subscriptions" count={subscriptions.paid} loading={loading} />
      <Card title="Free Subscriptions" count={subscriptions.free} loading={loading} />
    </div>
  );
}

function Card({
  title,
  count,
  loading,
}: {
  title: string;
  count: number;
  loading: boolean;
}) {
  return (
    <div className="bg-white shadow rounded p-6 text-center">
      <h3 className="text-gray-500 mb-2">{title}</h3>
      <p className="text-4xl font-bold">
        {loading ? '...' : count}
      </p>
    </div>
  );
}
