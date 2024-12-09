// Types/inventory.ts
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  location: string;
  lastRestocked: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Overstock";
}
  
  export interface StockUpdate {
    inventoryId: string;
    quantity: number;
    type: 'increment' | 'decrement' | 'set';
    reason?: string;
    timestamp?: Date;
  }
  
  export interface Inventory {
    items: InventoryItem[];
    totalItems: number;
    lastUpdated: Date;
  }

  export interface Warehouse {
    id: string;
    name: string;
    address: string;
    managerName: string;
    inventoryList: [];
  }

  enum InventoryStatus {
    InStock = 'in_stock',
    LowStock = 'low_stock',
    OutOfStock = 'out_of_stock',
  }

  


