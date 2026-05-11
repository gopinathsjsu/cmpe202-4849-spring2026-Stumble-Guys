import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar_Preetam';
import Footer from './Footer_Preetam';
import ToastContainer from '../shared/Toast_Sasi';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
