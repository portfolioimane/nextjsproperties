'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, deleteProperty, toggleFeatured } from '@/store/owner/ownerPropertiesSlice';
import Link from 'next/link';
import type { AppDispatch, RootState } from '@/store';

const AdminProperties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: properties, loading, error } = useSelector((state: RootState) => state.propertiesowner);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
    setHasFetched(true);
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete !== null) {
      await dispatch(deleteProperty(propertyToDelete));
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  const handleToggleFeatured = async (property: any) => {
    try {
      await dispatch(toggleFeatured(property.id));
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link
          href="/owner/properties/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add Property
        </Link>
      </div>

      {/* Loading, Error, Empty */}
      {hasFetched && (
        <>
          {loading ? (
            <p className="text-gray-600">Loading properties...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : properties.length === 0 ? (
            <p className="text-gray-500">No properties found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 table-auto">
                <thead className="bg-[#d4af37] text-white text-xs">
                  <tr>
                    <th className="border px-3 py-2">Main Image</th>
                    <th className="border px-3 py-2">Title</th>
                    <th className="border px-3 py-2">Price (MAD)</th>
                    <th className="border px-3 py-2">Rooms - Bathrooms</th>
                    <th className="border px-3 py-2">City</th>
                    <th className="border px-3 py-2">Type</th>
                    <th className="border px-3 py-2">Offer Type</th>
                    <th className="border px-3 py-2">Address</th>
                    <th className="border px-3 py-2">Description</th>
                    <th className="border px-3 py-2">Gallery</th>
                    <th className="border px-3 py-2">Featured</th>
                    <th className="border px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-sm">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}`}
                          alt={property.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="border px-3 py-2 font-semibold">{property.title}</td>
                      <td className="border px-3 py-2 text-green-600 font-bold">{property.price}</td>
                      <td className="border px-3 py-2">{property.rooms}R - {property.bathrooms}B</td>
                      <td className="border px-3 py-2">{property.city}</td>
                      <td className="border px-3 py-2 capitalize">{property.type}</td>
                      <td className="border px-3 py-2 capitalize">{property.offer_type}</td>
                      <td className="border px-3 py-2">{property.address}</td>
                      <td className="border px-3 py-2">{property.description}</td>
                      <td className="border px-3 py-2">
                        <div className="flex flex-wrap gap-2 max-w-xs max-h-24 overflow-auto">
                          {property.photo_gallery?.length > 0 ? (
                            property.photo_gallery.map((photo: any) => (
                              <img
                                key={photo.id}
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${photo.photo_url}`}
                                alt={`Gallery ${photo.id}`}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No photos</span>
                          )}
                        </div>
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={property.featured}
                          onChange={() => handleToggleFeatured(property)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/owner/properties/${property.id}/edit`}
                            className="bg-[#d4af37] hover:bg-[#b7950b] text-white text-center py-1 rounded"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(property.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this property?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
