"use client";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoAdd } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  createCategory,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
} from "../api/v1/products/route";
import { Category, Product } from "@/Type";

const products: Product[] = [
  {
    id: "1",
    name: "Nike Air Max",
    skuCode: "NKAMX-001",
    category: "Shoes",
    price: 199.99,
    stock: 45,
    status: "In Stock",
    brand: "Nike",
    last_updated: "2021-10-01",
    description:
      "The Nike Air Max is a classic sneaker that never goes out of style.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    skuCode: "SGS24-001",
    category: "Electronics",
    price: 999.99,
    stock: 5,
    status: "Low Stock",
    brand: "Samsung",
    last_updated: "2021-10-01",
    description:
      "The Samsung Galaxy S24 is the latest smartphone from Samsung.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "MacBook Pro",
    skuCode: "MBP-001",
    category: "Electronics",
    price: 1299.99,
    stock: 0,
    status: "Out of Stock",
    brand: "Apple",
    last_updated: "2021-10-01",
    description: "The MacBook Pro is a powerful laptop for professionals.",
    image: "https://via.placeholder.com/150",
  },
  // Add more sample products as needed
];

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sortProducts = (a: Product, b: Product) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  };
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      // Check if the search term matches the product name
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if the product matches the selected category (if a category is selected)
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // Return true only if both conditions are met
      return matchesSearchTerm && matchesCategory;
    })
    .sort(sortProducts);

  console.log("filteredProducts", filteredProducts);
  const handleSort = (column: keyof Product) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Low Stock":
        return "text-yellow-600";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "";
    }
  };

  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
    description: "",
    skuCode: "",
    brand: "",
    stock: "",
  });

  const [categoryFormValues, setCategoryFormValues] = useState({
    name: "",
    skuCode: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleSave = async () => {
    console.log(
      "Saving product........................................................."
    );
    console.log("Saving product:", formValues);
    try {
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: formValues.name,
        skuCode: formValues.name.toUpperCase().replace(" ", "-"),
        category: formValues.category,
        price: parseFloat(formValues.price),
        stock: parseInt(formValues.stock, 10),
        status: "availiable",
        last_updated: new Date().toISOString().split("T")[0],
        brand: formValues.brand,
        description: formValues.description,
        image: "https://via.placeholder.com/150",

        // stock: parseInt(formValues.stock, 10),
        // status:
        //   parseInt(formValues.stock, 10) === 0
        //     ? "Out of Stock"
        //     : parseInt(formValues.stock, 10) < 10
        //     ? "Low Stock"
        //     : "In Stock",
        // lastUpdated: new Date().toISOString().split("T")[0],
      };

      // Call the API to create the product
      await createProduct(newProduct);

      // Update local state
      products.push(newProduct);

      // Clear form fields
      setFormValues({
        id: "",
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        skuCode: "",
        brand: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCategorySave = async () => {
    console.log(
      "Saving category........................................................."
    );
    console.log("Saving category:", categoryFormValues);
    try {
      const newCategory: Category = {
        id: (products.length + 1).toString(),
        name: categoryFormValues.name,
        skuCode: categoryFormValues.name.toUpperCase().replace(" ", "-"),
      };

      // Call the API to create the category
      await createCategory(newCategory);

      // Update local state
      categories.push(newCategory);

      // Clear form fields
      setCategoryFormValues({
        skuCode: "",
        name: "",
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditClick = (id: string) => {
    // Find the product with the matching id
    const selectedProduct = products.find((product) => product.id === id);

    if (selectedProduct) {
      setFormValues({
        id: selectedProduct.id,
        name: selectedProduct.name || "",
        price: selectedProduct.price?.toString() || "0",
        category: selectedProduct.category || "",
        description: selectedProduct.description || "",
        skuCode: selectedProduct.skuCode || "",
        stock: selectedProduct.stock?.toString() || "0", // Fallback to "0" if stock is undefined
        brand: selectedProduct.brand || "",
      }); // Populate form fields with product details
      setIsEditDialogOpen(true); // Open the dialog
    }
  };

  const handleEditSave = async () => {
    console.log("Saving product:", formValues);
    try {
      const updatedProduct: Product = {
        id: formValues.id,
        name: formValues.name,
        skuCode: formValues.skuCode,
        category: formValues.category,
        price: parseFloat(formValues.price),
        stock: parseInt(formValues.stock, 10),
        last_updated: new Date().toISOString().split("T")[0],
        status:
          parseInt(formValues.stock, 10) === 0
            ? "Out of Stock"
            : parseInt(formValues.stock, 10) < 10
            ? "Low Stock"
            : "In Stock",
        brand: formValues.brand,
        description: formValues.description,
        image: "https://via.placeholder.com/150",
        // lastUpdated: new Date().toISOString().split("T")[0],
      };

      // Call the API to update the product
      // await updateProduct(updatedProduct);

      // Update local state
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      updateProduct(updatedProduct.id, updatedProduct);

      // Clear form fields
      setFormValues({
        id: "",
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        skuCode: "",
        brand: "",
      });

      setIsEditDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
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
                <Label htmlFor=" brand" className="text-right">
                  brand
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
      </div>

      <div className="flex justify-between items-center mb-6">
        <Dialog>
          <DialogTrigger asChild>
            {/* Button with custom styling */}
            <Button
              variant="outline"
              className="border-black bg-white text-black hover:bg-gray-200 ml-auto flex items-center gap-2"
            >
              <IoAddOutline /> Add Category {/* Icon and text */}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Enter Category and click save.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Category
                </Label>
                <Input
                  id="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCategorySave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Categories
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              key="all"
              onSelect={() => handleCategorySelect("all")}
            >
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.skuCode}
                onSelect={() => handleCategorySelect(category.skuCode)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg">
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
            {filteredProducts.map((product) => (
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
                <TableCell>{product.last_updated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleEditClick(product.id)}
                      >
                        Edit
                      </DropdownMenuItem>

                      {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={async () => {
                          await deleteProduct(product.id);
                          setProducts(
                            products.filter((p) => p.id !== product.id)
                          );
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
                              handleInputChange(
                                e as React.ChangeEvent<HTMLSelectElement>
                              )
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
