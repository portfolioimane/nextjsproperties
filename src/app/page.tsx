// Home.tsx
import PropertyListWrapper from '@/components/frontend/properties/PropertyListWrapper';
import api from '@/utils/axios'; // Import your axios utility

const Home = async () => {
  // Fetch data using axios on the server
  const res = await api.get('/properties'); // Use the API endpoint
  const properties = res.data;
  
  return (
    <div className="container mx-auto p-6">
      {/* Pass data to the Client Component */}
      <PropertyListWrapper properties={properties} />
    </div>
  );
};

export default Home;
