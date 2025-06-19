'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ContactForm from './ContactForm';

import {
  FaRulerCombined,
  FaBed,
  FaBath,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUser,
  FaCity,
  FaTag,
  FaHandshake,
} from 'react-icons/fa';

const PropertyDetails = () => {
  const property = useAppSelector((state) => state.properties.details);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!property) return <p className="text-center py-10">Loading property details...</p>;

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

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Side */}
        <div className="md:col-span-2 space-y-8">
          {/* Image gallery */}
          <div>
            <div className="relative mb-4">
              <img
                src={images[0].url}
                alt={property.title}
                onClick={() => openModal(0)}
                className="w-full h-96 object-cover rounded-lg shadow cursor-pointer hover:brightness-90 transition"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 8).map((img, idx) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt}
                  className="h-24 w-full object-cover rounded hover:ring-2 hover:ring-blue-500 cursor-pointer"
                  onClick={() => openModal(idx)}
                />
              ))}
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{property.title}</h1>
            <p className="text-gray-600 text-lg">{property.description}</p>

            <div className="text-gray-700 grid gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaMoneyBillWave className="text-blue-600" />
                  <span className="font-semibold">Price:</span> {property.price} MAD
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaRulerCombined className="text-blue-600" />
                  <span className="font-semibold">Area:</span> {property.area} m²
                </div>
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaBed className="text-blue-600" />
                  <span className="font-semibold">Rooms:</span> {property.rooms}
                </div>
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaBath className="text-blue-600" />
                  <span className="font-semibold">Bathrooms:</span> {property.bathrooms}
                </div>
              </div>

              {/* New Fields: City, Type, Offer Type */}
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaCity className="text-blue-600" />
                  <span className="font-semibold">City:</span> {property.city || 'N/A'}
                </div>
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaTag className="text-blue-600" />
                  <span className="font-semibold">Type:</span> {property.type || 'N/A'}
                </div>
                <div className="flex-1 min-w-[150px] flex items-center gap-2 border p-3 rounded shadow-sm">
                  <FaHandshake className="text-blue-600" />
                  <span className="font-semibold">Offer:</span> {property.offer_type || 'N/A'}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="font-semibold">Location:</span> {property.address || 'N/A'}
              </div>

              <div className="pt-4 border-t mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  <strong>Owner:</strong> {property.owner.name || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  {property.owner.phone}
                </div>
                {property.owner.email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" />
                    {property.owner.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side – Contact Form */}
        <div>
          <ContactForm propertyId={property.id} />
        </div>
      </div>

      {/* Fullscreen Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-6 text-white text-4xl font-bold z-50"
            aria-label="Close gallery"
          >
            &times;
          </button>

          <Swiper
            initialSlide={startIndex}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full max-w-5xl h-[80vh]"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-contain rounded-lg"
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
