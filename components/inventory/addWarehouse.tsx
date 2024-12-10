import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button"; // shadcn Button component
import { Warehouse } from "@/types/inventoryTypes";
import toast from "react-hot-toast";

interface AddWarehouseProps {
  inventoryItem: { id: string; location?: string };
  warehouses: Warehouse[];
  onUpdateWarehouse: (updatedItem: { id: string; location: string }) => void;
}

const AddWarehouse: React.FC<AddWarehouseProps> = ({
  inventoryItem,
  warehouses,
  onUpdateWarehouse,
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(inventoryItem.location?.toString() || "Unknown");

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (inventoryItem.location === selectedWarehouse) {
      toast.error(`Warehouse "${selectedWarehouse}" is already assigned to this product.`);
    } else {
      toast.success(
        `Warehouse changed from "${
          inventoryItem.location || "none"
        }" to "${selectedWarehouse}".`
      );
      console.log(inventoryItem.id,selectedWarehouse);
      onUpdateWarehouse({ id: inventoryItem.id, location:selectedWarehouse });
    }

  };

  return (
    <div>
      {/* Dialog Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          {inventoryItem.location == "Unknown" ? (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400 hover:cursor-pointer">
              Add Warehouse
            </div>
          ) : (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400 hover:cursor-pointer">
              {selectedWarehouse}
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Warehouse</DialogTitle>
          </DialogHeader>
          {/* Form inside the Dialog */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Select Dropdown */}
            <div>
              <label
                htmlFor="select-warehouse"
                className="block text-sm font-medium text-gray-700"
              >
                Select Warehouse
              </label>
              <Select onValueChange={(value) => setSelectedWarehouse(value)}>
                <SelectTrigger id="select-warehouse">
                  <SelectValue
                    placeholder={
                      inventoryItem.location === "Unknown"
                        ? "Choose a warehouse"
                        : inventoryItem.location
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse, index) => (
                    <SelectItem key={warehouse.id} value={warehouse.name}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddWarehouse;
