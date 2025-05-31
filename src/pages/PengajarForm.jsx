import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPengajarState,
  setGambarPengajar,
  setNamaLengkapPengajar,
  setSpesialisasi,
  setAlamatPengajar,
  setNoTeleponPengajar,
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
import { useEffect, useState } from "react";
import { Sidebar } from "../components";
import { useSidebar } from "../context";

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

export const PengajarForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();

  const isEdit = !!id;

  const { namaLengkap, noTelepon, spesialisasi, alamat, gambar } = useSelector(
    (state) => state.pengajar
  );

  const [loadingData, setLoadingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [spesialisasiList, setSpesialisasiList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!isEdit) {
      dispatch(resetPengajarState());
    }
  }, [isEdit, dispatch]);

  useEffect(() => {
    const fetchSpesialisasi = async () => {
      try {
        const res = await apiService.get("/referensi/spesialisasi");
        setSpesialisasiList(res.data.data);
      } catch {
        setSnackbar({
          open: true,
          message: "Gagal memuat data spesialisasi",
          severity: "error",
        });
      }
    };
    fetchSpesialisasi();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isEdit) return;

      setLoadingData(true);
      try {
        const res = await apiService.get(`/pengajar/${id}`);
        const data = res.data.data;
        dispatch(setNamaLengkapPengajar(data.namaLengkap));
        dispatch(setNoTeleponPengajar(data.noTelepon));
        dispatch(setAlamatPengajar(data.alamat));
        dispatch(setGambarPengajar(data.gambar));
        dispatch(setSpesialisasi(data.spesialisasi));
      } catch {
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
        dispatch(setGambarPengajar(response.data));
      } catch (e) {
        console.log("error", e);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      namaLengkap,
      noTelepon,
      spesialisasi,
      alamat,
      gambar: gambar || DEFAULT_IMAGE_PROFILE,
    };

    try {
      if (isEdit) {
        await apiService.put(`/pengajar/${id}`, payload);
      } else {
        await apiService.post("/pengajar", payload);
      }

      setSnackbar({
        open: true,
        message: isEdit
          ? "Pengajar berhasil diperbarui"
          : "Pengajar berhasil ditambahkan",
        severity: "success",
      });

      dispatch(resetPengajarState());
      navigate("/pengajar");
    } catch {
      setSnackbar({
        open: true,
        message: "Gagal menyimpan data",
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
            {isEdit ? "Edit Pengajar" : "Tambah Pengajar"}
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
                    onChange={(e) =>
                      dispatch(setNamaLengkapPengajar(e.target.value))
                    }
                  />
                  <TextField
                    label="No Telepon"
                    fullWidth
                    margin="normal"
                    value={noTelepon}
                    onChange={(e) => dispatch(setNoTeleponPengajar(e.target.value))}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Spesialisasi</InputLabel>
                    <Select
                      value={spesialisasi}
                      onChange={(e) =>
                        dispatch(setSpesialisasi(e.target.value))
                      }
                      label="Spesialisasi"
                    >
                      {spesialisasiList.map((item) => (
                        <MenuItem key={item.id} value={item.spesialisasi}>
                          {item.spesialisasi}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Alamat"
                    fullWidth
                    margin="normal"
                    multiline
                    value={alamat}
                    onChange={(e) => dispatch(setAlamatPengajar(e.target.value))}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    type="submit"
                  >
                    {isEdit ? "Simpan Perubahan" : "Simpan"}
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
