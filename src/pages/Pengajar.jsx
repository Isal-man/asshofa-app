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
  MenuItem,
} from "@mui/material";
import { Visibility, Edit, Delete, Add } from "@mui/icons-material";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Pengajar = () => {
  const [wali, setWali] = useState([]);
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(false);
  const [errorFetch, setErrorFetch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hubunganOptions, setHubunganOptions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchWali();
  }, [searchParams]);

  useEffect(() => {
    fetchHubunganOptions();
  }, []);

  const fetchWali = async () => {
    setLoading(true);
    try {
      const params = { ...searchParams, ...filters };
      const response = await apiService.post("/wali-santri/data", params);
      setWali(response.data.data.list);
      setTotalRows(response.data.data.total);
    } catch (error) {
      setErrorFetch("wali santri");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchHubunganOptions = async () => {
    try {
      const response = await apiService.get("/referensi/wali-santri");
      setHubunganOptions(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data referensi hubungan");
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

  const handleDelete = async () => {
    try {
      await apiService.delete(`/wali-santri/${deleteId}`);
      setWali((prev) => prev.filter((w) => w.id !== deleteId));
      setOpenConfirm(false);
      setDeleteId(null);
      setMessage("Wali santri berhasil dihapus!");
      setSuccess(true);
    } catch (error) {
      setMessage("Gagal menghapus wali santri!");
      setErrorFetch("hapus");
      setError(true);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container ml-30 p-6 w-full">
        <div className="p-6 rounded-xl shadow-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Pengajar</h1>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={() => navigate("/wali-santri/create")}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
              }}
            >
              Tambah Wali
            </Button>
          </div>

          {/* Snackbar Error */}
          <Snackbar
            open={error}
            autoHideDuration={5000}
            onClose={() => setError(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="error"
              variant="filled"
              onClose={() => setError(false)}
              sx={{ width: "100%" }}
            >
              Gagal mengambil data {errorFetch}
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

          <TableContainer component={Paper} className="rounded-xl shadow-md">
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama Lengkap</TableCell>
                  <TableCell>No Telepon</TableCell>
                  <TableCell>Hubungan</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableCell>-</TableCell>
                  <TableCell>
                    <TextField
                      name="namaLengkap"
                      value={filters.namaLengkap || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="noTelepon"
                      value={filters.noTelepon || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      name="hubunganDenganSantri"
                      value={filters.hubunganDenganSantri || ""}
                      onChange={handleSearchChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="">Semua</MenuItem>
                      {hubunganOptions.map((option) => (
                        <MenuItem key={option.id} value={option.status}>
                          {option.status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSearchSubmit}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Cari
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : wali.length > 0 ? (
                  wali.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <TableCell>
                        {(searchParams.page - 1) * searchParams.limit +
                          index +
                          1}
                      </TableCell>
                      <TableCell>{row.namaLengkap}</TableCell>
                      <TableCell>{row.noTelepon}</TableCell>
                      <TableCell>{row.hubunganDenganSantri}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/wali-santri/detail/${row.id}`)
                          }
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() =>
                            navigate(`/wali-santri/edit/${row.id}`)
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
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
                          Coba ubah filter pencarian kamu ya!
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
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
              rowsPerPageOptions={[5, 10, 20, 50]}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
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
          <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
            Konfirmasi Hapus
          </DialogTitle>
          <DialogContent>
            Apakah Anda yakin ingin menghapus wali santri ini? Tindakan ini
            tidak dapat dibatalkan.
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenConfirm(false)}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Hapus
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
