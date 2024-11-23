"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart,
  Home,
  Layers,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import React, { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';

import AuthButton from '../authButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path: string;
}

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label ,path}) => {
  return (
    <Link href={`${path}`}><div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
    </Link>
  );
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  return (
<SessionProvider>
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold pl-5">Admin</h1>
        </div>
        <nav className="space-y-2">
          <SidebarItem icon={<Home />} label="Dashboard" path='/dashboard'/>
          <SidebarItem icon={<ShoppingCart />} label="Orders" path='/orders'/>
          <SidebarItem icon={<Package />} label="Products" path='/product'/>
          <SidebarItem icon={<Users />} label="Customers" path = '/customers'/>
          <SidebarItem icon={<BarChart />} label="Analytics" path='/analytics'/>
          <SidebarItem icon={<Layers  />} label="Inventory" path='/inventory'/>
          <SidebarItem icon={<Settings />} label="Settings" path='/settings'/>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-900 text-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">EAD</h1>
          </div>
          <nav className="space-y-2">
          <SidebarItem icon={<Home />} label="Dashboard" path='/dashboard'/>
          <SidebarItem icon={<ShoppingCart />} label="Orders" path='/orders'/>
          <SidebarItem icon={<Package />} label="Products" path='/product'/>
          <SidebarItem icon={<Users />} label="Customers" path = '/customers'/>
          <SidebarItem icon={<Layers  />} label="Inventory" path='/inventory'/>
          <SidebarItem icon={<BarChart />} label="Analytics" path='/analytics'/>
          <SidebarItem icon={<Settings />} label="Settings" path='/settings'/>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
    
          </div>
          
          {/* User Profile Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/placeholder-user.jpg" alt="User Profile" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <AuthButton />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </SessionProvider>
  );
};

export default AdminDashboardLayout;