import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import SessionTimeout from './components/SessionTimeout';
import { ToastContainer, useToast } from './components/Toast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Store from './pages/Store';
import Updates from './pages/Updates';
import Activate from './pages/Activate';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Welcome from "./pages/Welcome";
import ActivationSuccess from "./pages/ActivationSuccess";
import ActivationError from "./pages/ActivationError";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SmartHiveOS from './pages/SmartHiveOS';

export const ToastContext = React.createContext();

function AppContent() {
  const { toasts, addToast, removeToast } = useToast();
  const location = useLocation();
  
  const hideFooter = location.pathname.startsWith('/smart-hive-os');

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="App">
        <Header />
        <SessionTimeout />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/activation-success" element={<ActivationSuccess />} />
            <Route path="/activation-error" element={<ActivationError />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/smart-hive-os/*" element={<SmartHiveOS />} />
          </Routes>
        </main>
        {!hideFooter && <Footer />}
        <ScrollToTop />
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