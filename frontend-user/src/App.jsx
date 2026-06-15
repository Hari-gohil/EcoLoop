import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/layout/MainLayout';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Global UI Components */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
          
          {/* Main Routes wrapped in Dashboard Layout */}
          <ChatProvider>
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </ChatProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
