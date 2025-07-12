import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react' // or use any icon
import BottomBar from '../../components/Bottombar'

const AdminLayout = () => {
  const role = "Admin";

  return (

    <div className='flex h-screen'>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className='flex-grow overflow-y-auto pb-16 md:pb-0 p-4'>
        <Outlet />
      </main>

      <BottomBar role={role} />
    </div>
  )
}

export default AdminLayout;
