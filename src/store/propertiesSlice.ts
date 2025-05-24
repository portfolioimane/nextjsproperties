import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Photo {
  id: number;
  photo_url: string;
}

// Then update Property type:
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
  photo_gallery: Photo[]; // no "?" mark
}

interface PropertiesState {
  list: Property[];
  loading: boolean;
}

const initialState: PropertiesState = {
  list: [],
  loading: false,
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties(state, action: PayloadAction<Property[]>) {
      state.list = action.payload;
    },
  },
});

export const { setProperties } = propertiesSlice.actions;
export default propertiesSlice.reducer;