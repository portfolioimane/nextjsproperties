import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Photo {
  id: number;
  photo_url: string;
}

export interface Owner {
  name: string;
  email: string;
  phone: string;
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
  featured: boolean;
  photo_gallery: Photo[];
  owner: Owner; // ✅ Add this
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
