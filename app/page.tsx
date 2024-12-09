import React from 'react';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import StatGrid from '@/components/dashboard/statGrid';
import {
  TrendingUp,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="space-x-4">
        </div>
      </header>

      <StatGrid/>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Orders
        </h2>
        <RecentOrdersTable/>
      </div>
    </div>
  );
}