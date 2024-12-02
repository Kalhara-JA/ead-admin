"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Package,
  Plus,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchInventory, restockInventory } from "../api/inventory/route";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface InventoryItem {
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

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate inventory metrics
  const totalItems = inventoryData.reduce(
    (sum, item) => sum + item.currentStock,
    0
  );
  const lowStockItems = inventoryData.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const outOfStockItems = inventoryData.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const overstockItems = inventoryData.filter(
    (item) => item.status === "Overstock"
  ).length;

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      locationFilter === "all" ||
      item.location.toLowerCase().replace(" ", "-") === locationFilter;
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      item.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesLocation && matchesStatus;
  });
  const getStockLevelColor = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maximumStock) * 100;
    if (percentage === 0) return "bg-red-500";
    if (percentage < 30) return "bg-yellow-500";
    if (percentage > 90) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const transformBackendData = (data: any[]): InventoryItem[] => {
    return data.map((item) => ({
      id: item.id.toString(),
      sku: item.skuCode,
      name: item.skuCode.replace("_", " ").toUpperCase(), // Mocked name for display
      currentStock: item.quantity,
      minimumStock: 10, // Mocked minimum stock
      maximumStock: 100, // Mocked maximum stock
      reorderPoint: 20, // Mocked reorder point
      location: item.location,
      lastRestocked: "2024-11-01", // Mocked last restocked date
      status:
        item.status === "IN_STOCK"
          ? "In Stock"
          : item.quantity === 0
          ? "Out of Stock"
          : item.quantity > 90
          ? "Overstock"
          : "Low Stock",
    }));
  };

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rawData = await fetchInventory(); // Assumes this returns the backend object array
      const transformedData = transformBackendData(rawData);
      setInventoryData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory data");
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const restock=async (inventoryId:string,quantity:number) => {
    try{
      await restockInventory(inventoryId,quantity);
    }catch (err) {
      
    }
  }

  useEffect(() => {
    loadInventoryData();
    console.log("Inventory data loaded");
    console.log(inventoryData);
  }, []);

  

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overstock</CardTitle>
            <ArrowUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overstockItems}</div>
          </CardContent>
        </Card>
      </div>

      {lowStockItems > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {lowStockItems} items are running low on stock. Please review and
            reorder as needed.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="warehouse-a">Warehouse A</SelectItem>
              <SelectItem value="warehouse-b">Warehouse B</SelectItem>
              <SelectItem value="warehouse-c">Warehouse C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="overstock">Overstock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Sync Inventory
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="w-[200px]">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.currentStock}</span>
                      <span className="text-gray-500">
                        of {item.maximumStock}
                      </span>
                    </div>
                    <Progress
                      value={(item.currentStock / item.maximumStock) * 100}
                      className={getStockLevelColor(item)}
                    />
                  </div>
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      item.status === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      item.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    ${
                      item.status === "Out of Stock"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${
                      item.status === "Overstock"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                  `}
                  >
                    {item.status}
                  </div>
                </TableCell>
                <TableCell>{item.lastRestocked}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={()=>{
                    restock(item.sku,100)
                    
                  }}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


