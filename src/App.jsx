import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Goals from './pages/goals/Goals';
import Habits from './pages/habits/Habits';
import Jobs from './pages/jobs/Jobs';
import Coach from './pages/coach/Coach.jsx'
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';


const Notifications = () => (
    <div className="text-text-primary text-xl">
        🔔 Notifications — Coming soon
    </div>
);
const Settings = () => (
    <div className="text-text-primary text-xl">
        ⚙️ Settings — Coming soon
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1a2e',
                        color: '#e2e8f0',
                        border: '1px solid #2a2a4a',
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                }}
            />
            <Routes>

                {/* Public routes */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes — wrapped in Layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard"     element={<Dashboard />} />
                    <Route path="/goals"         element={<Goals />} />
                    <Route path="/habits"        element={<Habits />} />
                    <Route path="/jobs"          element={<Jobs />} />
                    <Route path="/coach"         element={<Coach />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings"      element={<Settings />} />
                </Route>

                {/* Default */}
                <Route path="/"  element={<Navigate to="/dashboard" replace />} />
                <Route path="*"  element={<Navigate to="/dashboard" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;