import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Product } from "@/Type";

interface ProductTableProps {
  products: Product[];
  categories: { name: string; skuCode: string }[];
  deleteProduct: (id: String) => Promise<void>;
  handleSort: (key: keyof Product) => void;
  getStatusColor: (status: string) => string;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  deleteProduct,
  handleSort,
  getStatusColor,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<Product | null>(null);

  const handleEditClick = (productId: String) => {
    const product = products.find((p) => p.id === productId);
    if (product) setFormValues(product);
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formValues) return;
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleEditSave = () => {
    // Save logic here
    setIsEditDialogOpen(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            onClick={() => handleSort("name")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead
            onClick={() => handleSort("price")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("stock")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Stock
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <span className={getStatusColor(product.status)}>
                {product.status}
              </span>
            </TableCell>
            <TableCell>{product.updatedAt}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditClick(product.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={async () => {
                      await deleteProduct(product.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog
                open={isEditDialogOpen}
                onOpenChange={(isOpen) => setIsEditDialogOpen(isOpen)}
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
                        value={formValues?.name || ""}
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
                        value={formValues?.skuCode || ""}
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
                        value={formValues?.category || ""}
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
                        value={formValues?.brand || ""}
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
                        value={formValues?.description || ""}
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
                        value={formValues?.price || ""}
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
                        value={formValues?.stock || ""}
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
