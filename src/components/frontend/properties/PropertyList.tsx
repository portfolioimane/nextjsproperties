'use client';

import { useAppSelector } from '@/store/hooks';
import { FaRulerCombined, FaBed, FaBath, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';

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
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}`}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              {property.featured ? (
                <div className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <FaStar /> Featured
                </div>
              ) : null}
            </div>

            <div className="p-5">
              <h2
                className="text-lg font-semibold text-blue-700 truncate"
                title={property.title}
              >
                {property.title}
              </h2>

              <p className="text-gray-600 text-sm mt-1 line-clamp-3">{property.description}</p>

              <p className="mt-4 text-[#D4AF37] font-bold text-lg">{property.price}</p>

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

              <div className="border-t border-gray-200 mt-5 pt-4 text-gray-600 text-sm space-y-1">
                <p>
                  <span className="font-semibold text-blue-700">Owner:</span> {property.owner_name}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <a href={`tel:${property.owner_phone}`} className="hover:underline">
                    {property.owner_phone}
                  </a>
                </p>
                {property.owner_email && (
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" />
                    <a href={`mailto:${property.owner_email}`} className="hover:underline">
                      {property.owner_email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyList;
