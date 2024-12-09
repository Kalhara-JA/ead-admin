'use client'

import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import React from 'react'
import { fetchAllOrders } from '@/services/orderService';

interface Order {
    id: number;
    orderNumber: string;
    email: string;
    items: OrderItem[];
    total: number;
    date: string;
    shippingAddress: string;
    paymentStatus: string;
    deliveryStatus: string;
  }
  
  interface OrderItem {
    skuCode: string;
    quantity: number;
  }
  
  // Define Stat interface
  interface Stat {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
  }

function StatGrid() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([
      {
        icon: <DollarSign className="text-blue-500" />,
        title: 'Total Revenue',
        value: '$0',
        change: '+0%',
      },
      {
        icon: <ShoppingCart className="text-green-500" />,
        title: 'Orders',
        value: '0',
        change: '+0%',
      },
      {
        icon: <Users className="text-purple-500" />,
        title: 'New Customers',
        value: '0',
        change: '+0%',
      },
      {
        icon: <Package className="text-orange-500" />,
        title: 'Products Sold',
        value: '0',
        change: '+0%',
      },
    ]);

    useEffect(() => {
        const loadOrders = async () => {
          try {
            // Fetch all orders
            const allOrders: Order[] = await fetchAllOrders();
            setOrders(allOrders);
    
            // Calculate total revenue
            const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
            
            // Calculate unique customers
            const uniqueCustomers = new Set(allOrders.map(order => order.email)).size;
            
            // Calculate total products sold
            const totalProductsSold = allOrders.reduce((sum, order) => 
              sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
            , 0);
    
            // Update stats with calculated values
            const now = new Date();
            const previousPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    
            // Filter orders from the previous period for comparison
            const previousPeriodOrders = allOrders.filter(order => 
              new Date(order.date) >= previousPeriodStart && new Date(order.date) < now
            );
    
            // Calculate changes
            const prevRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
            const revenueChange = prevRevenue ? ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : '0';
    
            const prevOrderCount = previousPeriodOrders.length;
            const orderChange = prevOrderCount ? ((allOrders.length - prevOrderCount) / prevOrderCount * 100).toFixed(1) : '0';
    
            const prevCustomerCount = new Set(previousPeriodOrders.map(order => order.email)).size;
            const customerChange = prevCustomerCount ? ((uniqueCustomers - prevCustomerCount) / prevCustomerCount * 100).toFixed(1) : '0';
    
            const prevProductsSold = previousPeriodOrders.reduce((sum, order) => 
              sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
            , 0);
            const productsSoldChange = prevProductsSold ? ((totalProductsSold - prevProductsSold) / prevProductsSold * 100).toFixed(1) : '0';
    
            setStats([
              {
                icon: <DollarSign className="text-blue-500" />,
                title: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString()}`,
                change: `+${revenueChange}%`,
              },
              {
                icon: <ShoppingCart className="text-green-500" />,
                title: 'Orders',
                value: allOrders.length.toLocaleString(),
                change: `+${orderChange}%`,
              },
              {
                icon: <Users className="text-purple-500" />,
                title: 'New Customers',
                value: uniqueCustomers.toLocaleString(),
                change: `+${customerChange}%`,
              },
              {
                icon: <Package className="text-orange-500" />,
                title: 'Products Sold',
                value: totalProductsSold.toLocaleString(),
                change: `+${productsSoldChange}%`,
              },
            ]);
          } catch (error) {
            console.error("Failed to load orders:", error);
          }
        };
    
        loadOrders();
      }, []);
    
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              {stat.icon}
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
  )
}

export default StatGrid