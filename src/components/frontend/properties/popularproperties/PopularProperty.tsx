'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useState, useMemo } from 'react';
import { FaRulerCombined, FaBed, FaBath } from 'react-icons/fa';

const PropertyList = () => {
  const router = useRouter();
  const { popular, loading } = useAppSelector((state) => state.properties);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Extract unique types (categories)
  const categories = useMemo(() => {
    const types = popular.map((property) => property.type);
    return [...new Set(types)];
  }, [popular]);

  // Filtered popular based on selected type
  const filteredList = selectedType
    ? popular.filter((property) => property.type === selectedType)
    : popular;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-600 text-xl animate-pulse">Loading properties...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Browse by Category */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              selectedType === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'
            }`}
            onClick={() => setSelectedType(null)}
          >
            All
          </button>
          {categories.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border capitalize ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Property Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredList.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No properties found for selected category.
          </div>
        ) : (
          filteredList.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}`}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold text-blue-700 truncate" title={property.title}>
                  {property.title}
                </h2>

                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {property.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    City: {property.city || '-'}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium capitalize">
                    Type: {property.type || '-'}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium capitalize">
                    Offer: {property.offer_type || '-'}
                  </span>
                </div>

                <p className="mt-4 text-[#D4AF37] font-bold text-lg">{property.price} MAD</p>

                <div className="flex flex-wrap gap-4 mt-4 text-gray-700 text-sm">
                  <div className="flex items-center gap-1" title="Area (m²)">
                    <FaRulerCombined /> <span>{property.area} m²</span>
                  </div>
                  <div className="flex items-center gap-1" title="Rooms">
                    <FaBed /> <span>{property.rooms}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Bathrooms">
                    <FaBath /> <span>{property.bathrooms}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/properties/${property.id}`)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PropertyList;
