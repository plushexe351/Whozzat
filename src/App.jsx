import { AuthProvider } from "./Context/AuthContext";
import { DataProvider } from "./Context/DataContext";
import "./Globals.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home/HomeLayout";
import Auth from "./Pages/Auth/Auth";
import Profile from "./Pages/Home/HomeOutlets/Profile/Profile";
import Analytics from "./Pages/Home/HomeOutlets/Analytics/Analytics";
import Landing from "./Pages/Landing/Landing";
import PrivateRoute from "./Components/PrivateRoute";
import { ToastProvider } from "./Context/ToastContext";
import { UIProvider } from "./Context/UIContext";
import Dashboard from "./Pages/Home/HomeOutlets/Dashboard/Dashboard";
import Settings from "./Pages/Home/HomeOutlets/Settings/Settings";
import PublicProfile from "./Pages/PublicProfile/PublicProfile";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ToastProvider>
          <DataProvider>
            <div className="App">
              <ScrollToTop />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                {/* Public profile route */}
                <Route path="/u/:username" element={<PublicProfile />} />
              </Routes>
            </div>
          </DataProvider>
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
