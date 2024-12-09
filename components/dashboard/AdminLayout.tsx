"use client";

import {
  BarChart,
  Home,
  Layers,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import AuthButton from "../authButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path: string;
}

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path }) => {
  return (
    <Link href={`${path}`}>
      <div className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 ease-in-out group">
        <span className="text-gray-400 group-hover:text-white transition-colors">
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </div>
    </Link>
  );
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        {session ? (
          <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
            <div className="mb-10 flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <nav className="space-y-2">
              <SidebarItem
                icon={<Home className="w-5 h-5" />}
                label="Dashboard"
                path="/"
              />
              <SidebarItem
                icon={<ShoppingCart className="w-5 h-5" />}
                label="Orders"
                path="/orders"
              />
              <SidebarItem
                icon={<Package className="w-5 h-5" />}
                label="Products"
                path="/product"
              />
              <SidebarItem
                icon={<Users className="w-5 h-5" />}
                label="Customers"
                path="/customers"
              />
              <SidebarItem
                icon={<Layers className="w-5 h-5" />}
                label="Inventory"
                path="/inventory"
              />
            </nav>
          </div>
        ) : null}

        {/* Mobile Sidebar */}
        {session ? (
          <Sheet>
            <SheetTrigger
              asChild
              className="md:hidden absolute top-4 left-4 z-50"
            >
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20"
              >
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
            >
              <div className="mb-10 flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <Layers className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              </div>
              <nav className="space-y-2">
                <SidebarItem
                  icon={<Home className="w-5 h-5" />}
                  label="Dashboard"
                  path="/dashboard"
                />
                <SidebarItem
                  icon={<ShoppingCart className="w-5 h-5" />}
                  label="Orders"
                  path="/orders"
                />
                <SidebarItem
                  icon={<Package className="w-5 h-5" />}
                  label="Products"
                  path="/product"
                />
                <SidebarItem
                  icon={<Users className="w-5 h-5" />}
                  label="Customers"
                  path="/customers"
                />
                <SidebarItem
                  icon={<Layers className="w-5 h-5" />}
                  label="Inventory"
                  path="/inventory"
                />
                <SidebarItem
                  icon={<BarChart className="w-5 h-5" />}
                  label="Analytics"
                  path="/analytics"
                />
                <SidebarItem
                  icon={<Settings className="w-5 h-5" />}
                  label="Settings"
                  path="/settings"
                />
              </nav>
            </SheetContent>
          </Sheet>
        ) : null}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Search Input */}
            </div>
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
