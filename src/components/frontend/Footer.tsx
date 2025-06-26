'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/logo.png`}
            alt="Logo"
            className="h-16 mb-3"
          />
          <p className="text-gray-400">Helping you find the best properties in Morocco.</p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/roomsList" className="hover:text-white">Rooms</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Contact</h4>
          <p className="text-gray-400">Email: support@myrealestate.com</p>
          <p className="text-gray-400">Phone: +212 600 000 000</p>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs border-t border-gray-700 py-4">
        &copy; {new Date().getFullYear()} MyRealEstate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

