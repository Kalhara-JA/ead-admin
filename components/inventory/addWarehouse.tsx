import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // shadcn Select component

import { ALargeSmall } from 'lucide-react';
import { Button } from '@/components/ui/button'; // shadcn Button component

const AddWarehouse: React.FC = () => {
  const [warehouseName, setWarehouseName] = useState<string>('');
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  // Fetch warehouses
  useEffect(() => {
    // Simulating an API call to fetch warehouses
    const fetchWarehouses = async () => {
      const fetchedWarehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C']; // Replace with your API call
      setWarehouses(fetchedWarehouses);
    };

    fetchWarehouses();
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedWarehouse.trim()) {
      alert(`Warehouse "${selectedWarehouse}" selected successfully!`);
      setSelectedWarehouse('');
    }
  };

  return (
    <div>
      {/* Dialog Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-500 text-white hover:bg-green-600">
            Add Warehouse
          </Button>
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
              <Select
                onValueChange={(value) => setSelectedWarehouse(value)}
              >
                <SelectTrigger id="select-warehouse">
                  <SelectValue placeholder="Choose a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse, index) => (
                    <SelectItem key={index} value={warehouse}>
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-green-500 text-white hover:bg-green-600">
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
