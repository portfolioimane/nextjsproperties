'use client'
import { useAppSelector } from '@/store/hooks';

const PropertyList = () => {
  const { list, loading } = useAppSelector((state) => state.properties);

  if (loading) {
    return <p className="text-center col-span-full text-blue-600 text-xl">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {list.map((property) => (
        <div
          key={property.id}
          className="border border-blue-500 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-blue-50"
        >
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover mb-4 rounded-md"
          />
          <h2 className="text-xl font-semibold text-blue-700">{property.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{property.description}</p>
          <p className="text-yellow-500 font-bold text-lg">{property.price}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
