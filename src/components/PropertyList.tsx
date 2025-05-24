'use client';

import { useAppSelector } from '@/store/hooks';

const PropertyList = () => {
  const { list, loading } = useAppSelector((state) => state.properties);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-600 text-xl animate-pulse">Loading properties...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Property Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {list.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-lg font-semibold text-blue-700 truncate">{property.title}</h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{property.description}</p>
              <p className="mt-4 text-yellow-600 font-bold text-lg">{property.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyList;
