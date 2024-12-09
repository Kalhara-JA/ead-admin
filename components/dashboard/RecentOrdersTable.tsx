"use client";

import React, { useState } from "react";

import { fetchAllOrders } from "@/services/orderService";
import { useEffect } from "react";

interface Order {
  id: number;
  orderNumber: string;
  email: string;
  items: OrderItem[];
  total: number;
  date: string; // ISO date string
  shippingAddress: string;
  paymentStatus: string;
  deliveryStatus: string;
}
interface OrderItem {
  skuCode: string;
  quantity: number;
}

function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await fetchAllOrders();
        setOrders(allOrders);

        // Filter recent orders (e.g., last 7 days)
        const now = new Date();
        const recent = allOrders.filter((order: Order) => {
          const orderDate = new Date(order.date); // Assuming the date field is `date`
          return (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24) <= 7; // Last 7 days
        });
        setRecentOrders(recent);
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    };

    loadOrders();
  }, []);

  return (
    <div>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Date</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.length > 0 ? (
            recentOrders.map((order:Order) => (
              <tr key={order.id} className="border-b">
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="p-3">${order.total.toFixed(2)}</td>
                <td className="p-3">
                <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  order.deliveryStatus === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                  ${
                  order.deliveryStatus === "CANCELED"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                ${
                  order.deliveryStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  order.deliveryStatus === "SHIPPED"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }
              `}
              >
                {order.deliveryStatus}
              </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center" colSpan={5}>
                No recent orders
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrdersTable;
