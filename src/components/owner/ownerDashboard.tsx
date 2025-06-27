'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMyProperties,
  fetchMyContacts,
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

  const data = {
    labels: ['My Properties', 'My Contacts'],
    datasets: [
      {
        label: 'Count',
        data: [myPropertiesCount || 0, myContactsCount || 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
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
        text: 'My Dashboard Summary',
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {error && (
          <p className="col-span-full text-red-600 font-semibold">{error}</p>
        )}

        <Card title="My Properties" count={myPropertiesCount} loading={loading} />
        <Card title="My Contacts" count={myContactsCount} loading={loading} />
      </div>

      <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
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
