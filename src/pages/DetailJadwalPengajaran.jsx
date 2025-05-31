import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { Sidebar } from "../components";
import {
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Add } from "@mui/icons-material";

export const DetailJadwalPengajaran = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jadwalPengajaran, setJadwalPengajaran] = useState(null);
  const [santri, setSantri] = useState(null);
  const [santriOptions, setSantriOptions] = useState([]);
  const [debounceSantri, setDebounceSantri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRows, setEditingRows] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchJadwalPengajaran();
  }, [id]);

  useEffect(() => {
    if (debounceSantri?.trim() !== "") {
      fetchSantri();
    }
  }, [debounceSantri]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSantri(santri);
    }, 500);
    return () => clearTimeout(handler);
  }, [santri]);

  const fetchJadwalPengajaran = async () => {
    try {
      const res = await apiService.get(`/jadwal-pengajaran/${id}`);
      setJadwalPengajaran(res.data.data);
    } catch (err) {
      console.log("error when get data jadwal pengajaran", err);
      setError("Gagal memuat data jadwal pengajaran");
    } finally {
      setLoading(false);
    }
  };

  const fetchSantri = async () => {
    try {
      const response = await apiService.post(`/santri/data`, {
        nama: santri,
        idJadwalPengajaran: santri ? null : id,
        page: 1,
        limit: 10,
      });

      const dataBaru = response.data.data.list;

      setSantriOptions((prev) => {
        const semuaData = [...dataBaru, ...prev];
        const unik = new Map();
        semuaData.forEach((item) => {
          if (!unik.has(item.id)) {
            unik.set(item.id, item);
          }
        });
        return Array.from(unik.values());
      });
    } catch (error) {
      console.log("error when get data santri", error);
      setError("Gagal mendapatkan data santri");
    }
  };

  const handleFieldChange = (id, e) => {
    const { name, value } = e.target;

    if (name === "namaSantri") {
      const parsed = value ? JSON.parse(value) : { id: "", nama: "" };

      setEditedData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          namaSantri: parsed.nama,
          idSantri: parsed.id,
        },
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [name]: value,
        },
      }));
    }
  };

  const handleDateChange = (id, date) => {
    console.log("date", date);
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        tanggalPenilaian: date && dayjs(date).format("YYYY-MM-DD"),
      },
    }));
  };

  const handleEditRow = (rowId) => {
    const nilai = jadwalPengajaran.nilaiSantriList.find((n) => n.id === rowId);
    setIsEditing(rowId);
    setEditingRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        namaSantri: nilai.namaSantri,
        nilai: nilai.nilai,
        tanggalPenilaian: nilai.tanggalPenilaian,
        keterangan: handleKeterangan(nilai.nilai),
        idSantri: nilai.idSantri,
        idJadwal: id,
      },
    }));
  };

  const handleCancelEdit = (rowId) => {
    setEditingRows((prev) => {
      const newEditing = { ...prev };
      delete newEditing[rowId];
      return newEditing;
    });
    setEditedData((prev) => {
      const newEdited = { ...prev };
      delete newEdited[rowId];
      return newEdited;
    });
    setIsAdding(false);
  };

  const handleSaveRow = async (rowId) => {
    try {
      const payload = rowId !== 0
        ? {
            ...editedData[rowId],
          }
        : { ...editedData[0], idJadwal: id, keterangan: handleKeterangan(editedData[0]?.nilai) };
      rowId !== 0
        ? await apiService.put(`/nilai-santri/${rowId}`, payload)
        : await apiService.post("/nilai-santri", payload);
      setSnackbar({
        open: true,
        message: `Data berhasil ${rowId !== 0 ? "diperbarui" : "disimpan"} `,
        severity: "success",
      });
      await fetchJadwalPengajaran();
      setEditingRows((prev) => ({ ...prev, [rowId]: false }));
      setIsAdding(false)
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal menyimpan data",
        severity: "error",
      });
    }
  };

  const handleKeterangan = (nilai) => {
    if (nilai <= 50) return "Sangat Kurang";
    if (nilai <= 70) return "Kurang";
    if (nilai <= 80) return "Cukup";
    if (nilai <= 90) return "Baik";
    return "Sangat Baik";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !jadwalPengajaran) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex text-white">
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">Detail Jadwal Pengajaran</h1>

          <div className="mb-6 flex justify-between items-center">
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
                src={jadwalPengajaran.gambarPengajar}
                alt={jadwalPengajaran.namaPengajar}
                className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
              <h2 className="mt-4 text-3xl font-bold text-blue-700">
                {jadwalPengajaran.namaPengajar}
              </h2>
            </div>

            <div className="space-y-4 text-base">
              <div className="flex">
                <span className="w-52 font-medium text-gray-500">
                  Mata Pelajaran
                </span>
                <span className="font-semibold text-gray-800">
                  &nbsp;{jadwalPengajaran.mataPelajaran}
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-52 font-medium text-gray-500">Hari</span>
                <span className="font-semibold text-gray-800">
                  &nbsp;{jadwalPengajaran.hari}
                </span>
              </div>
              <div className="flex">
                <span className="w-52 font-medium text-gray-500">
                  Jam mulai
                </span>
                <span className="font-semibold text-gray-800">
                  &nbsp;
                  {dayjs(jadwalPengajaran.jamMulai, "HH:mm:ss").format("HH:mm")}
                </span>
              </div>
              <div className="flex">
                <span className="w-52 font-medium text-gray-500">
                  Jam selesai
                </span>
                <span className="font-semibold text-gray-800">
                  &nbsp;
                  {dayjs(jadwalPengajaran.jamSelesai, "HH:mm:ss").format(
                    "HH:mm"
                  )}
                </span>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            <div className="flex justify-between">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                Daftar Nilai Santri
              </h3>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => setIsAdding(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
                }}
              >
                Tambah Nilai Santri
              </Button>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-6 py-3 border-b-2">Nama Santri</th>
                      <th className="px-6 py-3 border-b-2">
                        Tanggal Penilaian
                      </th>
                      <th className="px-6 py-3 border-b-2">Nilai</th>
                      <th className="px-6 py-3 border-b-2">Keterangan</th>
                      <th className="px-6 py-3 border-b-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAdding && (
                      <tr>
                          <td className="px-6 py-4 border-b">
                            <TextField
                              name="santriSearch"
                              value={santri}
                              onChange={(e) => setSantri(e.target.value)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              placeholder="Cari Santri"
                              style={{ marginBottom: "8px" }}
                            />
                            <Select
                              name="namaSantri"
                              value={JSON.stringify({
                                id: editedData[0]?.idSantri || "",
                                nama: editedData[0]?.namaSantri || "",
                              })}
                              onChange={(e) => handleFieldChange(0, e)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              displayEmpty
                            >
                              <MenuItem value="">Pilih Santri</MenuItem>
                              {santriOptions?.map((data) => (
                                <MenuItem
                                  key={data.id}
                                  value={JSON.stringify({
                                    id: data.id,
                                    nama: data.namaLengkap,
                                  })}
                                >
                                  {data.namaLengkap}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <DatePicker
                              value={
                                editedData[0]?.tanggalPenilaian
                                  ? dayjs(editedData[0]?.tanggalPenilaian)
                                  : null
                              }
                              onChange={(e) => handleDateChange(0, e)}
                              format="YYYY-MM-DD"
                              slotProps={{
                                textField: { size: "small", fullWidth: true },
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 border-b">
                            <TextField
                              name="nilai"
                              value={editedData[0]?.nilai}
                              onChange={(e) => handleFieldChange(0, e)}
                              size="small"
                              fullWidth
                              type="number"
                            />
                          </td>
                          <td className="px-6 py-4 border-b">-</td>
                          <td className="flex flex-col gap-2 px-6 py-4 border-b">
                            <button
                              onClick={() => handleSaveRow(0)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full shadow-md transition duration-300"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setIsAdding(false)}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-full shadow-md transition duration-300"
                            >
                              Batal
                            </button>
                          </td>
                        </tr>
                    )}
                    {jadwalPengajaran.nilaiSantriList.map((nilai) => {
                      const editing = editingRows[nilai.id];
                      return (
                        <tr key={nilai.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 border-b">
                            <TextField
                              hidden={!editing}
                              name="santriSearch"
                              value={santri}
                              onChange={(e) => setSantri(e.target.value)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              placeholder="Cari Santri"
                              style={{ marginBottom: "8px" }}
                              InputProps={{ readOnly: !isEditing }}
                            />
                            <Select
                              name="namaSantri"
                              value={JSON.stringify({
                                id:
                                  editedData[nilai.id]?.idSantri ||
                                  nilai.idSantri,
                                nama:
                                  editedData[nilai.id]?.namaSantri ||
                                  nilai.namaSantri,
                              })}
                              onChange={(e) => handleFieldChange(nilai.id, e)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              displayEmpty
                            >
                              <MenuItem value="">Pilih Santri</MenuItem>
                              {santriOptions?.map((data) => (
                                <MenuItem
                                  key={data.id}
                                  value={JSON.stringify({
                                    id: data.id,
                                    nama: data.namaLengkap,
                                  })}
                                >
                                  {data.namaLengkap}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>
                          <td className="px-6 py-4 border-b">
                            {editing ? (
                              <DatePicker
                                value={
                                  editedData[nilai.id]?.tanggalPenilaian
                                    ? dayjs(
                                        editedData[nilai.id]?.tanggalPenilaian
                                      )
                                    : dayjs(nilai.tanggalPenilaian)
                                }
                                onChange={(e) => handleDateChange(nilai.id, e)}
                                format="YYYY-MM-DD"
                                slotProps={{
                                  textField: { size: "small", fullWidth: true },
                                }}
                              />
                            ) : (
                              dayjs(nilai.tanggalPenilaian).format("YYYY-MM-DD")
                            )}
                          </td>
                          <td className="px-6 py-4 border-b">
                            <TextField
                              name="nilai"
                              value={
                                editing
                                  ? editedData[nilai.id]?.nilai
                                  : nilai.nilai
                              }
                              onChange={(e) => handleFieldChange(nilai.id, e)}
                              size="small"
                              fullWidth
                              type="number"
                              InputProps={{ readOnly: !editing }}
                            />
                          </td>
                          <td className="px-6 py-4 border-b">
                            {nilai.keterangan}
                          </td>
                          <td className="flex flex-col gap-2 px-6 py-4 border-b">
                            {editing || isAdding ? (
                              <>
                                <button
                                  onClick={() => handleSaveRow(nilai.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full shadow-md transition duration-300"
                                >
                                  Simpan
                                </button>
                                <button
                                  onClick={() => handleCancelEdit(nilai.id)}
                                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-full shadow-md transition duration-300"
                                >
                                  Batal
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditRow(nilai.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full shadow-md transition duration-300"
                              >
                                Update
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
