import { Category, Product } from "@/Type";

import axiosInstance from "@/lib/axiosInstance";

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products`
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products/createCategory`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products/getAllCategories`
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${id}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Product) => {
  console.log("id", id);
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${id}`,
      product
    );
    console.log("updating..", response);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const updateImage = async (id: string, image: string) => {
  try {
    console.log("Updating image with ID:", id);
    console.log("Image URL:", image);
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/products/updateImage/${id}`,
      image, // Pass the string directly
      {
        headers: {
          "Content-Type": "text/plain", // Specify plain text if needed
        },
      }
    );
    console.log("Image update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
};

export const getQuantityOfAProduct = async (skuCode: string) => {
  console.log("skuCode", skuCode);
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/getProductQuantity/${skuCode}`
    );
    console.log(response);
    return response.data; // Axios stores the response data in `data`
  } catch (error) {
    console.error("Error fetching product quantity:", error);
    throw error;
  }
};
