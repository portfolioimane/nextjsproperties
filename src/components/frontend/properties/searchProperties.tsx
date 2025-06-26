'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilterOptions } from '@/store/frontend/searchPropertySlice';
import type { RootState, AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';

const SearchProperties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { filters } = useSelector((state: RootState) => state.searchProperty);

  const [filtersLocal, setFiltersLocal] = useState({
    type: '',
    offer_type: '',
    city: '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltersLocal({ ...filtersLocal, [e.target.name]: e.target.value });
  };

  const handlePriceRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [min, max] = e.target.value.split(',');
    setFiltersLocal({
      ...filtersLocal,
      min_price: min !== '' ? min : '',
      max_price: max !== '' ? max : '',
    });
  };

  const handleSearch = () => {
    const query = Object.entries(filtersLocal)
      .filter(([_, v]) => v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    router.push(`/search?${query}`);
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
        <select name="type" value={filtersLocal.type} onChange={handleChange} className="flex-1 border rounded-lg px-4 py-3">
          <option value="">All Types</option>
          {filters.types.map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </select>

        <select name="offer_type" value={filtersLocal.offer_type} onChange={handleChange} className="flex-1 border rounded-lg px-4 py-3">
          <option value="">All Offers</option>
          {filters.offers.map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </select>

        <select name="city" value={filtersLocal.city} onChange={handleChange} className="flex-1 border rounded-lg px-4 py-3">
          <option value="">All Cities</option>
          {filters.cities.map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </select>

  <select name="price_range" onChange={handlePriceRange} className="flex-1 border rounded-lg px-4 py-3">
  {filters.priceRanges.map((range, i) => (
    <option key={i} value={`${range.min ?? ''},${range.max ?? ''}`}>
      {range.label}
    </option>
  ))}
</select>


        <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchProperties;
