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
  updateImage,
  updateProduct,
} from "../../services/productService";
import { Category, Product } from "@/Type";
import AddProduct from "./addProduct";
import AddCategory from "./addCategory";
import EditProductDialog from "./editProduct";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { FaCloudUploadAlt } from "react-icons/fa";

const products: Product[] = [];

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
        console.error(
          "Error fetching categories:",
          error
        );
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
    updatedAt: "",
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
    console.log("id", id);
    console.log("value", value);
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
        updatedAt: new Date().toISOString().split("T")[0],
        brand: formValues.brand,
        description: formValues.description,
        image: "",

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
        updatedAt: "",
        brand: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCategorySave = async () => {
    console.log(
      "Saving category.."
    );
    console.log("Saving category:", categoryFormValues);
    try {
      const newCategory: Category = {
        id: (products.length + 1).toString(),
        name: categoryFormValues.name,
        skuCode: categoryFormValues.name.toUpperCase().replace(" ", "-"),
      };
      console.log("newCategory", newCategory);

      // Call the API to create the category
      await createCategory(newCategory);

      // Update local state
      categories.push(newCategory);

      // Clear form fields
      setCategoryFormValues({
        name: "",
        skuCode: "",
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
        updatedAt: selectedProduct.updatedAt || "",
      }); // Populate form fields with product details
      setIsEditDialogOpen(true); // Open the dialog
    }
  };

  const [image, setImage] = useState<string | null>(null);

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
        updatedAt: new Date().toISOString().split("T")[0],
        status:
          parseInt(formValues.stock, 10) === 0
            ? "Out of Stock"
            : parseInt(formValues.stock, 10) < 10
            ? "Low Stock"
            : "In Stock",
        brand: formValues.brand,
        description: formValues.description,
        image: image || "",
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
        updatedAt: "",
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
        <AddProduct
          formValues={formValues}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          categories={categories}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <AddCategory
          formValues={categoryFormValues}
          handleInputChange={(e) =>
            setCategoryFormValues({
              ...categoryFormValues,
              [e.target.id]: e.target.value,
            })
          }
          handleCategorySave={handleCategorySave}
        />
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

              {/* <TableHead>Status</TableHead>  */}
              <TableHead>Last Updated</TableHead>
              <TableHead
                onClick={() => handleSort("stock")}
                className="cursor-pointer"
              >
                <div className="flex items-center">Image</div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>

                {/* <TableCell>
                  <span className={getStatusColor(product.status)}>
                    {product.status}
                  </span>
                </TableCell>  */}
                <TableCell>{product.updatedAt}</TableCell>
                <TableCell>
                  {" "}
                  <CldUploadWidget
                    uploadPreset="peu0blg2"
                    onOpen={() => {
                      console.log("isPhotographer");
                    }}
                    onSuccess={(results: CloudinaryUploadWidgetResults) => {
                      const uploadedResult =
                        results.info as CloudinaryUploadWidgetInfo;
                      const profileImageURL = {
                        image: uploadedResult.secure_url,
                      };
                      console.log("profileImageURL", profileImageURL);
                      updateImage(product.id, profileImageURL.image);
                      setImage(profileImageURL.image);
                    }}
                    options={{
                      tags: ["organization image"],
                      sources: ["local"],
                      googleApiKey: "<image_search_google_api_key>",
                      showAdvancedOptions: false,
                      cropping: true,
                      multiple: false,
                      showSkipCropButton: false,
                      croppingAspectRatio: 0.75,
                      croppingDefaultSelectionRatio: 0.75,
                      croppingShowDimensions: true,
                      croppingCoordinatesMode: "custom",
                      defaultSource: "local",
                      resourceType: "image",
                      folder: "organization",
                      styles: {
                        palette: {
                          window: "#ffffff",
                          sourceBg: "#f4f4f5",
                          windowBorder: "#90a0b3",
                          tabIcon: "#000000",
                          inactiveTabIcon: "#555a5f",
                          menuIcons: "#555a5f",
                          link: "#000000",
                          action: "#000000",
                          inProgress: "#464646",
                          complete: "#000000",
                          error: "#cc0000",
                          textDark: "#000000",
                          textLight: "#fcfffd",
                          theme: "white",
                        },
                      },
                    }}
                  >
                    {({ open }) => (
                      <button
                        className=" border border-[#0c2735] rounded-2xl border-size-2"
                        type="button"
                        onClick={() => {
                          open();
                        }}
                      >
                        <div className="p-2 w-full   lg:w-full text-black font-semibold flex items-center justify-center gap-2 bg-[#ffffff]  rounded-2xl">
                          <FaCloudUploadAlt />
                          Upload Image
                        </div>
                      </button>
                    )}
                  </CldUploadWidget>
                </TableCell>
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

                  <EditProductDialog
                    isEditDialogOpen={isEditDialogOpen}
                    formValues={formValues}
                    categories={categories}
                    handleInputChange={handleInputChange}
                    handleEditSave={handleEditSave}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
