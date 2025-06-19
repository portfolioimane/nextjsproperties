'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchPropertyById, updateProperty } from '@/store/admin/propertiesSlice';
import { useRouter } from 'next/navigation';

import {
  FiEdit, FiDollarSign, FiFileText, FiGrid, FiHome, FiDroplet,
  FiImage, FiCamera, FiXCircle
} from 'react-icons/fi';

interface EditPropertyProps {
  propertyId: number;
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { current: property, loading, error } = useSelector((state: RootState) => state.propertiesadmin);

  // States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [offerType, setOfferType] = useState('');
  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [photoGalleryFiles, setPhotoGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [errorGallery, setErrorGallery] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPropertyById(propertyId));
    setHasFetched(true);
  }, [dispatch, propertyId]);

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description);
      setPrice(property.price);
      setAddress(property.address);
      setCity(property.city || '');
      setType(property.type || '');
      setOfferType(property.offer_type || '');
      setArea(property.area);
      setRooms(property.rooms);
      setBathrooms(property.bathrooms);

      setImageFile(null);
      setPhotoGalleryFiles([]);
      setExistingImageUrl(property.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${property.image}` : null);
      setExistingGalleryUrls(property.photo_gallery.map((p) => p.photo_url) || []);
      setGalleryPreviews([]);
    }
  }, [property]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    if (photoGalleryFiles.length > 0) {
      const urls = photoGalleryFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setGalleryPreviews([]);
    }
  }, [photoGalleryFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('type', type);
    formData.append('offer_type', offerType);
    formData.append('area', area.toString());
    formData.append('rooms', rooms.toString());
    formData.append('bathrooms', bathrooms.toString());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (existingImageUrl === null) {
      formData.append('image_deleted', 'true');
    }

    existingGalleryUrls.forEach((url) => {
      formData.append('existingGalleryUrls[]', url);
    });

    photoGalleryFiles.forEach((file) => {
      formData.append('photoGallery[]', file);
    });

    try {
      await dispatch(updateProperty({ id: propertyId, formData })).unwrap();
      router.push('/admin/properties');
    } catch {
      setSubmitError('Failed to update property. Please try again.');
    }
  };

  const LabelWithIcon = ({
    htmlFor,
    icon,
    children,
  }: { htmlFor: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="text-gray-700 font-medium mb-1 flex items-center gap-1 select-none">
      {icon}
      <span>{children}</span>
    </label>
  );

  return (
    <>
      {submitError && <p className="text-red-600 font-bold mb-4">{submitError}</p>}

      {hasFetched ? (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 text-2xl font-semibold text-gray-800 mb-4 text-center">Edit Property</h2>

          {/* Title */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="title" icon={<FiEdit className="text-blue-500" />}>Title *</LabelWithIcon>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="price" icon={<FiDollarSign className="text-green-500" />}>Price *</LabelWithIcon>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          {/* Address */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="address" icon={<FiHome className="text-indigo-500" />}>Address *</LabelWithIcon>
            <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Property address" />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="city" icon={<FiHome className="text-pink-500" />}>City *</LabelWithIcon>
            <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter city" />
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="type" icon={<FiGrid className="text-purple-500" />}>Type *</LabelWithIcon>
            <input id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. apartment, villa, house" />
          </div>

          {/* Offer Type */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="offerType" icon={<FiGrid className="text-yellow-600" />}>Offer Type *</LabelWithIcon>
            <input id="offerType" type="text" value={offerType} onChange={(e) => setOfferType(e.target.value)} required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. rent, sale" />
          </div>

          {/* Area */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="area" icon={<FiGrid className="text-yellow-500" />}>Area (m²) *</LabelWithIcon>
            <input id="area" type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min="0" required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          {/* Rooms */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="rooms" icon={<FiHome className="text-red-500" />}>Rooms *</LabelWithIcon>
            <input id="rooms" type="number" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} min="0" required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="bathrooms" icon={<FiDroplet className="text-teal-500" />}>Bathrooms *</LabelWithIcon>
            <input id="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} min="0" required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>

          {/* Description */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="description" icon={<FiFileText className="text-purple-500" />}>Description *</LabelWithIcon>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
              className="px-3 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>

          {/* Main Image */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="image" icon={<FiImage className="text-orange-500" />}>Main Image *</LabelWithIcon>
            {existingImageUrl || imagePreview ? (
              <div className="relative mb-2 w-60 h-40 rounded overflow-hidden border border-gray-300">
                <img src={imagePreview || existingImageUrl || ''} alt="Main" className="object-cover w-full h-full" />
                <button type="button" onClick={() => { setImageFile(null); setExistingImageUrl(null); }}
                  className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-red-200" aria-label="Remove main image">
                  <FiXCircle />
                </button>
              </div>
            ) : null}
            <input id="image" type="file" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 2 * 1024 * 1024) {
                  setErrorImage(`Main image must be less than 2 MB. "${file.name}" is too large.`);
                  e.target.value = '';
                  return;
                }
                setErrorImage(null);
                setImageFile(file || null);
                setExistingImageUrl(null);
              }}
              className="border border-gray-300 rounded-md p-1" />
            {errorImage && <p className="text-red-600 mt-1">{errorImage}</p>}
          </div>

          {/* Gallery */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="photoGallery" icon={<FiCamera className="text-blue-700" />}>Photo Gallery</LabelWithIcon>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingGalleryUrls.map((url, i) => (
                <div key={`existing-${i}`} className="relative w-32 h-20 border rounded overflow-hidden">
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${url}`} alt={`Gallery ${i + 1}`} className="object-cover w-full h-full" />
                  <button onClick={() => setExistingGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                    type="button" className="absolute top-0 right-0 text-red-600 bg-white rounded-full p-1 hover:bg-red-200">
                    <FiXCircle />
                  </button>
                </div>
              ))}
              {galleryPreviews.map((url, i) => (
                <div key={`preview-${i}`} className="relative w-32 h-20 border rounded overflow-hidden">
                  <img src={url} alt={`New ${i + 1}`} className="object-cover w-full h-full" />
                  <button onClick={() => setPhotoGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    type="button" className="absolute top-0 right-0 text-red-600 bg-white rounded-full p-1 hover:bg-red-200">
                    <FiXCircle />
                  </button>
                </div>
              ))}
            </div>
            <input id="photoGallery" type="file" accept="image/*" multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const oversized = files.find(f => f.size > 2 * 1024 * 1024);
                if (oversized) {
                  setErrorGallery(`Each image must be under 2MB. "${oversized.name}" is too large.`);
                  return;
                }
                setErrorGallery(null);
                setPhotoGalleryFiles((prev) => [...prev, ...files]);
              }}
              className="border border-gray-300 rounded-md p-1" />
            {errorGallery && <p className="text-red-600 mt-1">{errorGallery}</p>}
          </div>

          {/* Submit */}
          <div className="col-span-2 text-center">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center p-8">Loading property data...</p>
      )}
    </>
  );
};

export default EditProperty;
