'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchAllPlans,
  setEditingPlan,
  updatePlan,
  clearMessages,
} from '@/store/admin/planAdminSlice';

interface Plan {
  id: number;
  name: string;               // plan name like 'free', 'basic', etc.
  max_properties: number;
  duration_days: number | null; // null means no expiration
  price: number;
  created_at?: string;
  updated_at?: string;
}

const PlansTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { plans, loading, error, success, editingPlan } = useSelector(
    (state: RootState) => state.planAdmin
  );

  const [formData, setFormData] = useState({
    name: '',
    max_properties: 1,
    duration_days: null as number | null,
    price: 0,
  });

  useEffect(() => {
    dispatch(fetchAllPlans());
  }, [dispatch]);

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        max_properties: editingPlan.max_properties,
        duration_days: editingPlan.duration_days,
        price: editingPlan.price ?? 0,
      });
    }
  }, [editingPlan]);

  const handleEditClick = (planId: number) => {
    const plan = plans.find((p) => p.id === planId) || null;
    dispatch(setEditingPlan(plan));
  };

  const handleCloseModal = () => {
    dispatch(setEditingPlan(null));
    dispatch(clearMessages());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'max_properties' || name === 'price'
          ? Number(value)
          : name === 'duration_days'
          ? value === '' ? null : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      dispatch(updatePlan({ id: editingPlan.id, ...formData }));
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Plans</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Max Properties</th>
            <th className="border px-4 py-2">Price (MAD)</th>
            <th className="border px-4 py-2">Duration (Days)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td className="border px-4 py-2">{plan.id}</td>
              <td className="border px-4 py-2 capitalize">{plan.name}</td>
              <td className="border px-4 py-2">{plan.max_properties}</td>
              <td className="border px-4 py-2">{plan.price !== null ? Number(plan.price).toFixed(2) : '0.00'}</td>
              <td className="border px-4 py-2">{plan.duration_days ?? 'No Expiration'}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditClick(plan.id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit modal */}
      {editingPlan && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Plan #{editingPlan.id}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Max Properties</label>
                <input
                  type="number"
                  name="max_properties"
                  value={formData.max_properties}
                  min={1}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Price (MAD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  min={0}
                  step="0.01"
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Duration (Days)</label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days ?? ''}
                  min={0}
                  onChange={handleInputChange}
                  placeholder="Leave empty for no expiration"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansTable;
