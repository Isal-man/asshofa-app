import { 
  resetAuthState, 
  setUsername, 
  setPassword, 
  setGambarUser, 
  setRole 
} from './authSlice';

import { 
  resetSantriState, 
  setAlamat, 
  setGambarSantri, 
  setIdWali, 
  setJenisKelamin, 
  setNamaLengkap, 
  setTanggalLahir, 
  setTempatLahir 
} from './santriSlice';

import { 
  resetWaliSantriState, 
  setNamaLengkap as setNamaLengkapWali, 
  setNoTelepon, 
  setGambarWali, 
  setHubunganDenganSantri, 
  setAlamat as setAlamatWali 
} from './waliSantriSlice';

import {
  resetPengajarState,
  setAlamat as setAlamatPengajar,
  setGambarPengajar,
  setNamaLengkap as setNamaLengkapPengajar,
  setNoTelepon as setNoTeleponPengajar,
  setSpesialisasi
} from './pengajarSlice';

// ✅ Tambahan baru untuk Jadwal Pengajaran
import {
  resetJadwalPengajaran,
  setHari,
  setMataPelajaran,
  setJamMulai,
  setJamSelesai,
  setIdPengajar
} from './jadwalPengajaranSlice';

import {
  resetNilaiSantriState,
  setNilai,
  setKeterangan,
  setTanggalPenilaian,
  setIdSantri,
  setIdJadwal,
} from './nilaiSantriSlice';

export {
  // Auth
  resetAuthState, 
  setUsername, 
  setPassword, 
  setGambarUser, 
  setRole,

  // Santri
  resetSantriState, 
  setAlamat, 
  setGambarSantri, 
  setIdWali, 
  setJenisKelamin, 
  setNamaLengkap, 
  setTanggalLahir, 
  setTempatLahir,

  // Wali Santri
  resetWaliSantriState,
  setNamaLengkapWali,
  setNoTelepon,
  setGambarWali,
  setHubunganDenganSantri,
  setAlamatWali,

  // Pengajar
  resetPengajarState,
  setGambarPengajar,
  setNamaLengkapPengajar,
  setSpesialisasi,
  setAlamatPengajar,
  setNoTeleponPengajar,

  // ✅ Jadwal Pengajaran
  resetJadwalPengajaran,
  setHari,
  setMataPelajaran,
  setJamMulai,
  setJamSelesai,
  setIdPengajar,

  // Nilai Santri
  resetNilaiSantriState,
  setNilai,
  setKeterangan,
  setTanggalPenilaian,
  setIdSantri,
  setIdJadwal,
};
