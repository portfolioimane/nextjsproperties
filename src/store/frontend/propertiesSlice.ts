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
  owner: Owner;
  address: string;
  city: string;         // Added city
  type: string;         // Added type (e.g. apartment, villa)
  offer_type: string;   // Added offer_type (e.g. rent, sale)
}

interface PropertiesState {
  list: Property[];
  loading: boolean;
  details: Property | null;
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
