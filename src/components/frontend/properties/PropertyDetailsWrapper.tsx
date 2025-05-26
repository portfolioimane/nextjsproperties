'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setPropertyDetails, Property } from '@/store/propertiesSlice';
import PropertyDetails from './PropertyDetails';

interface PropertyDetailsWrapperProps {
  property: Property;
}

const PropertyDetailsWrapper = ({ property }: PropertyDetailsWrapperProps) => {
  const dispatch = useAppDispatch();

  // Hydrate Redux store with property details
  useEffect(() => {
    dispatch(setPropertyDetails(property));
  }, [dispatch, property]);

  return <PropertyDetails />;
};

export default PropertyDetailsWrapper;
