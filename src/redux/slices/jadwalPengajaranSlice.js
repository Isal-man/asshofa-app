import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hari: "",
  mataPelajaran: "",
  jamMulai: "",
  jamSelesai: "",
  idPengajar: "",
};

const jadwalPengajaranSlice = createSlice({
  name: "jadwalPengajaran",
  initialState,
  reducers: {
    setHari: (state, action) => {
      state.hari = action.payload;
    },
    setMataPelajaran: (state, action) => {
      state.mataPelajaran = action.payload;
    },
    setJamMulai: (state, action) => {
      state.jamMulai = action.payload;
    },
    setJamSelesai: (state, action) => {
      state.jamSelesai = action.payload;
    },
    setIdPengajar: (state, action) => {
      state.idPengajar = action.payload;
    },
    resetJadwalPengajaran: () => initialState,
  },
});

export const {
  setHari,
  setMataPelajaran,
  setJamMulai,
  setJamSelesai,
  setIdPengajar,
  resetJadwalPengajaran,
} = jadwalPengajaranSlice.actions;

export default jadwalPengajaranSlice.reducer;
