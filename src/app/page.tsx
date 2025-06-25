// app/page.tsx or app/home/page.tsx (for Next.js 13+ app directory)
import PopularPropertyWrapper from '@/components/frontend/properties/popularproperties/PopularPropertyWrapper';
import api from '@/utils/axios';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';

const Home = async () => {
  const res = await api.get('/popular-properties');
  const popularproperties = res.data;
  console.log('popularproperties', popularproperties);

  return (
    <div className="font-sans text-gray-800">

      {/* Hero */}
      <section className="bg-blue-50 py-20 px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">Find Your Perfect Home</h2>
        <p className="text-gray-600 mb-8">Explore top properties in your city with the best prices and locations.</p>
        <div className="max-w-2xl mx-auto flex bg-white shadow-md rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search by city, type, or price..."
            className="flex-grow px-6 py-3 outline-none"
          />
          <button className="bg-blue-600 text-white px-6 flex items-center gap-2">
            <FaSearch /> Search
          </button>
        </div>
      </section>


      {/* Property List */}
      <section id="properties">
        <PopularPropertyWrapper properties={popularproperties} />
      </section>

      {/* Why Choose Us */}
      <section id="why" className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-blue-800 mb-10">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Listings',
                text: 'All properties are checked and verified by our agents.',
              },
              {
                title: 'Local Expertise',
                text: 'We know your city better than anyone else.',
              },
              {
                title: 'Best Price Guarantee',
                text: 'We help you find the best property for your budget.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <FaCheckCircle className="text-blue-600 text-3xl mb-4 mx-auto" />
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center px-6">
        <h3 className="text-3xl font-bold mb-4">Want to List Your Property?</h3>
        <p className="mb-6">Join our platform and reach thousands of buyers and renters.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100">
          Get Started
        </button>
      </section>

    </div>
  );
};

export default Home;

