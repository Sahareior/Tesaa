import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { DashboardLayout } from '@/layouts';
import { 
  LoginPage, 
  RegisterPage, 
  DashboardPage,
  // ChatPages,
  // GroupPages,
  // SettingsPage,
  // NotificationsPage
} from '@/pages';
import { SocketProvider } from './Context/SocketContext.jsx';
import { LoadingOverlay } from '@/components';
import Groups from './pages/Groups/Groups';
import GroupVideoCall from './pages/Groups/GroupVideoCall';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { userId } = useAuth();

  return (
    <SocketProvider userId={userId}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              
              {/* Chat Routes */}
              <Route path="chats" element={<div className="p-8 text-center text-text-secondary">Chats Page - Coming Soon</div>} />
              <Route path="chat/group/:id" element={<div className="p-8 text-center text-text-secondary">Group Chat - Coming Soon</div>} />
              <Route path="chat/private/:id" element={<div className="p-8 text-center text-text-secondary">Private Chat - Coming Soon</div>} />
              
              {/* Group Routes */}
              <Route path="groups" element={ <Groups />} />
              {/* /groups/${groupId}/call */}
              <Route path='/groups/:id/call' element={ <GroupVideoCall />} />
              <Route path="groups/create" element={<div className="p-8 text-center text-text-secondary">Create Group - Coming Soon</div>} />
              <Route path="groups/:id" element={<div className="p-8 text-center text-text-secondary">Group Details - Coming Soon</div>} />
              
              {/* Other Routes */}
              <Route path="notifications" element={<div className="p-8 text-center text-text-secondary">Notifications - Coming Soon</div>} />
              <Route path="settings" element={<div className="p-8 text-center text-text-secondary">Settings - Coming Soon</div>} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </SocketProvider>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-bg-page dark:bg-dark-bg-page">
      <AppRoutes />
    </div>
  );
}

export default App;