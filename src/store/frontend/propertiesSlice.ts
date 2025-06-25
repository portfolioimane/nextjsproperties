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
  city: string;
  type: string;
  offer_type: string;
}

interface PropertiesState {
  list: Property[];
  popular: Property[];         // ✅ added
  loading: boolean;
  details: Property | null;
}

const initialState: PropertiesState = {
  list: [],
  popular: [],                 // ✅ initialized
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
    setPopularProperties(state, action: PayloadAction<Property[]>) { // ✅ new reducer
      state.popular = action.payload;
    },
    setPropertyDetails(state, action: PayloadAction<Property>) {
      state.details = action.payload;
    },
  },
});

export const {
  setProperties,
  setPopularProperties,  // ✅ export this
  setPropertyDetails,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
