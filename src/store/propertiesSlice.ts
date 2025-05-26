import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Photo {
  id: number;
  photo_url: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  area: number;
  rooms: number;
  bathrooms: number;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  featured: boolean;
  photo_gallery: Photo[];
}

interface PropertiesState {
  list: Property[];
  loading: boolean;
  details: Property | null; // ✅ Add this for property details
}

const initialState: PropertiesState = {
  list: [],
  loading: false,
  details: null,
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties(state, action: PayloadAction<Property[]>) {
      state.list = action.payload;
    },
    setPropertyDetails(state, action: PayloadAction<Property>) {
      state.details = action.payload;
    },
  },
});

export const { setProperties, setPropertyDetails } = propertiesSlice.actions;
export default propertiesSlice.reducer;
