import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiService from "../services/apiService";

export const Santri = () => {
  const [santri, setSantri] = useState([]);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [kotaOptions, setKotaOptions] = useState([]);

  useEffect(() => {
    fetchSantri();
  }, [searchParams]);

  const fetchSantri = async () => {
    try {
      const params = { ...searchParams, ...filters };
      const response = await apiService.post("/santri/data", params);
      setSantri(response.data.data.list);
      setTotalRows(response.data.data.total);
    } catch (error) {
      console.error("Error fetching santri data:", error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleDateChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      tanggalLahir: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    }));
  };

  const handleSearchSubmit = () => {
    setSearchParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="p-6 w-full">
          <h1 className="text-3xl font-bold mb-4">Santri</h1>
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
                        <MenuItem key={kota.id} value={kota.nama}>
                          {kota.nama}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Pilih Tanggal"
                        value={
                          filters.tanggalLahir
                            ? dayjs(filters.tanggalLahir)
                            : null
                        }
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
                {santri.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-100">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.namaLengkap}</TableCell>
                    <TableCell>{row.tempatLahir}</TableCell>
                    <TableCell>{row.tanggalLahir}</TableCell>
                    <TableCell>{row.jenisKelamin}</TableCell>
                    <TableCell>{row.namaWali}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton color="warning">
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
        </div>
      </div>
    </div>
  );
};
