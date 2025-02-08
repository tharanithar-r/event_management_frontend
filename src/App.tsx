import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import TokenVerify from "./hooks/auth/tokenVerify";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Login from "./pages/Login";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import Home from "./pages/Home";
//import AppLayout from "./layout/AppLayout";
import Unauthorized from "./components/ui/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { useStateNotifications } from "./hooks/useStateNotifications";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLoading } = TokenVerify();
  const { id: authId } = useSelector((state: RootState) => state.auth);
  const [authLoading, setAuthLoading] = useState(true);

  useStateNotifications();

  useEffect(() => {
    setAuthLoading(isLoading);
  }, [isLoading]);

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="relative">
      <Toaster position="bottom-center" />
      <Router>
        <LoadingIndicator />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={authId ? "/home" : "/login"} replace />}
          />
          <Route
            path="/login"
            element={!authId ? <Login /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/register"
            element={!authId ? <Register /> : <Navigate to="/home" replace />}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to={authId ? "/home" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
