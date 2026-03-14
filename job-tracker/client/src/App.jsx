import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { CompanyDetails } from './pages/CompanyDetails';
import { PersonDetails } from './pages/PersonDetails';
import { Calendar } from './pages/Calendar';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Settings } from './pages/Settings.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Layout>
                  <Companies />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CompanyDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/person/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PersonDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </ProtectedRoute>
            }
          />


          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>

          } />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
