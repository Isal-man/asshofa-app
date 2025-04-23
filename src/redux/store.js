import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import santriReducer from './slices/santriSlice'
import waliSantriReducer from './slices/waliSantriSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        santri: santriReducer,
        waliSantri: waliSantriReducer
    },
});

export default store;