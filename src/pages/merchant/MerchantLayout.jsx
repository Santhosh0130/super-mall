import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import BottomBar from '../../components/Bottombar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const role = "Merchant"; // or "Merchant"

  return (
    <div className="flex h-screen">
      <Sidebar role={role} />
      <main className="flex-grow overflow-auto pb-16 md:pb-0 p-4">
        <Outlet />
      </main>
      <BottomBar role={role} />
    </div>
  );
};

export default AdminLayout;
