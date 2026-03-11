import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/auth/RoleRoute';
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { TrackingDashboard } from "./pages/TrackingDashboard";
import Orders from "./pages/Orders";
import Earnings from "./pages/Earnings";
import { Settings } from "./pages/Settings";
import { RequestHub } from "./pages/RequestHub";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import "./index.css";

const Placeholder = ({ name }) => (
  <div className="p-8 text-slate-500 text-sm">
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{name}</h2>
      <p>This section is coming soon. Core functionality is available via the sidebar.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth isLogin={true} />} />
          <Route path="/signup" element={<Auth isLogin={false} />} />

          {/* Protected General Dashboard Routes (All Logged-in Users) */}
          <Route element={<RoleRoute allowedRoles={['client', 'courier', 'partner', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
              <Route path="/chats"     element={<Placeholder name="Chats" />} />
            </Route>
          </Route>

          {/* Protected Client Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['client', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/orders"    element={<Orders />} />
              <Route path="/requests/*"element={<RequestHub />} />
              <Route path="/history"   element={<Placeholder name="History" />} />
            </Route>
          </Route>

          {/* Protected Courier/Partner/Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['courier', 'partner', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/tracking" element={<TrackingDashboard />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/partners" element={<Placeholder name="Partners" />} />
              <Route path="/analysis" element={<Placeholder name="Analysis" />} />
            </Route>
          </Route>

          {/* Fallback to landing if not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
