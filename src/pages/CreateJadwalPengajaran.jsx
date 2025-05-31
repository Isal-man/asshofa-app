import { useDispatch, useSelector } from "react-redux";
import {
  resetJadwalPengajaran,
  setHari,
  setMataPelajaran,
  setJamMulai,
  setJamSelesai,
  setIdPengajar,
} from "../redux";
import { apiService } from "../services";
import {
  TextField,
  Button,
  Card,
  CardContent,
  styled,
  Snackbar,
  Select,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar, WaliSantriCard } from "../components";
import { useSidebar } from "../context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { id as localeID } from "date-fns/locale";
import { format } from "date-fns";
import { TimePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";

const Container = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: 20,
  background: "#ecf0f1",
});

const CreateCard = styled(Card)({
  width: 700,
  padding: 30,
  backgroundColor: "#fff",
});

export const CreateJadwalPengajaran = () => {
  const dispatch = useDispatch();
  const { hari, mataPelajaran, jamMulai, jamSelesai, idPengajar } = useSelector(
    (state) => state.jadwalPengajaran
  );

  const { isOpen } = useSidebar();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [searchPengajar, setSearchPengajar] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedPengajar, setSelectedPengajar] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      dispatch(resetJadwalPengajaran());
    }
  }, [isEdit, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isEdit) return;

      setLoadingData(true);
      try {
        const res = await apiService.get(`/jadwal-pengajaran/${id}`);
        const data = res.data.data;
        dispatch(setHari(data?.hari));
        dispatch(setJamMulai(data?.jamMulai));
        dispatch(setJamSelesai(data?.jamSelesai));
        dispatch(setMataPelajaran(data?.mataPelajaran));
        dispatch(setIdPengajar(data?.idPengajar));
        setSearchPengajar(data?.namaPengajar);
      } catch (e) {
        console.error("error when get data jadwal pengajaran", e);
        setSnackbar({
          open: true,
          message: "Gagal memuat data pengajar",
          severity: "error",
        });
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    handleSearchPengajar();
  }, [searchPengajar]);

  const handleSearchPengajar = async () => {
    setLoadingSearch(true);
    try {
      const res = await apiService.post(`/pengajar/data`, {
        namaLengkap: searchPengajar,
        page: 1,
        limit: 1,
      });
      setSelectedPengajar(res?.data?.data?.list[0]);
      dispatch(setIdPengajar(res?.data?.data?.list[0]?.id));
    } catch (err) {
      console.error("error when get data pengajar", err);
      setSnackbar({
        open: true,
        message: "Gagal mencari pengajar",
        severity: "error",
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        hari,
        mataPelajaran,
        jamMulai,
        jamSelesai,
        idPengajar,
      };

      if (jamMulai >= jamSelesai) {
        return setSnackbar({
          open: true,
          message: "Jam selesai harus lebih besar dari jam mulai",
          severity: "warning",
        });
      }

      const res = isEdit
        ? await apiService.put(`jadwal-pengajaran/${id}`, payload)
        : await apiService.post("jadwal-pengajaran", payload);
      setSnackbar({
        open: true,
        message: res
          ? "Jadwal pengajaran berhasil ditambahkan"
          : "Gagal menambahkan jadwal pengajaran",
        severity: res ? "success" : "error",
      });
      dispatch(resetJadwalPengajaran());
      navigate("/jadwal-pengajaran");
    } catch (e) {
      console.log("error", e);
      setSnackbar({
        open: true,
        message: "Gagal menambahkan jadwal pengajaran",
        severity: "error",
      });
    }
  };

  if (loadingData) {
    return (
      <div className="text-center py-32 text-xl font-semibold text-gray-600">
        Memuat data...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all ${isOpen ? "ml-64" : "ml-24"}`}
    >
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">
            {isEdit ? "Edit Jadwal Pengajaran" : "Tambah Jadwal Pengajaran"}
          </h1>
          <div className="max-w-4xl w-full mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300"
            >
              ← Kembali
            </button>
          </div>
          <Container>
            <CreateCard>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div>
                    <TextField
                      label="Cari Nama Pengajar"
                      fullWidth
                      margin="normal"
                      value={searchPengajar}
                      onChange={(e) => setSearchPengajar(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleSearchPengajar}
                      disabled={loadingSearch}
                      sx={{ mt: 1, mb: 2 }}
                    >
                      {loadingSearch ? "Mencari..." : "Cari Pengajar"}
                    </Button>
                  </div>
                  {selectedPengajar ? (
                    <WaliSantriCard
                      gambar={selectedPengajar?.gambar}
                      namaLengkap={selectedPengajar?.namaLengkap}
                      status={"pengajar"}
                    />
                  ) : (
                    searchPengajar &&
                    !loadingSearch && (
                      <div className="mb-4 text-red-600">
                        Tidak ditemukan.{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/pengajar/create")}
                          className="underline cursor-pointer text-blue-600 bg-transparent border-none p-0 font-normal"
                        >
                          Buat data pengajar baru?
                        </button>
                      </div>
                    )
                  )}
                  <TextField
                    label="Mata Pelajaran"
                    fullWidth
                    margin="normal"
                    value={mataPelajaran}
                    onChange={(e) => dispatch(setMataPelajaran(e.target.value))}
                  />
                  <Select
                    name="hari"
                    value={hari || ""}
                    onChange={(e) => dispatch(setHari(e.target.value))}
                    variant="outlined"
                    size="small"
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="">Pilih Hari</MenuItem>
                    <MenuItem value="Senin">Senin</MenuItem>
                    <MenuItem value="Selasa">Selasa</MenuItem>
                    <MenuItem value="Rabu">Rabu</MenuItem>
                    <MenuItem value="Kamis">Kamis</MenuItem>
                    <MenuItem value="Jumat">Jumat</MenuItem>
                    <MenuItem value="Sabtu">Sabtu</MenuItem>
                  </Select>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={localeID}
                  >
                    <div className="flex flex-col gap-2">
                      <TimePicker
                        label="Jam Mulai"
                        value={
                          jamMulai ? new Date(`1970-01-01T${jamMulai}`) : null
                        }
                        onChange={(newValue) => {
                          if (newValue) {
                            const jam = format(newValue, "HH:mm"); 
                            dispatch(setJamMulai(jam));
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth margin="normal" />
                        )}
                      />
                      <TimePicker
                        label="Jam Selesai"
                        value={
                          jamSelesai
                            ? new Date(`1970-01-01T${jamSelesai}`)
                            : null
                        }
                        onChange={(newValue) => {
                          if (newValue) {
                            const jam = format(newValue, "HH:mm"); 
                            dispatch(setJamSelesai(jam));
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth margin="normal" />
                        )}
                      />
                    </div>
                  </LocalizationProvider>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    type="submit"
                  >
                    Simpan
                  </Button>
                </form>
              </CardContent>
            </CreateCard>
          </Container>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};
