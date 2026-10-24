// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./assets/styles/index.css";
import {AppRoutes} from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      {}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
