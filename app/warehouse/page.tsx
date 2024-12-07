"use client";

import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Package } from "lucide-react";
import {fetchWarehouses, addWarehouse, deleteWarehouse , updateWarehouse} from "@/services/warehouseService";
import { list } from "postcss";
import { Label } from "@/components/ui/label";

interface Warehouse {
  id: string;
  name: string;
  address: string;
  managerName: string;
  inventoryList: [];
}

export default function WarehouseDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    address: "",
    managerName: "",
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); 

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [warehouseToUpdate, setWarehouseToUpdate] = useState<Warehouse | null>(
    null
  );

  

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWarehouses();
        setWarehouses(data);
        console.log(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch warehouses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadWarehouses();
  }, []);

  const handleAddWarehouse = async () => {
    try {
        console.log(newWarehouse);
      const addedWarehouse = await addWarehouse(newWarehouse);
      setWarehouses([...warehouses, addedWarehouse]);
      setNewWarehouse({ name: "", address: "", managerName: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add warehouse:", error);
    }
  };

  const handleDeleteWarehouse = async () => {
    if (selectedWarehouse) {
      try {

        
        await deleteWarehouse(selectedWarehouse.id);
        setWarehouses(
          warehouses.filter((warehouse) => warehouse.id !== selectedWarehouse.id)
        );
        setSelectedWarehouse(null); // Reset selected warehouse after deletion
      } catch (error) {
        console.error("Failed to delete warehouse:", error);
      }
    }
  };
  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateWarehouse = async () => {
    if (warehouseToUpdate) {
      console.log(warehouseToUpdate);
      try {
        const { name, address, managerName } = warehouseToUpdate;
        const updatedWarehouseResponse = await updateWarehouse(
          warehouseToUpdate.id,
          {
            name,
            address,
            managerName,
          }
        );

        const updatedWarehouse: Warehouse = {
          id: updatedWarehouseResponse.id,
          name: updatedWarehouseResponse.name,
          address: updatedWarehouseResponse.address,
          managerName: updatedWarehouseResponse.managerName,
          inventoryList: updatedWarehouseResponse.inventoryList || [],
        };
        console.log("After updated in backend");
        console.log(updatedWarehouseResponse);
        setWarehouses((prev) =>
          prev.map((wh) =>
            wh.id == updatedWarehouse.id ? updatedWarehouse : wh
          )
        );
        setIsUpdateDialogOpen(false);
        setWarehouseToUpdate(null);
      } catch (error) {
        console.error("Failed to update warehouse:", error);
      }
    }
  };

  {warehouseToUpdate && (
    <Dialog
      open={isUpdateDialogOpen}
      onOpenChange={() => setIsUpdateDialogOpen(false)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Warehouse</DialogTitle>
          <DialogDescription>
            Modify the warehouse details and save changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="updateName" className="text-right">
              Name
            </Label>
            <Input
              id="updateName"
              value={warehouseToUpdate.name}
              onChange={(e) =>
                setWarehouseToUpdate((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="updateAddress" className="text-right">
              Address
            </Label>
            <Input
              id="updateAddress"
              value={warehouseToUpdate.address}
              onChange={(e) =>
                setWarehouseToUpdate((prev) =>
                  prev ? { ...prev, address: e.target.value } : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="updateManagerName" className="text-right">
              Manager
            </Label>
            <Input
              id="updateManagerName"
              value={warehouseToUpdate.managerName}
              onChange={(e) =>
                setWarehouseToUpdate((prev) =>
                  prev ? { ...prev, managerName: e.target.value } : null
                )
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsUpdateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button"
          //  onClick={handleUpdateWarehouse}
           >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )}
  

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between ">
        <div className=" grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <Card >
          <CardHeader>
            <CardTitle>Total Warehouses</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
          </CardContent>
        </Card>
        
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-black text-white" onClick={() => setIsAddDialogOpen(true)}>
              <IoAddOutline /> Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Warehouse</DialogTitle>
              <DialogDescription>
                Enter warehouse details and click save.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newWarehouse.name}
                  onChange={(e) =>
                    setNewWarehouse((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newWarehouse.address}
                  onChange={(e) =>
                    setNewWarehouse((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="managername" className="text-right">
                  Manager
                </Label>
                <Input
                  id="brand"
                  value={newWarehouse.managerName}
                  onChange={(e) =>
                    setNewWarehouse((prev) => ({
                      ...prev,
                      managerName: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddWarehouse}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.managerName}</TableCell>
                <TableCell>{warehouse.inventoryList ? warehouse.inventoryList.length : "0"}</TableCell>
                <TableCell>
                <Button
                className="mr-10"
                    variant="outline"
                    onClick={() => {
                      setWarehouseToUpdate(warehouse);
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedWarehouse(warehouse)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedWarehouse && (
        <Dialog open={!!selectedWarehouse} onOpenChange={() => setSelectedWarehouse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the warehouse{" "}
                <strong>{selectedWarehouse.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedWarehouse(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteWarehouse}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

{warehouseToUpdate && (
        <Dialog
          open={isUpdateDialogOpen}
          onOpenChange={() => setIsUpdateDialogOpen(false)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Warehouse</DialogTitle>
              <DialogDescription>
                Modify the warehouse details and save changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateName" className="text-right">
                  Name
                </Label>
                <Input
                  id="updateName"
                  value={warehouseToUpdate.name}
                  onChange={(e) =>
                    setWarehouseToUpdate((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="updateAddress"
                  value={warehouseToUpdate.address}
                  onChange={(e) =>
                    setWarehouseToUpdate((prev) =>
                      prev ? { ...prev, address: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateManagerName" className="text-right">
                  Manager
                </Label>
                <Input
                  id="updateManagerName"
                  value={warehouseToUpdate.managerName}
                  onChange={(e) =>
                    setWarehouseToUpdate((prev) =>
                      prev ? { ...prev, managerName: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button"
               onClick={handleUpdateWarehouse}
               >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
    </div>
  );
}
