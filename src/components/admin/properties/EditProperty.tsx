'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchPropertyById, updateProperty } from '@/store/admin/propertiesSlice';
import { useRouter } from 'next/navigation';

import {
  FiEdit,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiHome,
  FiDroplet,
  FiUser,
  FiMail,
  FiPhone,
  FiImage,
  FiCamera,
  FiXCircle,
} from 'react-icons/fi';

interface EditPropertyProps {
  propertyId: number;
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { current: property, loading, error } = useSelector((state: RootState) => state.propertiesadmin);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Main image: can be existing URL or new File
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Existing main image URL from backend
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Photo gallery: existing photos as URLs, new files, and previews
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [photoGalleryFiles, setPhotoGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Fetch property on mount
  useEffect(() => {
    dispatch(fetchPropertyById(propertyId));
  }, [dispatch, propertyId]);

  // Load property data into form and images
  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description);
      setPrice(property.price);
      setArea(property.area);
      setRooms(property.rooms);
      setBathrooms(property.bathrooms);
      setOwnerName(property.owner_name);
      setOwnerPhone(property.owner_phone);
      setOwnerEmail(property.owner_email || '');

      setImageFile(null);
      setPhotoGalleryFiles([]);

      setExistingImageUrl(
        property.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}` : null
      );

  setExistingGalleryUrls(
  property.photo_gallery.map((photo) => photo.photo_url) || []
);


      setGalleryPreviews([]);
    }
  }, [property]);

  // Update preview for main image file
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Update gallery previews for new files
  useEffect(() => {
    if (photoGalleryFiles.length > 0) {
      const urls = photoGalleryFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setGalleryPreviews([]);
    }
  }, [photoGalleryFiles]);

  // Handle adding new gallery files
  const handlePhotoGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files) {
  const filesArray = Array.prototype.slice.call(e.target.files);
  setPhotoGalleryFiles(prev => [...prev, ...filesArray]);
}

  };

  // Remove existing gallery image by index
  const handleRemoveExistingGalleryImage = (index: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new gallery file by index
  const handleRemoveNewGalleryFile = (index: number) => {
    setPhotoGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };



  // Submit updated form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Append new main image if selected
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (existingImageUrl === null) {
      formData.append('image_deleted', 'true');
    }
     
     console.log('existingimage', existingGalleryUrls);    // Send existing gallery URLs that remain
    existingGalleryUrls.forEach((url) => {
      formData.append('existingGalleryUrls[]', url);
    });

    // Append new gallery image files
    photoGalleryFiles.forEach((file) => {
      formData.append('photoGallery[]', file);
    });

    try {
      await dispatch(updateProperty({ id: propertyId, formData })).unwrap();
      alert('Property updated successfully!');
      router.push('/admin/properties');
    } catch {
      alert('Failed to update property. Please try again.');
    }
  };

  const LabelWithIcon = ({
    htmlFor,
    icon,
    children,
  }: {
    htmlFor: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <label
      htmlFor={htmlFor}
      className="text-gray-700 font-medium mb-1 flex items-center gap-1 select-none"
    >
      {icon}
      <span>{children}</span>
    </label>
  );

  if (loading) return <p>Loading property data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!property) return <p>No property found.</p>;

  return (
<form
  onSubmit={handleSubmit}
  encType="multipart/form-data"
  className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md grid grid-cols-2 gap-4"
>
  <h2 className="col-span-2 text-2xl font-semibold text-gray-800 mb-4 text-center">
    Edit Property
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
      placeholder="Property description"
    />
  </div>

  <div className="flex space-x-6 col-span-2">
    {/* Area */}
    <div className="flex flex-col flex-1">
      <LabelWithIcon htmlFor="area" icon={<FiGrid className="text-purple-500" />}>
        Area (m²)
      </LabelWithIcon>
      <input
        id="area"
        type="number"
        value={area}
        onChange={(e) => setArea(parseInt(e.target.value) || 0)}
        min={0}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. 120"
      />
    </div>

    {/* Rooms */}
    <div className="flex flex-col flex-1">
      <LabelWithIcon htmlFor="rooms" icon={<FiHome className="text-indigo-500" />}>
        Rooms
      </LabelWithIcon>
      <input
        id="rooms"
        type="number"
        value={rooms}
        onChange={(e) => setRooms(parseInt(e.target.value) || 0)}
        min={0}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Number of rooms"
      />
    </div>

    {/* Bathrooms */}
    <div className="flex flex-col flex-1">
      <LabelWithIcon htmlFor="bathrooms" icon={<FiDroplet className="text-cyan-500" />}>
        Bathrooms
      </LabelWithIcon>
      <input
        id="bathrooms"
        type="number"
        value={bathrooms}
        onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
        min={0}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Number of bathrooms"
      />
    </div>
  </div>

  <div className="flex space-x-6 col-span-2">
    {/* Owner Name */}
    <div className="flex flex-col flex-1">
      <LabelWithIcon htmlFor="ownerName" icon={<FiUser className="text-pink-500" />}>
        Owner Name *
      </LabelWithIcon>
      <input
        id="ownerName"
        type="text"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        required
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Owner name"
      />
    </div>

    {/* Owner Phone */}
    <div className="flex flex-col flex-1">
      <LabelWithIcon htmlFor="ownerPhone" icon={<FiPhone className="text-green-600" />}>
        Owner Phone
      </LabelWithIcon>
      <input
        id="ownerPhone"
        type="tel"
        value={ownerPhone}
        onChange={(e) => setOwnerPhone(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Owner phone"
      />
    </div>

    {/* Owner Email */}
    <div className="flex flex-col flex-[2]">
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
        placeholder="Owner email"
      />
    </div>
  </div>

  {/* Main Image */}
  <div className="flex flex-col col-span-2">
    <LabelWithIcon htmlFor="mainImage" icon={<FiImage className="text-blue-700" />}>
      Main Image
    </LabelWithIcon>
    {existingImageUrl && !imageFile && (
      <div className="relative w-20 h-20 mb-2">
        <img
          src={existingImageUrl}
          alt="Existing Main"
          className="object-cover w-20 h-20 rounded-md border border-gray-300"
        />
      </div>
    )}
    {imagePreview && (
      <div className="relative w-20 h-20 mb-2">
        <img
          src={imagePreview}
          alt="New Main Preview"
          className="object-cover w-20 h-20 rounded-md border border-gray-300"
        />
      </div>
    )}
    {!existingImageUrl && !imageFile && (
      <p className="text-gray-500">No main image selected</p>
    )}
    <input
      type="file"
      id="mainImage"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.length) {
          setImageFile(e.target.files[0]);
          setExistingImageUrl(null);
        }
      }}
      className="mt-1"
    />
  </div>

  {/* Photo Gallery */}
  <div className="flex flex-col col-span-2">
    <LabelWithIcon htmlFor="photoGallery" icon={<FiCamera className="text-purple-700" />}>
      Photo Gallery
    </LabelWithIcon>

    {/* Existing gallery images */}
    <div className="flex flex-wrap gap-3 mb-2">
      {existingGalleryUrls.length === 0 && galleryPreviews.length === 0 && (
        <p className="text-gray-500">No gallery images selected</p>
      )}
      {existingGalleryUrls.map((filename, index) => (
        <div key={`existing-${index}`} className="relative w-20 h-20">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${filename}`}
            alt={`Gallery ${index}`}
            className="object-cover w-20 h-20 rounded-md"
          />
          <button
            type="button"
            onClick={() => handleRemoveExistingGalleryImage(index)}
            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
            title="Remove image"
          >
            <FiXCircle size={18} />
          </button>
        </div>
      ))}

      {/* New gallery image previews */}
      {galleryPreviews.map((url, i) => (
        <div key={`new-${i}`} className="relative w-20 h-20">
          <img
            src={url}
            alt={`New Gallery ${i}`}
            className="object-cover w-20 h-20 rounded-md"
          />
          <button
            type="button"
            onClick={() => handleRemoveNewGalleryFile(i)}
            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
            title="Remove"
          >
            <FiXCircle size={18} />
          </button>
        </div>
      ))}
    </div>

    <input
      type="file"
      id="photoGallery"
      multiple
      accept="image/*"
      onChange={handlePhotoGalleryChange}
      className="mt-1"
    />
  </div>

  <div className="col-span-2 flex justify-center mt-4">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
    >
      Update Property
    </button>
  </div>
</form>

  );
};

export default EditProperty;
