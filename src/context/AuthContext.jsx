import axios from "axios";
import { createContext, useContext, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [userData, setUserData] = useState(token ? jwtDecode(token) : null);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
            setUserData(jwtDecode(response.data.token));
            localStorage.setItem("user", userData);
        } catch (error) {
            throw new Error("Invalid username or password");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserData(null);
    };

    const contextValue = useMemo(
        () => ({
            user: userData,
            login,
            logout,
        }),
        [userData]
    );
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

export const useAuth = () => useContext(AuthContext);
