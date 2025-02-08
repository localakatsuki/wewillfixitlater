import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define an async thunk to fetch campaigns
export const fetchCampaigns = createAsyncThunk('campaigns/fetchCampaigns', async () => {
  const response = await fetch('http://localhost:5000/api/campaigns');
  const data = await response.json();
  return data;
});

// Define the initial state
const initialState = {
  campaigns: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Create the slice
const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the reducer for the store
export default campaignSlice.reducer;
