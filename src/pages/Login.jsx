import { useDispatch, useSelector } from "react-redux";
import { resetAuthState, setUsername, setPassword } from "../redux";
import { useAuth } from "../context";
import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Container = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#34495e", // Slightly darker than LoginCard
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
});

const LoginCard = styled(Card)({
    width: 800,
    padding: 20,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
});

const Logo = styled("img")({
    width: "240px",
    display: "block",
    margin: "0 auto 20px",
});

const asshofaLogo = import.meta.env.VITE_LOGO_ASSHOFA;

export const Login = () => {
    const dispatch = useDispatch();
    const { login } = useAuth();
    const { username, password } = useSelector((state) => state.auth);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            dispatch(resetAuthState());
            navigate("/dashboard")
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Container>
            <LoginCard>
                <CardContent>
                    <Logo src={asshofaLogo} alt="Asshofa Logo" />
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
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
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            variant="filled"
                            value={username}
                            onChange={(e) => dispatch(setUsername(e.target.value))}
                            sx={{
                                backgroundColor: "#ecf0f1",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#2c3e50",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#3498db",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#3498db",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    color: "#2c3e50",
                                },
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
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#2c3e50",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#3498db",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#3498db",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    color: "#2c3e50",
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ marginTop: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                    {error && (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    )}
                    <a href="/register" className="block text-center mt-4">
                        Belum punya akun? klik disini
                    </a>
                </CardContent>
            </LoginCard>
        </Container>
    );
};
