import "./App.css";
import { AppRoutes } from "./routes";
import { AuthProvider, SidebarProvider } from "./context";
import { Provider } from "react-redux";
import { store } from "./redux";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
