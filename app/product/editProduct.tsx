import React, { useState } from "react";
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
import toast from "react-hot-toast";

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
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formValues.name) newErrors.name = "Name is required.";
    if (!formValues.skuCode) newErrors.skuCode = "SKU Code is required.";
    if (!formValues.category) newErrors.category = "Category is required.";
    if (!formValues.brand) newErrors.brand = "Brand is required.";
    if (!formValues.description)
      newErrors.description = "Description is required.";
    if (!formValues.price && formValues.price !== 0) {
      newErrors.price = "Price is required.";
    } else if (Number(formValues.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }
    if (!formValues.stock && formValues.stock !== 0) {
      newErrors.stock = "Stock is required.";
    } else if (Number(formValues.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      handleEditSave();
      toast.success("Product updated successfully!");
    } else {
      toast.error("Please fix the validation errors.");
    }
  };

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(isOpen: boolean) => setIsEditDialogOpen(isOpen)}
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
            {errors.name && (
              <p className="col-span-4 text-red-500">{errors.name}</p>
            )}
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
            {errors.skuCode && (
              <p className="col-span-4 text-red-500">{errors.skuCode}</p>
            )}
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
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.skuCode}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="col-span-4 text-red-500">{errors.category}</p>
            )}
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
            {errors.brand && (
              <p className="col-span-4 text-red-500">{errors.brand}</p>
            )}
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
            {errors.description && (
              <p className="col-span-4 text-red-500">{errors.description}</p>
            )}
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
            {errors.price && (
              <p className="col-span-4 text-red-500">{errors.price}</p>
            )}
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
            {errors.stock && (
              <p className="col-span-4 text-red-500">{errors.stock}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
