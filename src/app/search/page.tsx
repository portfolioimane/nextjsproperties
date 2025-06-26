'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '@/store/frontend/searchPropertySlice';
import type { RootState, AppDispatch } from '@/store';
import PropertyListWrapper from '@/components/frontend/properties/propertieslist/PropertyListWrapper';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { properties, loading, error } = useSelector((state: RootState) => state.searchProperty);

  const filters = {
    type: searchParams.get('type') || '',
    offer_type: searchParams.get('offer_type') || '',
    city: searchParams.get('city') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  };

  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [dispatch, searchParams.toString()]);

  return (
    <div className="max-w-7xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Search Results</h1>

      {loading && <p className="text-gray-600">Loading properties...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && properties.length === 0 && <p className="text-gray-600">No properties found.</p>}
      {!loading && properties.length > 0 && <PropertyListWrapper properties={properties} />}
    </div>
  );
};

export default SearchPage;
