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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Santri = () => {
  const [santri, setSantri] = useState([]);
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [kota, setKota] = useState(null);
  const [kotaOptions, setKotaOptions] = useState([]);
  const [error, setError] = useState(false);
  const [errorFetch, setErrorFetch] = useState("");
  const [debouncedKota, setDebouncedKota] = useState(kota);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSantri();
  }, [searchParams]);

  useEffect(() => {
    if (debouncedKota?.trim() !== "") {
      fetchKota();
    }
  }, [debouncedKota]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKota(kota);
    }, 500);
    return () => clearTimeout(handler);
  }, [kota]);

  const fetchSantri = async () => {
    setLoading(true);
    try {
      const params = { ...searchParams, ...filters };
      const response = await apiService.post("/santri/data", params);
      setSantri(response.data.data.list);
      setTotalRows(response.data.data.total);
    } catch (error) {
      setErrorFetch("santri");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchKota = async () => {
    try {
      const response = kota
        ? await apiService.get(`/referensi/kota?nama=${kota}`)
        : await apiService.get(`/referensi/kota`);
      setKotaOptions(response.data.data);
    } catch (error) {
      setErrorFetch("kota");
      setError(true);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleDateChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      tanggalLahir: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    }));
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

  const handleDeleteSantri = async () => {
    try {
      await apiService.delete(`/santri/${deleteId}`);
      setSantri((prev) => prev.filter((s) => s.id !== deleteId));
      setOpenConfirm(false);
      setDeleteId(null);
    } catch (error) {
      setErrorFetch("hapus");
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
            <h1 className="text-3xl font-bold">Santri</h1>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={() => navigate("/santri/create")}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
              }}
            >
              Tambah Santri
            </Button>
          </div>

          {/* Error Snackbar */}
          <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
            <Alert onClose={() => setError(false)} severity="error" sx={{ width: "100%" }}>
              Failed to fetch data {errorFetch === "santri" ? "santri" : "kota"}
            </Alert>
          </Snackbar>

          {/* Table */}
          <TableContainer component={Paper} className="shadow-lg rounded-lg">
            <Table>
              <TableHead className="bg-gray-200">
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Tempat Lahir</TableCell>
                  <TableCell>Tanggal Lahir</TableCell>
                  <TableCell>Jenis Kelamin</TableCell>
                  <TableCell>Nama Wali</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <TextField
                      name="nama"
                      value={filters.nama || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <TextField
                        name="kotaSearch"
                        value={kota}
                        onChange={(e) => setKota(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Cari Kota"
                        style={{ marginBottom: "8px" }}
                      />
                      <Select
                        name="tempatLahir"
                        value={filters.tempatLahir || ""}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="">Pilih Kota</MenuItem>
                        {kotaOptions.map((kota) => (
                          <MenuItem key={kota.id} value={kota.namaKota}>
                            {kota.namaKota}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Pilih Tanggal"
                        value={filters.tanggalLahir ? dayjs(filters.tanggalLahir) : null}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            size: "small",
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <Select
                      name="jenisKelamin"
                      value={filters.jenisKelamin || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="">Pilih Jenis Kelamin</MenuItem>
                      <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                      <MenuItem value="Perempuan">Perempuan</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="namaWali"
                      value={filters.namaWali || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={handleSearchSubmit}>
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
                ) : santri.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                          alt="Not Found"
                          className="w-24 h-24 mb-4 opacity-70"
                        />
                        <p className="text-lg font-semibold">Data santri tidak ditemukan</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Coba ubah filter pencarian kamu ya!
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  santri.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      <TableCell>
                        {(searchParams.page - 1) * searchParams.limit + index + 1}
                      </TableCell>
                      <TableCell>{row.namaLengkap}</TableCell>
                      <TableCell>{row.tempatLahir}</TableCell>
                      <TableCell>{row.tanggalLahir}</TableCell>
                      <TableCell>{row.jenisKelamin}</TableCell>
                      <TableCell>{row.namaWali}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/santri/detail/${row.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => navigate(`/santri/edit/${row.id}`)}
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
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem", color: "#d32f2f" }}>
              Konfirmasi Hapus
            </DialogTitle>
            <DialogContent sx={{ fontSize: "1rem", color: "#333" }}>
              Yakin ingin menghapus santri ini? Tindakan ini tidak dapat dibatalkan.
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
                onClick={handleDeleteSantri}
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
