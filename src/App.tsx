import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import { Login } from './pages/Login';
import { Clients } from './pages/Clients';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/clients"
            element={
              <SuperAdminRoute>
                <Clients />
              </SuperAdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/clients" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
