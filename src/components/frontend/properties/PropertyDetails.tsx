'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  FaRulerCombined,
  FaBed,
  FaBath,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaHome,
} from 'react-icons/fa';

const PropertyDetails = () => {
  const property = useAppSelector((state) => state.properties.details);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!property) {
    return <p className="text-center py-10">Loading property details...</p>;
  }

  const images = [
    { id: 0, url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${property.image}`, alt: property.title },
    ...property.photo_gallery.map((photo: any, index: number) => ({
      id: index + 1,
      url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${photo.photo_url}`,
      alt: `Gallery image ${index + 1}`,
    })),
  ];

  const openModal = (index: number) => {
    setStartIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send data to backend here
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 flex gap-10">
        {/* Left column - 60% width */}
        <div className="w-3/5">
          {/* Main Image */}
          <img
            src={images[0].url}
            alt={property.title}
            className="w-full h-80 object-cover rounded-lg mb-6 cursor-pointer"
            onClick={() => openModal(0)}
          />

          {/* Grid Gallery */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {images.map((img, idx) => (
              <img
                key={img.id}
                src={img.url}
                alt={img.alt}
                className="h-24 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                onClick={() => openModal(idx)}
              />
            ))}
          </div>

          {/* Property Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-gray-700">{property.description}</p>

            <div className="mt-4 text-gray-800">
              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <FaHome className="text-blue-600" />
                <strong>Price:</strong> {property.price}
              </div>

              {/* Area, Rooms, Bathrooms */}
              <div className="flex items-center gap-6 mb-3 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <FaRulerCombined className="text-blue-600" />
                  {property.area} m²
                </div>
                <div className="flex items-center gap-1">
                  <FaBed className="text-blue-600" />
                  {property.rooms} Rooms
                </div>
                <div className="flex items-center gap-1">
                  <FaBath className="text-blue-600" />
                  {property.bathrooms} Bathrooms
                </div>
              </div>

              {/* Owner credentials */}
              <div className="flex items-center gap-6 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-blue-600" />
                  {property.owner_phone}
                </div>
                {property.owner_email && (
                  <div className="flex items-center gap-1">
                    <FaEnvelope className="text-blue-600" />
                    {property.owner_email}
                  </div>
                )}
              </div>

  
            </div>
          </div>
        </div>

        {/* Right column - 40% width, sticky */}
        <div className="w-2/5 sticky top-20 self-start p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-6">Contact Owner</h2>

          {submitted ? (
            <p className="text-green-600 font-semibold">Message sent successfully!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Modal with fullscreen Swiper carousel */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
            aria-label="Close gallery"
          >
            &times;
          </button>

          <Swiper
            initialSlide={startIndex}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="max-w-4xl w-full h-[80vh]"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-contain rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default PropertyDetails;
