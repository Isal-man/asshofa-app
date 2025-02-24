import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: "",
    password: "",
    role: "",
    gambar: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setGambar: (state, action) => {
            state.gambar = action.payload
        },
        resetAuthState: (state) => {
            state.username = ""
            state.password = ""
            state.role = ""
            state.gambar = ""
        }
    }
})

export const { setUsername, setPassword, setGambar, setRole, resetAuthState } = authSlice.actions;
export default authSlice.reducer;