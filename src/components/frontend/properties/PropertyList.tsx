'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { FaRulerCombined, FaBed, FaBath, FaStar } from 'react-icons/fa';

const PropertyList = () => {
  const router = useRouter();
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
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}`}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
        
            </div>

            <div className="p-5">
              <h2
                className="text-lg font-semibold text-blue-700 truncate"
                title={property.title}
              >
                {property.title}
              </h2>

              <p className="text-gray-600 text-sm mt-1 line-clamp-3">{property.description}</p>

              {/* Display City, Type, Offer Type */}
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
        ))}
      </div>
    </section>
  );
};

export default PropertyList;
