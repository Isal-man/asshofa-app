import "./App.css";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./context";
import { Provider } from "react-redux";
import { store } from "./redux";
import { useEffect } from "react";
import { clearLocalStorageService } from '../src/services'

function App() {
    useEffect(() => {
        clearLocalStorageService()
    }, [])

    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Provider>
    );
}

export default App;
