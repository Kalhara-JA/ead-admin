import { Inventory, InventoryItem, StockUpdate } from "@/types/inventoryTypes";

import axiosInstance from "@/lib/axiosInstance";

// Fetch all inventory items
export const fetchInventory = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/all`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Fetch a single inventory item by ID
export const fetchInventoryById = async (inventoryId: string) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/${inventoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    throw error;
  }
};

export const restockInventory = async (skuCode: string, quantity: number) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/restock`,
      null,
      {
        params: {
          skuCode,
          quantity,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error restocking inventory item:", error);
    throw error;
  }
};

// Create new inventory item
export const createInventoryItem = async (item: InventoryItem) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory`,
      item
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw error;
  }
};

// Update inventory item
export const updateInventoryItem = async (
  inventoryId: string,
  updates: Partial<InventoryItem>
) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/${inventoryId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

// Update stock levels
export const updateStockLevel = async (stockUpdate: StockUpdate) => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/${stockUpdate.inventoryId}/stock`,
      stockUpdate
    );
    return response.data;
  } catch (error) {
    console.error("Error updating stock level:", error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (inventoryId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/${inventoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};

// Check stock availability
export const checkStockAvailability = async (inventoryId: string) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/${inventoryId}/availability`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking stock availability:", error);
    throw error;
  }
};

// Batch update inventory items
export const batchUpdateInventory = async (updates: Partial<InventoryItem>[]) => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/batch`,
      { items: updates }
    );
    return response.data;
  } catch (error) {
    console.error("Error performing batch update:", error);
    throw error;
  }
};

export const updateInventoryWarehouse = async (updatedItem:Partial<InventoryItem>) => {
  const skuCode = updatedItem.id;
  const location = updatedItem.location;
  console.log(skuCode, location);
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/change-warehouse` ,null,
      {
        params: {
          skuCode,
          location
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating inventory warehouse:", error);
    throw error;
  }
  
}
