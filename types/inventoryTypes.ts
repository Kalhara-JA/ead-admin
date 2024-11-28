// Types/inventory.ts
export interface InventoryItem {
    id: string;
    productId: string;
    quantity: number;
    location: string;
    minimumStockLevel: number;
    maximumStockLevel: number;
    reorderPoint: number;
    lastRestockDate: Date;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    unitCost: number;
    supplierInfo?: {
      supplierId: string;
      leadTime: number;
      preferredSupplier: boolean;
    };
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


