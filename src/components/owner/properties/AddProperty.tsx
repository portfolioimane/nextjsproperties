'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addProperty } from '@/store/owner/ownerPropertiesSlice';
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
  const loading = useSelector((state: RootState) => state.propertiesowner.loading);
  const error = useSelector((state: RootState) => state.propertiesowner.error);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
    const [address, setAddress] = useState('');

  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [photoGallery, setPhotoGallery] = useState<File[]>([]);
   const [errorImage, setErrorImage] = useState<string | null>(null);
    const [errorGallery, setErrorGallery] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Please select the main image file.');
      return;
    }


    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('area', area.toString());
    formData.append('rooms', rooms.toString());
    formData.append('bathrooms', bathrooms.toString());
    formData.append('image', imageFile);
      formData.append('address', address);

    photoGallery.forEach((file) => {
      formData.append('photoGallery[]', file);
    });

    try {
      await dispatch(addProperty(formData)).unwrap();
      setTitle('');
      setDescription('');
      setPrice('');
      setAddress('');
      setArea(0);
      setRooms(0);
      setBathrooms(0);
      setImageFile(null);
      setPhotoGallery([]);

      router.push('/owner/properties'); // Redirect after success
    } catch {
    setSubmitError('Failed to add property. Please try again.');
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
  <>
    {submitError && (
      <p style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>
        {submitError}
      </p>
    )}
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

       <div className="flex flex-col col-span-2">
    <LabelWithIcon htmlFor="address" icon={<FiHome className="text-indigo-500" />}>
      Address *
    </LabelWithIcon>
    <input
      id="address"
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      required
      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Property address"
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
          const file = e.target.files?.[0];
          if (file) {
            const maxSizeInBytes = 2048 * 1024; // 2MB
            if (file.size > maxSizeInBytes) {
              setErrorImage("Image size must be less than 2 MB.");
              e.target.value = ""; // reset input
              setImageFile(null);
              return;
            }
            setErrorImage(null); // clear error if valid
            setImageFile(file);
          }
        }}
          required
          className=""
        />
         {errorImage && (
        <p style={{ color: "red", marginTop: "0.25rem", fontSize: "0.875rem" }}>
          {errorImage}
        </p>
      )}
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
      const maxSizeInBytes = 2048 * 1024; // 2MB
      const filesArray = Array.from(e.target.files);

      // Check if any file exceeds max size
      const tooLargeFile = filesArray.find(file => file.size > maxSizeInBytes);

      if (tooLargeFile) {
        setErrorGallery(`Each photo must be less than 2MB. "${tooLargeFile.name}" is too large.`);
        setPhotoGallery([]); // Clear previous selection or keep as you want
      } else {
        setErrorGallery(null); // Clear error if all good
        setPhotoGallery(filesArray);
      }
    }
  }}
  className=""
/>

{errorGallery && (
  <p style={{ color: "red", marginTop: "0.25rem", fontSize: "0.875rem" }}>
    {errorGallery}
  </p>
)}

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
      </>
  );
};

export default AddProperty;