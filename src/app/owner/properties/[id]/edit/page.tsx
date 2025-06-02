'use client';

import { useParams } from 'next/navigation';
import EditProperty from '@/components/owner/properties/EditProperty';

const EditPropertyOwnerPage = () => {
  const params = useParams();
  const propertyId = Number(params?.id); // Convert to number

  return (
    <div className="container mx-auto p-6">
      {!isNaN(propertyId) && <EditProperty propertyId={propertyId} />}
    </div>
  );
};

export default EditPropertyOwnerPage;
