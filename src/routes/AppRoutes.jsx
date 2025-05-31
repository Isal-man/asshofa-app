import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Dashboard,
  JadwalPengajaran,
  Login,
  Pengajar,
  Register,
  Santri,
  WaliSantri,
  DetailSantri,
  EditSantri,
  CreateSantri,
  DetailWaliSantri,
  CreateWaliSantri,
  DetailPengajar,
  PengajarForm,
  DetailJadwalPengajaran,
  CreateJadwalPengajaran
} from '../pages'
import { PrivateRoute, ProtectedRoute } from '../routes'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* private route */}
        <Route path='/' element={<PrivateRoute element={<Dashboard />} />} />
        <Route path='/santri' element={<PrivateRoute element={<Santri />} />} />
        <Route path='/santri/create' element={<PrivateRoute element={<CreateSantri />} />} />
        <Route path='/santri/detail/:id' element={<PrivateRoute element={<DetailSantri />} />} />
        <Route path='/santri/edit/:id' element={<PrivateRoute element={<EditSantri />} />} />
        <Route path='/jadwal-pengajaran' element={<PrivateRoute element={<JadwalPengajaran />} />} />
        <Route path='/jadwal-pengajaran/create' element={<PrivateRoute element={<CreateJadwalPengajaran />} />} />
        <Route path='/jadwal-pengajaran/edit/:id' element={<PrivateRoute element={<CreateJadwalPengajaran />} />} />
        <Route path='/jadwal-pengajaran/detail/:id' element={<PrivateRoute element={<DetailJadwalPengajaran />} />} />

        {/* protected route */}
        <Route path='/wali-santri' element={
          <ProtectedRoute element={<WaliSantri />} allowedRoles={"ADMIN, PENGAJAR, WALI SANTRI"} />
        } />
        <Route path='/wali-santri/create' element={
          <ProtectedRoute element={<CreateWaliSantri />} allowedRoles={"ADMIN, PENGAJAR, WALI SANTRI"} />
        } />
        <Route path='/wali-santri/edit/:id' element={
          <ProtectedRoute element={<CreateWaliSantri />} allowedRoles={"ADMIN, PENGAJAR, WALI SANTRI"} />
        } />
        <Route path='/wali-santri/detail/:id' element={
          <ProtectedRoute element={<DetailWaliSantri />} allowedRoles={"ADMIN, PENGAJAR, WALI SANTRI"} />
        } />
        <Route path='/pengajar' element={
          <ProtectedRoute element={<Pengajar />} allowedRoles={"ADMIN, PENGAJAR"} />
        } />
        <Route path='/pengajar/detail/:id' element={
          <ProtectedRoute element={<DetailPengajar />} allowedRoles={"ADMIN, PENGAJAR"} />
        } />
        <Route path='/pengajar/edit/:id' element={
          <ProtectedRoute element={<PengajarForm />} allowedRoles={"ADMIN, PENGAJAR"} />
        } />
        <Route path='/pengajar/create' element={
          <ProtectedRoute element={<PengajarForm />} allowedRoles={"ADMIN, PENGAJAR"} />
        } />
      </Routes>
    </Router>
  )
}
