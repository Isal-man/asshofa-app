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
  };
  