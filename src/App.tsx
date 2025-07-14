@@ .. @@
 import ProtectedRoute from './components/layout/ProtectedRoute';
 import LoginPage from './pages/LoginPage';
 import SignupPage from './pages/SignupPage';
+import ForgotPasswordPage from './pages/ForgotPasswordPage';
+import ResetPasswordPage from './pages/ResetPasswordPage';
 import DashboardPage from './pages/DashboardPage';
 import SubmissionsPage from './pages/SubmissionsPage';
 import SubmissionDetailPage from './pages/SubmissionDetailPage';
@@ .. @@
           {/* Public routes */}
           <Route path="/login" element={<LoginPage />} />
           <Route path="/signup" element={<SignupPage />} />
+          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
+          <Route path="/reset-password" element={<ResetPasswordPage />} />
           
           {/* Protected routes */}
           <Route element={<ProtectedRoute />}>