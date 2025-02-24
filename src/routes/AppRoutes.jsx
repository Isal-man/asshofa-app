import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard, JadwalPengajaran, Login, Pengajar, Register, Santri, WaliSantri } from '../pages'
import { PrivateRoute, ProtectedRoute } from '../routes'

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* public route */}
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                {/* private route */}
                <Route path='/santri' element={<PrivateRoute element={<Santri />} />} />
                <Route path='/' element={<PrivateRoute element={<Dashboard />}/>} />
                <Route path='/jadwal-pengajaran' element={<PrivateRoute element={<JadwalPengajaran />} />} />

                {/* protected route */}
                <Route path='/wali-santri' element={<ProtectedRoute element={<WaliSantri />} allowedRoles={"ADMIN, PENGAJAR, WALI SANTRI"}/>} />
                <Route path='/pengajar' element={<ProtectedRoute element={<Pengajar />} allowedRoles={"ADMIN, PENGAJAR"}/>} />
            </Routes>
        </Router>
    )
}