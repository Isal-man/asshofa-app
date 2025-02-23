import "./App.css";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./context";
import { Provider } from "react-redux";
import { store } from "./redux";

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Provider>
    );
}

export default App;
