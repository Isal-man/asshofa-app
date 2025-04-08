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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar, WaliSantriCard } from "../components";
import { useSidebar } from "../context";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { id as localeID } from "date-fns/locale"; // FIX HERE

const Container = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: 20,
  background: "#ecf0f1",
});

const EditCard = styled(Card)({
  width: 700,
  padding: 30,
  backgroundColor: "#fff",
});

const ProfileImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
});

const ProfileInput = styled("input")({
  display: "none",
});

const DEFAULT_IMAGE_PROFILE = import.meta.env.VITE_DEFAULT_IMAGE;

export const EditSantri = () => {
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

  const { id } = useParams(); // GET PARAM
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

  useEffect(() => {
    const fetchSantri = async () => {
      try {
        const response = await apiService.get(`santri/${id}`);
        const data = response.data.data;

        dispatch(setNamaLengkap(data.namaLengkap));
        dispatch(setTempatLahir(data.tempatLahir));
        dispatch(setTanggalLahir(data.tanggalLahir));
        dispatch(setJenisKelamin(data.jenisKelamin));
        dispatch(setAlamat(data.alamat));
        dispatch(setIdWali(data.idWali));
        dispatch(setGambarSantri(data.gambar));

        if (data.idWali) {
          const waliDetail = await apiService.get(`wali-santri/${data.idWali}`);
          setSelectedWaliDetail(waliDetail.data.data);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Gagal mengambil data santri",
          severity: "error",
        });
      }
    };

    fetchSantri();
  }, [id, dispatch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 15 * 1024 * 1024) {
      const formData = new FormData();
      formData.append("gambar", file);
      try {
        const response = await apiService.post("upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(setGambarSantri(response.data));
      } catch (e) {
        setSnackbar({ open: true, message: "Upload gagal", severity: "error" });
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
        gambar,
      };
      const res = await apiService.put(`santri/${id}`, payload);
      setSnackbar({
        open: true,
        message: res ? "Data berhasil diperbarui" : "Data gagal diperbarui",
        severity: res ? "success" : "error",
      });
      resetSantriState();
      navigate("/santri");
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Gagal update data",
        severity: "error",
      });
      resetSantriState();
    }
  };

  return (
    <div
      className={`min-h-screen transition-all ${isOpen ? "ml-64" : "ml-24"}`}
    >
      <Sidebar />
      <div className="container ml-30 p-6">
        <div className="flex flex-col justify-center w-full p-6">
          <h1 className="text-3xl font-bold mb-4">Edit Santri</h1>
          <div className="max-w-4xl w-full">
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300"
              >
                ← Kembali
              </button>
            </div>
          </div>
          <Container>
            <EditCard>
              <CardContent>
                <ProfileImageContainer>
                  <label htmlFor="upload-profile">
                    <Avatar
                      src={gambar || DEFAULT_IMAGE_PROFILE}
                      sx={{ width: 100, height: 100, cursor: "pointer" }}
                    />
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
                  <TextField
                    label="Jenis Kelamin"
                    fullWidth
                    margin="normal"
                    value={jenisKelamin}
                    onChange={(e) => dispatch(setJenisKelamin(e.target.value))}
                  />
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
            </EditCard>
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
