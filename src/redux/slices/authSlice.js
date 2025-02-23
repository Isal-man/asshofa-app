import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: "",
    password: ""
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
        resetAuthState: (state) => {
            state.username = ""
            state.password = ""
        }
    }
})

export const { setUsername, setPassword, resetAuthState } = authSlice.actions;
export default authSlice.reducer;