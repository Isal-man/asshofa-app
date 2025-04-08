import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import santriReducer from './slices/santriSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        santri: santriReducer
    },
});

export default store;