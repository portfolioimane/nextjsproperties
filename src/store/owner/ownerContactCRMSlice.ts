import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import type { Property } from '@/store/owner/ownerPropertiesSlice'; // adjust the path to your actual Property interface file

export interface ContactCRM {
  id: number;
  property_id?: number | null;
  property?: Property | null; // ← Add this line to include full property details

  client_name: string;
  email: string;
  phone_whatsapp?: string;
  message?: string;
  project_type?: string;
  lead_source?: string;
  stage: 'lead' | 'nurture' | 'conversion' | 'closed' | 'follow_up';
  last_contact?: string;
  next_step?: string;
  notes?: string;
  competitor?: string;
  assigned_to?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactCRM {
  id: number;
  property_id?: number | null;
    property?: Property | null; // ← Add this line to include full property details
  client_name: string;
  email: string;
  phone_whatsapp?: string;
  message?: string;
  project_type?: string;
  lead_source?: string;
  stage: 'lead' | 'nurture' | 'conversion' | 'closed' | 'follow_up';
  last_contact?: string;
  next_step?: string;
  notes?: string;
  competitor?: string;
  assigned_to?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Type for creating a new contact (exclude backend generated fields)
export type NewContact = Omit<ContactCRM, 'id' | 'created_at' | 'updated_at'>;

interface OwnerContactCRMState {
  contacts: ContactCRM[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OwnerContactCRMState = {
  contacts: [],
  status: 'idle',
  error: null,
};

// Async thunks

export const fetchOwnerContacts = createAsyncThunk<ContactCRM[], void, { rejectValue: string }>(
  'ownerContactCRM/fetchOwnerContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/owner/owner_crm_contact');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const addOwnerContact = createAsyncThunk<ContactCRM, NewContact, { rejectValue: string }>(
  'ownerContactCRM/addOwnerContact',
  async (contact, { rejectWithValue }) => {
    try {
      const response = await axios.post('/owner/owner_crm_contact', contact);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add contact');
    }
  }
);

export const updateOwnerContact = createAsyncThunk<ContactCRM, { id: number; contact: Partial<ContactCRM> }, { rejectValue: string }>(
  'ownerContactCRM/updateOwnerContact',
  async ({ id, contact }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/owner/owner_crm_contact/${id}`, contact);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update contact');
    }
  }
);

export const deleteOwnerContact = createAsyncThunk<number, number, { rejectValue: string }>(
  'ownerContactCRM/deleteOwnerContact',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/owner/owner_crm_contact/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete contact');
    }
  }
);

// Slice

const ownerContactCRMSlice = createSlice({
  name: 'ownerContactCRM',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearContacts(state) {
      state.contacts = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOwnerContacts
      .addCase(fetchOwnerContacts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOwnerContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload;
      })
      .addCase(fetchOwnerContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // addOwnerContact
      .addCase(addOwnerContact.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addOwnerContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts.push(action.payload);
      })
      .addCase(addOwnerContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // updateOwnerContact
      .addCase(updateOwnerContact.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOwnerContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateOwnerContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // deleteOwnerContact
      .addCase(deleteOwnerContact.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteOwnerContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteOwnerContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { clearError, clearContacts } = ownerContactCRMSlice.actions;

export default ownerContactCRMSlice.reducer;
