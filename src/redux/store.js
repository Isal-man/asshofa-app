import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import santriReducer from "./slices/santriSlice";
import waliSantriReducer from "./slices/waliSantriSlice";
import pengajarReducer from "./slices/pengajarSlice";
import nilaiSantriReducer from "./slices/nilaiSantriSlice"
import jadwalPengajaranReducer from "./slices/jadwalPengajaranSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    santri: santriReducer,
    waliSantri: waliSantriReducer,
    pengajar: pengajarReducer,
    nilaiSantri: nilaiSantriReducer,
    jadwalPengajaran: jadwalPengajaranReducer,
  },
});

export default store;
