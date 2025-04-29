// PropertyListWrapper.tsx
'use client'
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setProperties } from '@/store/propertiesSlice';
import PropertyList from './PropertyList';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

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
