'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setPopularProperties, Property } from '@/store/frontend/propertiesSlice'; // ✅ Import the Property type
import PopularProperty from './PopularProperty';

interface PopularPropertyWrapperProps {
  properties: Property[];
}

const PopularPropertyWrapper = ({ properties }: PopularPropertyWrapperProps) => {
  const dispatch = useAppDispatch();

  // Hydrate Redux store on the client
  useEffect(() => {
    dispatch(setPopularProperties(properties));
  }, [dispatch, properties]);

  return <PopularProperty />;
};

export default PopularPropertyWrapper;