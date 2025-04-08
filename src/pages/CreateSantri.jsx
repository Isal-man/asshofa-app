import { useDispatch, useSelector } from "react-redux";
import {
  setNamaLengkap,
  setTempatLahir,
  setTanggalLahir,
  setJenisKelamin,
  setAlamat,
  setIdWali,
  setGambarSantri,
  resetSantriState,
} from "../redux";
import { apiService } from "../services";
import {
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  styled,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, WaliSantriCard } from "../components";
import { useSidebar } from "../context";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { id as localeID } from "date-fns/locale";

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

const ProfileImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
  position: "relative",
});

const ProfileInput = styled("input")({
  display: "none",
});

const DEFAULT_IMAGE_PROFILE = import.meta.env.VITE_DEFAULT_IMAGE;

export const CreateSantri = () => {
  const dispatch = useDispatch();
  const {
    namaLengkap,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    alamat,
    idWali,
    gambar,
  } = useSelector((state) => state.santri);

  const { isOpen } = useSidebar();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [searchWali, setSearchWali] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedWaliDetail, setSelectedWaliDetail] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 15 * 1024 * 1024) {
      const formData = new FormData();
      formData.append("gambar", file);
      setUploadingImage(true);
      try {
        const response = await apiService.post("upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(setGambarSantri(response.data));
      } catch (e) {
        setSnackbar({ open: true, message: "Upload gagal", severity: "error" });
      } finally {
        setUploadingImage(false);
      }
    } else {
      setSnackbar({
        open: true,
        message: "Maksimum file 15MB",
        severity: "warning",
      });
    }
  };

  const handleSearchWali = async () => {
    setLoadingSearch(true);
    try {
      const res = await apiService.get(`/wali-santri?name=${searchWali}`);
      setSelectedWaliDetail(res.data.data);
      dispatch(setIdWali(res.data.data.id));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Gagal mencari wali santri",
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
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        alamat,
        idWali,
        gambar: gambar || DEFAULT_IMAGE_PROFILE,
      };
      const res = await apiService.post("santri", payload);
      setSnackbar({
        open: true,
        message: res
          ? "Santri berhasil ditambahkan"
          : "Gagal menambahkan santri",
        severity: res ? "success" : "error",
      });
      dispatch(resetSantriState());
      navigate("/santri");
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Gagal menambahkan santri",
        severity: "error",
      });
    }
  };

  return (
    <div
      className={`min-h-screen transition-all ${isOpen ? "ml-64" : "ml-24"}`}
    >
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">Tambah Santri</h1>
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
                <ProfileImageContainer>
                  <label htmlFor="upload-profile">
                    <Avatar
                      src={gambar || DEFAULT_IMAGE_PROFILE}
                      sx={{
                        width: 100,
                        height: 100,
                        cursor: "pointer",
                        opacity: uploadingImage ? 0.5 : 1,
                        transition: "opacity 0.3s",
                      }}
                    />
                    {uploadingImage && (
                      <CircularProgress
                        size={28}
                        sx={{
                          position: "absolute",
                          top: "35%",
                          left: "calc(50% - 14px)",
                        }}
                      />
                    )}
                  </label>
                  <ProfileInput
                    id="upload-profile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </ProfileImageContainer>

                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Nama Lengkap"
                    fullWidth
                    margin="normal"
                    value={namaLengkap}
                    onChange={(e) => dispatch(setNamaLengkap(e.target.value))}
                  />
                  <TextField
                    label="Tempat Lahir"
                    fullWidth
                    margin="normal"
                    value={tempatLahir}
                    onChange={(e) => dispatch(setTempatLahir(e.target.value))}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={localeID}
                  >
                    <DatePicker
                      label="Tanggal Lahir"
                      value={tanggalLahir ? new Date(tanggalLahir) : null}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toISOString().split("T")[0];
                          dispatch(setTanggalLahir(formatted));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="jenis-kelamin-label">
                      Jenis Kelamin
                    </InputLabel>
                    <Select
                      labelId="jenis-kelamin-label"
                      value={jenisKelamin}
                      label="Jenis Kelamin"
                      onChange={(e) =>
                        dispatch(setJenisKelamin(e.target.value))
                      }
                    >
                      <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                      <MenuItem value="Perempuan">Perempuan</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Alamat"
                    fullWidth
                    margin="normal"
                    multiline
                    value={alamat}
                    onChange={(e) => dispatch(setAlamat(e.target.value))}
                  />
                  <TextField
                    label="Cari Nama Wali Santri"
                    fullWidth
                    margin="normal"
                    value={searchWali}
                    onChange={(e) => setSearchWali(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleSearchWali}
                    disabled={loadingSearch}
                    sx={{ mt: 1, mb: 2 }}
                  >
                    {loadingSearch ? "Mencari..." : "Cari Wali Santri"}
                  </Button>

                  {selectedWaliDetail ? (
                    <WaliSantriCard
                      gambar={selectedWaliDetail?.santriList?.[0]?.gambarWali}
                      namaLengkap={selectedWaliDetail.namaLengkap}
                    />
                  ) : (
                    searchWali &&
                    !loadingSearch && (
                      <div className="mb-4 text-red-600">
                        Tidak ditemukan.{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/wali-santri/tambah")}
                          className="underline cursor-pointer text-blue-600 bg-transparent border-none p-0 font-normal"
                        >
                          Buat data wali santri baru?
                        </button>
                      </div>
                    )
                  )}

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
