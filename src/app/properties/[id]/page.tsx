// app/properties/[id]/page.tsx
import PropertyDetailsWrapper from '@/components/frontend/properties/PropertyDetailsWrapper';
import api from '@/utils/axios';

interface Params {
  id: string;
}

interface PropertyDetailsPageProps {
  params: Params | Promise<Params>;
}

const PropertyDetailsPage = async ({ params }: PropertyDetailsPageProps) => {
  const resolvedParams = await params; // <-- Await here
  const { id } = resolvedParams;
  
  const res = await api.get(`/properties/${id}`);
  const property = res.data;

  return (
    <div className="container mx-auto p-6">
      <PropertyDetailsWrapper property={property} />
    </div>
  );
};

export default PropertyDetailsPage;
