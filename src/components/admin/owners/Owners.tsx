'use client';

import React, { useEffect, useState }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchOwners } from '@/store/admin/ownersSlice';

const OwnersView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: owners, loading, error } = useSelector((state: RootState) => state.owners);
    const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    dispatch(fetchOwners());
            setHasFetched(true);  // mark fetch as triggered

  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#D4AF37' }}>
        Owners List
      </h1>
{hasFetched && (
        <>
      {loading && <p className="text-center text-gray-600">Loading owners...</p>}
      {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}
      {!loading && !error && owners.length === 0 && (
        <p className="text-center text-gray-500">No owners found.</p>
      )}

      {!loading && !error && owners.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr style={{ backgroundColor: '#D4AF37' }} className="text-left text-white">
                <th className="border border-gray-300 px-4 py-3 font-semibold">Name</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">Email</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr
                  key={owner.id}
                  className="hover:bg-yellow-50 transition-colors duration-200"
                >
                  <td className="border border-gray-300 px-4 py-3">{owner.name}</td>
                  <td className="border border-gray-300 px-4 py-3">{owner.email}</td>
                  <td className="border border-gray-300 px-4 py-3">{owner.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default OwnersView;
