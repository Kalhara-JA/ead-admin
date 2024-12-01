import { Inventory, InventoryItem, StockUpdate } from "@/types/inventoryTypes";

import axiosInstance from "@/lib/axiosInstance";

// Fetch all order items
export const fetchAllOrders = async () => {
    
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  };

// Fetch single order items
export const fetchOrderByOrderNumber = async (orderNumber:string) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Order:", error);
    throw error;
  }
};


// Deliver an order
export const deliverOrderById = async (orderid:number) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderid}/deliver`
    );
    return response.data;
  } catch (error:any) {
  
    throw error;
  }
};

// Deliver an order
export const shipOrderById = async (orderid:number) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderid}/ship`
    );
    return response.data;
  } catch (error:any) {
  
    throw error;
  }
};


