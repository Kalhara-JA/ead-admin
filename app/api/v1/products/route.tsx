import axiosInstance from "@/lib/axiosInstance";
import { Category, Product } from "@/Type";

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products`
    );
    console.log(response);
    return response.data; // Axios stores the response data in `data`
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (product: Product) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      product
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const createCategory = async (category: Category) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products/createCategory`,
      category
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/getAllCategories`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Product) => {
  console.log("idddddddddddddddddddd..................................................",id);
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      product
    );
    console.log("updatinggggg..................................................",response);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
