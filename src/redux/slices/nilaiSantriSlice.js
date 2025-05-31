import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nilai: "",
  keterangan: "",
  tanggalPenilaian: "",
  idSantri: "",
  idJadwal: "",
};

const nilaiSantriSlice = createSlice({
  name: "nilaiSantri",
  initialState,
  reducers: {
    setNilai: (state, action) => {
      state.nilai = action.payload;
    },
    setKeterangan: (state, action) => {
      state.keterangan = action.payload;
    },
    setTanggalPenilaian: (state, action) => {
      state.tanggalPenilaian = action.payload;
    },
    setIdSantri: (state, action) => {
      state.idSantri = action.payload;
    },
    setIdJadwal: (state, action) => {
      state.idJadwal = action.payload;
    },
    resetNilaiSantriState: (state) => {
      state.nilai = "";
      state.keterangan = "";
      state.tanggalPenilaian = "";
      state.idSantri = "";
      state.idJadwal = "";
    },
  },
});

export const {
  setNilai,
  setKeterangan,
  setTanggalPenilaian,
  setIdSantri,
  setIdJadwal,
  resetNilaiSantriState,
} = nilaiSantriSlice.actions;

export default nilaiSantriSlice.reducer;
