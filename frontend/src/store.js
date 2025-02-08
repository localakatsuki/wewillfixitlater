import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './Components/OnGoingCampaigns/campaignSlice';

export const store = configureStore({
  reducer: {
    campaigns: campaignReducer,
  },
});
