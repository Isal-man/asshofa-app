import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { Sidebar } from "../components";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

export const DetailWaliSantri = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [waliSantri, setWaliSantri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  useEffect(() => {
    fetchWaliSantri();
  }, [id]);

  const fetchWaliSantri = async () => {
    try {
      const res = await apiService.get(`/wali-santri/${id}`);
      setWaliSantri(res.data.data);
    } catch (err) {
      setError("Gagal memuat data wali santri");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (santriId) => {
    setDeleteId(santriId);
    setOpenConfirm(true);
  };

  const handleDeleteSantri = async () => {
    try {
      await apiService.delete(`/santri/${deleteId}`);
      setWaliSantri((prev) => ({
        ...prev,
        santriList: prev.santriList.filter((s) => s.id !== deleteId),
      }));
      setMessage("Santri berhasil dihapus");
      setSuccess(true);
    } catch (err) {
      setMessage("Gagal menghapus santri");
      setErrorSnackbar(true);
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !waliSantri) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex text-white">
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">Detail Wali Santri</h1>

          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300"
            >
              ← Kembali
            </button>
          </div>

          <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-5xl">
            <div className="flex flex-col items-center mb-8">
              <img
                src={waliSantri.gambar}
                alt={waliSantri.namaLengkap}
                className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
              <h2 className="mt-4 text-3xl font-bold text-blue-700">
                {waliSantri.namaLengkap}
              </h2>
            </div>

            <div className="space-y-4 text-base">
              <div className="flex">
                <span className="w-52 font-medium text-gray-500">
                  No. Telepon
                </span>
                <span className="font-semibold text-gray-800">
                  : {waliSantri.noTelepon}
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-52 font-medium text-gray-500">Alamat</span>
                <span className="font-semibold text-gray-800">
                  : {waliSantri.alamat}
                </span>
              </div>
              <div className="flex">
                <span className="w-52 font-medium text-gray-500">Hubungan</span>
                <span className="font-semibold text-gray-800">
                  : {waliSantri.hubunganDenganSantri}
                </span>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              Daftar Santri
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200">
                      Foto
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200">
                      Nama
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {waliSantri.santriList.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                            alt="Not Found"
                            className="w-24 h-24 mb-4 opacity-70"
                          />
                          <p className="text-lg font-semibold">
                            Data santri tidak ditemukan
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Belum ada santri terdaftar.
                            <span
                              onClick={() => navigate("/santri/create")}
                              className="text-blue-600 hover:underline font-medium cursor-pointer ml-1"
                            >
                              Tambahkan santri sekarang
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    waliSantri.santriList.map((santri) => (
                      <tr key={santri.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 border-b border-gray-200">
                          <img
                            src={santri.gambar}
                            alt={santri.namaLengkap}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {santri.namaLengkap}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/santri/detail/${santri.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/santri/edit/${santri.id}`)
                            }
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(santri.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Konfirmasi */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          Apakah kamu yakin ingin menghapus santri ini?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Batal
          </Button>
          <Button onClick={handleDeleteSantri} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={success || errorSnackbar}
        autoHideDuration={4000}
        onClose={() => {
          setSuccess(false);
          setErrorSnackbar(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            setErrorSnackbar(false);
          }}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
