import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoAddOutline } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface AddProductProps {
  formValues: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSave: () => void;
  categories: { skuCode: string; name: string }[];
  products: {
    name: string;
    skuCode: string;
    category: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    updatedAt: String;
  }[];
}

const AddProduct: React.FC<AddProductProps> = ({
  formValues,
  handleInputChange,
  handleSave,
  categories,
  products,
}) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.skuCode) newErrors.skuCode = "SKU Code is required";
    if (!formValues.category) newErrors.category = "Category is required";
    if (!formValues.brand) newErrors.brand = "Brand is required";
    if (!formValues.description)
      newErrors.description = "Description is required";
    if (!formValues.price) {
      newErrors.price = "Price is required";
    } else if (Number(formValues.price) <= 0) {
      newErrors.price = "Price must be a positive value";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Check if the SKU code already exists in the products array
    const isSkuCodeExists = products.some(
      (product) => product.skuCode === formValues.skuCode
    );
  
    if (isSkuCodeExists) {
      toast.error("SKU Code already exists!");
      return;
    }
  
    // Validate the form fields
    if (validate()) {
      handleSave();
      toast.success("Product added successfully!");
    } else {
      toast.error("Please fill in all required fields.");
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-black text-white">
          <IoAddOutline /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Enter product details and click save.
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
              onChange={handleInputChange}
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

        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
