'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchPropertyById, updateProperty } from '@/store/owner/ownerPropertiesSlice';
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

  const { current: property, loading, error } = useSelector((state: RootState) => state.propertiesowner);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
    const [address, setAddress] = useState('');

  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  // Main image: can be existing URL or new File
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Existing main image URL from backend
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Photo gallery: existing photos as URLs, new files, and previews
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [photoGalleryFiles, setPhotoGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [errorGallery, setErrorGallery] = useState<string | null>(null);

  const [hasFetched, setHasFetched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch property on mount
  useEffect(() => {
    dispatch(fetchPropertyById(propertyId));
    setHasFetched(true);
  }, [dispatch, propertyId]);

  // Load property data into form and images
  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description);
      setPrice(property.price);
     setAddress(property.address);

      setArea(property.area);
      setRooms(property.rooms);
      setBathrooms(property.bathrooms);

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
      const maxSizeInBytes = 2048 * 1024; // 2MB
      const filesArray = Array.prototype.slice.call(e.target.files) as File[];

      // Check if any file exceeds the size limit
      const invalidFile = filesArray.find(file => file.size > maxSizeInBytes);

      if (invalidFile) {
        setErrorGallery(`Each image must be less than 2 MB. "${invalidFile.name}" is too large.`);
        e.target.value = ""; // reset input
        return;
      }

      setErrorGallery(null); // clear previous errors

      // Append new files to existing ones
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

  // Remove main image file or existing image
  const handleRemoveMainImage = () => {
    setImageFile(null);
    setExistingImageUrl(null);
  };

  // Handle main image file selection
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSizeInBytes = 2048 * 1024; // 2MB

      if (file.size > maxSizeInBytes) {
        setErrorImage(`Main image must be less than 2 MB. "${file.name}" is too large.`);
        e.target.value = "";
        return;
      }

      setErrorImage(null);
      setImageFile(file);
      setExistingImageUrl(null); // clear existing image if new selected
    }
  };

  // Submit updated form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
        formData.append('address', address);

    formData.append('area', area.toString());
    formData.append('rooms', rooms.toString());
    formData.append('bathrooms', bathrooms.toString());

    // Append new main image if selected
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (existingImageUrl === null) {
      formData.append('image_deleted', 'true');
    }

    // Send existing gallery URLs that remain
    existingGalleryUrls.forEach((url) => {
      formData.append('existingGalleryUrls[]', url);
    });

    // Append new gallery image files
    photoGalleryFiles.forEach((file) => {
      formData.append('photoGallery[]', file);
    });

    try {
      await dispatch(updateProperty({ id: propertyId, formData })).unwrap();
      router.push('/owner/properties');
    } catch {
      setSubmitError('Failed to update property. Please try again.');
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

  return (
    <>
      {submitError && (
        <p style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>
          {submitError}
        </p>
      )}

      {hasFetched ? (
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
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="price" icon={<FiDollarSign className="text-green-500" />}>
              Price *
            </LabelWithIcon>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

                       {/* Address */}

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
            <LabelWithIcon htmlFor="description" icon={<FiFileText className="text-purple-500" />}>
              Description *
            </LabelWithIcon>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="px-3 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Area */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="area" icon={<FiGrid className="text-yellow-500" />}>
              Area (m²) *
            </LabelWithIcon>
            <input
              id="area"
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              min="0"
              required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Rooms */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="rooms" icon={<FiHome className="text-red-500" />}>
              Rooms *
            </LabelWithIcon>
            <input
              id="rooms"
              type="number"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              min="0"
              required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col">
            <LabelWithIcon htmlFor="bathrooms" icon={<FiDroplet className="text-teal-500" />}>
              Bathrooms *
            </LabelWithIcon>
            <input
              id="bathrooms"
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              min="0"
              required
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>


          {/* Main Image */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="image" icon={<FiImage className="text-orange-500" />}>
              Main Image *
            </LabelWithIcon>
            {existingImageUrl || imagePreview ? (
              <div className="relative mb-2 w-60 h-40 rounded overflow-hidden border border-gray-300">
                <img
                  src={imagePreview || existingImageUrl || ''}
                  alt="Main"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-red-200"
                  aria-label="Remove main image"
                >
                  <FiXCircle />
                </button>
              </div>
            ) : null}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="border border-gray-300 rounded-md p-1"
            />
            {errorImage && <p className="text-red-600 mt-1">{errorImage}</p>}
          </div>

          {/* Photo Gallery */}
          <div className="flex flex-col col-span-2">
            <LabelWithIcon htmlFor="photoGallery" icon={<FiCamera className="text-blue-700" />}>
              Photo Gallery
            </LabelWithIcon>

            <div className="flex flex-wrap gap-2 mb-2">
              {/* Existing gallery images */}
              {existingGalleryUrls.map((url, i) => (
                <div key={`existing-gallery-${i}`} className="relative w-32 h-20 rounded overflow-hidden border border-gray-300">
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${url}`} alt={`Gallery ${i + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingGalleryImage(i)}
                    className="absolute top-0 right-0 text-red-600 bg-white rounded-full p-1 hover:bg-red-200"
                    aria-label="Remove gallery image"
                  >
                    <FiXCircle />
                  </button>
                </div>
              ))}

              {/* New gallery file previews */}
              {galleryPreviews.map((url, i) => (
                <div key={`new-gallery-${i}`} className="relative w-32 h-20 rounded overflow-hidden border border-gray-300">
                  <img src={url} alt={`New Gallery ${i + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewGalleryFile(i)}
                    className="absolute top-0 right-0 text-red-600 bg-white rounded-full p-1 hover:bg-red-200"
                    aria-label="Remove new gallery image"
                  >
                    <FiXCircle />
                  </button>
                </div>
              ))}
            </div>

            <input
              id="photoGallery"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoGalleryChange}
              className="border border-gray-300 rounded-md p-1"
            />
            {errorGallery && <p className="text-red-600 mt-1">{errorGallery}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
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
