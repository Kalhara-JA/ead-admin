
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { IoAddOutline } from "react-icons/io5";

interface AddProductProps {
  formValues: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSave: () => void;
  categories: { skuCode: string; name: string }[];
}

const AddProduct: React.FC<AddProductProps> = ({
  formValues,
  handleInputChange,
  handleSave,
  categories,
}) => {
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skuCode" className="text-right">
              skuCode
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
              onChange={handleInputChange}
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
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
