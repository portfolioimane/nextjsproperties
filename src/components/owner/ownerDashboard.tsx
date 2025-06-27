'use client';


import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMyProperties,
  fetchMyContacts,
} from '@/store/dashboardSlice';

export default function OwnerDashboard() {
  const dispatch = useAppDispatch();

  const {
    myPropertiesCount,
    myContactsCount,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchMyProperties());
    dispatch(fetchMyContacts());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {error && (
        <p className="col-span-full text-red-600 font-semibold">{error}</p>
      )}

      <Card title="My Properties" count={myPropertiesCount} loading={loading} />
      <Card title="My Contacts" count={myContactsCount} loading={loading} />
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
