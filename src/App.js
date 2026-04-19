import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import QuickActions from './components/QuickActions';
import { ToastContainer, useToast } from './components/Toast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Store from './pages/Store';
import Updates from './pages/Updates';
import Activate from './pages/Activate';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export const ToastContext = React.createContext();

function AppContent() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <QuickActions />
        <CookieConsent />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
