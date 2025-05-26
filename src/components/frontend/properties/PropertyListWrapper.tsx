'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setProperties, Property } from '@/store/propertiesSlice'; // ✅ Import the Property type
import PropertyList from './PropertyList';

interface PropertyListWrapperProps {
  properties: Property[];
}

const PropertyListWrapper = ({ properties }: PropertyListWrapperProps) => {
  const dispatch = useAppDispatch();

  // Hydrate Redux store on the client
  useEffect(() => {
    dispatch(setProperties(properties));
  }, [dispatch, properties]);

  return <PropertyList />;
};

export default PropertyListWrapper;
