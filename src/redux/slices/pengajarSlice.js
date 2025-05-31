import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaLengkap: "",
  noTelepon: "",
  gambar: "",
  spesialisasi: "",
  alamat: "",
};

const pengajarSlice = createSlice({
  name: "pengajar",
  initialState,
  reducers: {
    setNamaLengkap: (state, action) => {
      state.namaLengkap = action.payload;
    },
    setNoTelepon: (state, action) => {
      state.noTelepon = action.payload;
    },
    setGambarPengajar: (state, action) => {
      state.gambar = action.payload;
    },
    setSpesialisasi: (state, action) => {
      state.spesialisasi = action.payload;
    },
    setAlamat: (state, action) => {
      state.alamat = action.payload;
    },
    resetPengajarState: (state) => {
      state.namaLengkap = "";
      state.noTelepon = "";
      state.gambar = "";
      state.spesialisasi = "";
      state.alamat = "";
    },
  },
});

export const {
  setNamaLengkap,
  setNoTelepon,
  setGambarPengajar,
  setSpesialisasi,
  setAlamat,
  resetPengajarState,
} = pengajarSlice.actions;

export default pengajarSlice.reducer;
