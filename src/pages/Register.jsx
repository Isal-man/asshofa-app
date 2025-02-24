import { useDispatch, useSelector } from "react-redux";
import { setUsername, setPassword, setGambar, resetAuthState } from "../redux";
import { useAuth } from "../context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    styled,
    TextField,
    Typography,
    Avatar,
    Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { apiService } from '../services'

const Container = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#34495e",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
});

const RegisterCard = styled(Card)({
    width: 800,
    padding: 20,
    color: "#ecf0f1",
    backgroundColor: "#2c3e50",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
});

const ProfileImageContainer = styled("div")({
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
});

const ProfileInput = styled("input")({
    display: "none",
});

const Logo = styled("img")({
    width: "240px",
    display: "block",
    margin: "0 auto 20px",
});

const DEFAULT_IMAGE_PROFILE = import.meta.env.VITE_DEFAULT_IMAGE;
const ASSHOFA_LOGO = import.meta.env.VITE_LOGO_ASSHOFA;

export const Register = () => {
    const dispatch = useDispatch();
    const { register } = useAuth();
    const { username, password, gambar } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await register(username, password, gambar);
            if (response.status === 200) {
                dispatch(resetAuthState());
                navigate("/");
            } else {
                setSnackbarMessage("Register gagal. Username sudah terdaftar.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 15 * 1024 * 1024) {
            const formData = new FormData();
            formData.append("gambar", file);
            try {
                const response = await apiService.post(
                    "upload",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                dispatch(setGambar(response.data))
            } catch (e) {
                console.error(
                    "upload failed",
                    e?.response?.message || e.message()
                );
                setSnackbarMessage("Upload failed. Please try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } else {
            setSnackbarMessage("File terlalu besar, maksimal 15MB");
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <RegisterCard>
                <CardContent>
                    <Logo src={ASSHOFA_LOGO} alt="Asshofa Logo" />
                    <Typography
                        variant="h5"
                        align="center"
                        gutterbottom="true"
                        sx={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: "bold",
                            fontStyle: "italic",
                            color: "#ecf0f1",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        Menjadi Lembaga Pendidikan Islam Yang Membentuk Santri
                        Berprestasi dan Berakhlakul Karimah, Ahli Al-Qur'an,
                        Kitab Kuning, dan Teknologi
                    </Typography>
                    <ProfileImageContainer>
                        <label htmlFor="profile-upload">
                            <Avatar
                                src={gambar || DEFAULT_IMAGE_PROFILE}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    cursor: "pointer",
                                }}
                            />
                        </label>
                        <ProfileInput
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </ProfileImageContainer>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            variant="filled"
                            value={username}
                            onChange={(e) =>
                                dispatch(setUsername(e.target.value))
                            }
                            sx={{
                                backgroundColor: "#ecf0f1",
                                borderRadius: 1,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="filled"
                            value={password}
                            onChange={(e) =>
                                dispatch(setPassword(e.target.value))
                            }
                            sx={{
                                backgroundColor: "#ecf0f1",
                                borderRadius: 1,
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color={"primary"}
                            type="submit"
                            disabled={loading}
                            sx={{ marginTop: 2 }}
                        >
                            {loading? "Loading..." : "Register"}
                        </Button>
                    </form>
                    {error && (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    )}
                    <a href="/login" className="block text-center mt-4">
                        Sudah punya akun? Klik disini
                    </a>
                </CardContent>
            </RegisterCard>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};
