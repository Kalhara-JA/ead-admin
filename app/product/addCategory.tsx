import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchCategories } from "@/services/productService"; // Adjust this path as necessary

interface AddCategoryProps {
  formValues: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategorySave: (category: string) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  formValues,
  handleInputChange,
  handleCategorySave,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateAndSaveCategory = async () => {
    try {
      console.log("Validating and saving category...");
      // Fetch all categories
      const categories = await fetchCategories();
      console.log("Categories:", categories);
  
      // Normalize input and check for duplicate
      const normalizedInput = formValues.name.trim().toLowerCase();
      console.log("Normalized input:", normalizedInput);
  
      // Check if the category name exists in the database
      const isDuplicate = categories.some(
        (category: { name: string }) => category.name.toLowerCase() === normalizedInput
      );
  
      if (isDuplicate) {
        setError("This category already exists.");
      } else {
        setError(null); // Clear any previous errors
        handleCategorySave(formValues.name);
      }
    } catch (error) {
      console.error("Error validating category:", error);
      setError("An error occurred while validating the category.");
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-black bg-white text-black hover:bg-gray-200 ml-auto flex items-center gap-2"
        >
          <IoAddOutline /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>Enter Category and click save.</DialogDescription>
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={validateAndSaveCategory}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
