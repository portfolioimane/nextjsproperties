import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
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