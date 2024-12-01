// EditProductDialog.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditProductDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  formValues: any;
  categories: Array<{ skuCode: string; name: string }>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleEditSave: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  formValues,
  categories,
  handleInputChange,
  handleEditSave,
}) => {
  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(isOpen:boolean) => setIsEditDialogOpen(isOpen)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details and click save.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formValues.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skuCode" className="text-right">
              SKU Code
            </Label>
            <Input
              id="skuCode"
              value={formValues.skuCode}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <select
              id="category"
              value={formValues.category}
              onChange={(e) =>
                handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)
              }
              className="col-span-3 border border-gray-300 rounded p-2"
            >
              {categories.map((category, index) => (
                <option key={index} value={category.skuCode}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brand" className="text-right">
              Brand
            </Label>
            <Input
              id="brand"
              value={formValues.brand}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              value={formValues.price}
              onChange={handleInputChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              value={formValues.stock}
              onChange={handleInputChange}
              className="col-span-3"
              type="number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleEditSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
