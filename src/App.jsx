import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

// Placeholder — replaced in Sprint 9
const Dashboard = () => (
    <div className="min-h-screen bg-surface-3 flex items-center
                  justify-center text-text-primary text-2xl">
        🏠 Dashboard — Coming in Sprint 9
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
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/"  element={<Navigate to="/login" replace />} />
                <Route path="*"  element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;