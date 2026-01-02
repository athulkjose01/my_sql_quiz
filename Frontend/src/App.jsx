import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdminLogin from '@/pages/AdminLogin';
import Dashboard from '@/pages/Dashboard';
import Quiz from '@/pages/Quiz';
import QuizResult from '@/pages/QuizResult';
import AdminQuestions from '@/pages/admin/AdminQuestions';
import AdminReports from '@/pages/admin/AdminReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-black">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/result/:id"
              element={
                <ProtectedRoute>
                  <QuizResult />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/questions"
              element={
                <AdminRoute>
                  <AdminQuestions />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
