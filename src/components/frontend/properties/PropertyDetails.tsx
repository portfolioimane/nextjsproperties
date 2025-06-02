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
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUser
} from 'react-icons/fa';

const PropertyDetails = () => {
  const property = useAppSelector((state) => state.properties.details);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [contactMethod, setContactMethod] = useState('email');
const [visitDate, setVisitDate] = useState('');
const [message, setMessage] = useState('');
const [submitted, setSubmitted] = useState(false);


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
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
                  <span className="font-semibold">Price:</span> {property.price}
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

              <div className="flex items-center gap-2 mt-4">
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="font-semibold">Location:</span> {property.address || 'N/A'}
              </div>

              <div className="pt-4 border-t mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  <strong>Owner:</strong> {property.owner_name || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  {property.owner_phone}
                </div>
                {property.owner_email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" />
                    {property.owner_email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side – Contact Form */}
<div className="sticky top-20 self-start p-6 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact the Owner</h2>

  {submitted ? (
    <div className="text-green-600 font-medium text-center">Thank you! Your message has been sent.</div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-600">Your Name</label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-600">Your Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-gray-600">Phone Number</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="+212 600 000 000"
        />
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label htmlFor="contactMethod" className="text-sm font-medium text-gray-600">Preferred Contact Method</label>
        <select
          id="contactMethod"
          value={contactMethod}
          onChange={(e) => setContactMethod(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>

      {/* Visit/Move-in Date */}
      <div>
        <label htmlFor="date" className="text-sm font-medium text-gray-600">Preferred Visit Date</label>
        <input
          id="date"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="text-sm font-medium text-gray-600">Message</label>
        <textarea
          id="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="I'm interested in this property..."
        ></textarea>
      </div>



      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Send Inquiry
      </button>
    </form>
  )}
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
