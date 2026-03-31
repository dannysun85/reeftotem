import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, login } = useAuthStore();
  
  useEffect(() => {
    // Rehydrate state from localStorage if page reloaded
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      login(token);
    }
  }, [isAuthenticated, login]);

  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;