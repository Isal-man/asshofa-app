import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaLengkap: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  alamat: "",
  idWali: "",
  gambar: "",
};

const santriSlice = createSlice({
  name: "santri",
  initialState,
  reducers: {
    setNamaLengkap: (state, action) => {
      state.namaLengkap = action.payload;
    },
    setTempatLahir: (state, action) => {
      state.tempatLahir = action.payload;
    },
    setTanggalLahir: (state, action) => {
      state.tanggalLahir = action.payload;
    },
    setJenisKelamin: (state, action) => {
      state.jenisKelamin = action.payload;
    },
    setAlamat: (state, action) => {
      state.alamat = action.payload;
    },
    setIdWali: (state, action) => {
      state.idWali = action.payload;
    },
    setGambarSantri: (state, action) => {
      state.gambar = action.payload;
    },
    resetSantriState: (state) => {
      state.namaLengkap = "";
      state.tempatLahir = "";
      state.tanggalLahir = "";
      state.jenisKelamin = "";
      state.alamat = "";
      state.idWali = "";
      state.gambar = "";
    },
  },
});

export const {
  setNamaLengkap,
  setTempatLahir,
  setTanggalLahir,
  setJenisKelamin,
  setAlamat,
  setIdWali,
  setGambarSantri,
  resetSantriState,
} = santriSlice.actions;

export default santriSlice.reducer;
