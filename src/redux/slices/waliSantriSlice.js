import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaLengkap: "",
  noTelepon: "",
  gambar: "",
  hubunganDenganSantri: "",
  alamat: "",
};

const waliSantriSlice = createSlice({
  name: "waliSantri",
  initialState,
  reducers: {
    setNamaLengkap: (state, action) => {
      state.namaLengkap = action.payload;
    },
    setNoTelepon: (state, action) => {
      state.noTelepon = action.payload;
    },
    setGambarWali: (state, action) => {
      state.gambar = action.payload;
    },
    setHubunganDenganSantri: (state, action) => {
      state.hubunganDenganSantri = action.payload;
    },
    setAlamat: (state, action) => {
      state.alamat = action.payload;
    },
    resetWaliSantriState: (state) => {
      state.namaLengkap = "";
      state.noTelepon = "";
      state.gambar = "";
      state.hubunganDenganSantri = "";
      state.alamat = "";
    },
  },
});

export const {
  setNamaLengkap,
  setNoTelepon,
  setGambarWali,
  setHubunganDenganSantri,
  setAlamat,
  resetWaliSantriState,
} = waliSantriSlice.actions;

export default waliSantriSlice.reducer;
