import React, { useState, useEffect, forwardRef } from "react";
import { Sidebar } from "../components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  CircularProgress,
} from "@mui/material";
import { Visibility, Edit, Delete, Add } from "@mui/icons-material";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const JadwalPengajaran = () => {
  const [jadwalPengajaran, setJadwalPengajaran] = useState([]);
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(false);
  const [errorFetch, setErrorFetch] = useState(false);
  const [fetchData, setFetchData] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchJadwalPengajaran();
  }, [searchParams]);

  const fetchJadwalPengajaran = async () => {
    setLoading(true);
    try {
      const params = { ...searchParams, ...filters };
      const response = await apiService.post("/jadwal-pengajaran/data", params);
      setJadwalPengajaran(response.data.data.list);
      setTotalRows(response.data.data.total);
    } catch (error) {
      setMessage("Gagal mendapatkan data jadwal pengajaran");
      setErrorFetch(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
  };
  const handleSearchSubmit = () => {
    setSearchParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (_, newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleLimitChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  const handleDeleteJadwalPengajaran = async () => {
    try {
      await apiService.delete(`/jadwal-pengajaran/${deleteId}`);
      setJadwalPengajaran((prev) => prev.filter((s) => s.id !== deleteId));
      setOpenConfirm(false);
      setDeleteId(null);
      setMessage("Jadwal pengajaran berhasil dihapus!");
      setSuccess(true);
    } catch (error) {
      setMessage("Jadwal pengajaran gagal dihapus!");
      setError(true);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="p-6 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Jadwal Pengajaran</h1>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={() => navigate("/jadwal-pengajaran/create")}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
              }}
            >
              Tambah Jadwal Pengajaran
            </Button>
          </div>

          {/* Error Snackbar */}
          <Snackbar
            open={error}
            autoHideDuration={6000}
            onClose={() => setError(false)}
          >
            <Alert
              onClose={() => setError(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>

          {/* Snackbar Success */}
          <Snackbar
            open={success}
            autoHideDuration={4000}
            onClose={() => setSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSuccess(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>

          {/* Table */}
          <TableContainer component={Paper} className="shadow-lg rounded-lg">
            <Table>
              <TableHead className="bg-gray-200">
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Mata Pelajaran</TableCell>
                  <TableCell>Nama Pengajar</TableCell>
                  <TableCell>Hari</TableCell>
                  <TableCell>Jam Mulai</TableCell>
                  <TableCell>Jam Selesai</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <TextField
                      name="mataPelajaran"
                      value={filters.mataPelajaran || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="namaPengajar"
                      value={filters.namaPengajar || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      name="hari"
                      value={filters.hari || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="">Pilih Hari</MenuItem>
                      <MenuItem value="senin">Senin</MenuItem>
                      <MenuItem value="selasa">Selasa</MenuItem>
                      <MenuItem value="rabu">Rabu</MenuItem>
                      <MenuItem value="kamis">Kamis</MenuItem>
                      <MenuItem value="jumat">Jumat</MenuItem>
                      <MenuItem value="sabtu">Sabtu</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSearchSubmit}
                    >
                      Cari
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : jadwalPengajaran.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                          alt="Not Found"
                          className="w-24 h-24 mb-4 opacity-70"
                        />
                        <p className="text-lg font-semibold">
                          Data jadwal pengajaran tidak ditemukan
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Coba ubah filter pencarian kamu ya!
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  jadwalPengajaran.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      <TableCell>
                        {(searchParams.page - 1) * searchParams.limit +
                          index +
                          1}
                      </TableCell>
                      <TableCell>{row.mataPelajaran}</TableCell>
                      <TableCell>{row.namaPengajar}</TableCell>
                      <TableCell>{row.hari}</TableCell>
                      <TableCell>
                        {dayjs(row.jamMulai, "HH:mm:ss").format("HH:mm")}
                      </TableCell>
                      <TableCell>
                        {dayjs(row.jamSelesai, "HH:mm:ss").format("HH:mm")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/jadwal-pengajaran/detail/${row.id}`)
                          }
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() =>
                            navigate(`/jadwal-pengajaran/edit/${row.id}`)
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setDeleteId(row.id);
                            setOpenConfirm(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex justify-end mt-4">
            <TablePagination
              component="div"
              count={totalRows}
              page={searchParams.page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={searchParams.limit}
              onRowsPerPageChange={handleLimitChange}
              className="shadow-md rounded-lg bg-white p-2"
            />
          </div>

          <Dialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            aria-describedby="alert-dialog-slide-description"
            slots={{ transition: Transition }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 4,
                  padding: 2,
                  background: "#fefefe",
                  boxShadow: 10,
                },
              },
            }}
          >
            <DialogTitle
              sx={{ fontWeight: "bold", fontSize: "1.3rem", color: "#d32f2f" }}
            >
              Konfirmasi Hapus
            </DialogTitle>
            <DialogContent sx={{ fontSize: "1rem", color: "#333" }}>
              Yakin ingin menghapus jadwal pengajaran ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={() => setOpenConfirm(false)}
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Batal
              </Button>
              <Button
                onClick={handleDeleteJadwalPengajaran}
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                }}
              >
                Hapus
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
