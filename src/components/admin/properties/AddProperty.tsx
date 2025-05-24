'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addProperty } from '@/store/admin/propertiesSlice';
import { useRouter } from 'next/navigation';

// Import icons from react-icons (Feather)
import {
  FiEdit,        // for title
  FiDollarSign,  // for price
  FiFileText,    // for description
  FiGrid,        // for area
  FiHome,        // for rooms
  FiDroplet,     // for bathrooms
  FiUser,        // for owner name
  FiMail,        // for owner email
  FiPhone,       // for owner phone
  FiImage,       // for images
  FiCamera       // for photo gallery
} from 'react-icons/fi';

const AddProperty: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.propertiesadmin.loading);
  const error = useSelector((state: RootState) => state.propertiesadmin.error);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [photoGallery, setPhotoGallery] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Please select the main image file.');
      return;
    }
    if (!ownerEmail) {
      alert('Please enter a valid owner email.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('area', area.toString());
    formData.append('rooms', rooms.toString());
    formData.append('bathrooms', bathrooms.toString());
    formData.append('owner_name', ownerName);
    formData.append('owner_phone', ownerPhone);
    formData.append('owner_email', ownerEmail);
    formData.append('image', imageFile);

    photoGallery.forEach((file) => {
      formData.append('photoGallery[]', file);
    });

    try {
      await dispatch(addProperty(formData)).unwrap();
      alert('Property added successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setArea(0);
      setRooms(0);
      setBathrooms(0);
      setOwnerName('');
      setOwnerPhone('');
      setOwnerEmail('');
      setImageFile(null);
      setPhotoGallery([]);

      router.push('/admin/properties'); // Redirect after success
    } catch {
      alert('Failed to add property. Please try again.');
    }
  };

  // Icon + Label component for reuse
  const LabelWithIcon = ({
    htmlFor,
    icon,
    children,
  }: {
    htmlFor: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <label htmlFor={htmlFor} className="text-gray-700 font-medium mb-1 flex items-center gap-1 select-none">
      {icon}
      <span>{children}</span>
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md grid grid-cols-2 gap-4"
    >
      <h2 className="col-span-2 text-2xl font-semibold text-gray-800 mb-2 text-center">
        Add New Property
      </h2>

      {/* Title */}
      <div className="flex flex-col">
        <LabelWithIcon htmlFor="title" icon={<FiEdit className="text-blue-500" />}>
          Title *
        </LabelWithIcon>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Property title"
        />
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <LabelWithIcon htmlFor="price" icon={<FiDollarSign className="text-green-500" />}>
          Price *
        </LabelWithIcon>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 100000"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col col-span-2">
        <LabelWithIcon htmlFor="description" icon={<FiFileText className="text-yellow-500" />}>
          Description
        </LabelWithIcon>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-1 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description"
        />
      </div>

      {/* Area, Rooms, Bathrooms in same line */}
      <div className="col-span-2 grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <LabelWithIcon htmlFor="area" icon={<FiGrid className="text-purple-500" />}>
            Area (m²) *
          </LabelWithIcon>
          <input
            id="area"
            type="number"
            value={area}
            onChange={(e) => setArea(parseInt(e.target.value) || 0)}
            required
            min={0}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 120"
          />
        </div>
        <div className="flex flex-col">
          <LabelWithIcon htmlFor="rooms" icon={<FiHome className="text-pink-500" />}>
            Rooms *
          </LabelWithIcon>
          <input
            id="rooms"
            type="number"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value) || 0)}
            required
            min={0}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 3"
          />
        </div>
        <div className="flex flex-col">
          <LabelWithIcon htmlFor="bathrooms" icon={<FiDroplet className="text-teal-500" />}>
            Bathrooms *
          </LabelWithIcon>
          <input
            id="bathrooms"
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
            required
            min={0}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 2"
          />
        </div>
      </div>

      {/* Owner Name, Email, Phone in same line */}
      <div className="col-span-2 grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <LabelWithIcon htmlFor="ownerName" icon={<FiUser className="text-indigo-500" />}>
            Owner Name *
          </LabelWithIcon>
          <input
            id="ownerName"
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Owner's full name"
          />
        </div>

        <div className="flex flex-col">
          <LabelWithIcon htmlFor="ownerEmail" icon={<FiMail className="text-red-500" />}>
            Owner Email *
          </LabelWithIcon>
          <input
            id="ownerEmail"
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>

        <div className="flex flex-col">
          <LabelWithIcon htmlFor="ownerPhone" icon={<FiPhone className="text-green-600" />}>
            Owner Phone *
          </LabelWithIcon>
          <input
            id="ownerPhone"
            type="text"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            required
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number"
          />
        </div>
      </div>

      {/* Main Image */}
      <div className="flex flex-col col-span-2">
        <LabelWithIcon htmlFor="imageFile" icon={<FiImage className="text-blue-700" />}>
          Main Image *
        </LabelWithIcon>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImageFile(e.target.files[0]);
            }
          }}
          required
          className=""
        />
      </div>

      {/* Photo Gallery */}
      <div className="flex flex-col col-span-2">
        <LabelWithIcon htmlFor="photoGallery" icon={<FiCamera className="text-pink-700" />}>
          Photo Gallery (optional)
        </LabelWithIcon>
        <input
          id="photoGallery"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setPhotoGallery(Array.from(e.target.files));
            }
          }}
          className=""
        />
      </div>

      {/* Submit button */}
      <div className="col-span-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold text-white rounded-md transition-colors ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add Property'}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="col-span-2 text-center text-red-600">{error}</p>}
    </form>
  );
};

export default AddProperty;
