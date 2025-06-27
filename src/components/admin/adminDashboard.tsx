'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchOwners,
  fetchAllProperties,
  fetchSubscriptions,
} from '@/store/dashboardSlice';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  const data = {
    labels: ['Owners', 'Properties', 'Paid Subs', 'Free Subs'],
    datasets: [
      {
        label: 'Count',
        data: [
          ownersCount || 0,
          allPropertiesCount || 0,
          subscriptions.paid || 0,
          subscriptions.free || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // green
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(245, 158, 11, 0.7)', // yellow
          'rgba(239, 68, 68, 0.7)',  // red
        ],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Dashboard Overview',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Count: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {error && (
          <p className="col-span-full text-red-600 font-semibold">{error}</p>
        )}

        <Card title="Total Owners" count={ownersCount} loading={loading} />
        <Card title="Total Properties" count={allPropertiesCount} loading={loading} />
        <Card title="Paid Subscriptions" count={subscriptions.paid} loading={loading} />
        <Card title="Free Subscriptions" count={subscriptions.free} loading={loading} />
      </div>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <Bar data={data} options={options} />
      </div>
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
      <p className="text-4xl font-bold">{loading ? '...' : count}</p>
    </div>
  );
}
