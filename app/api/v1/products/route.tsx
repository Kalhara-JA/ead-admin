import { Product } from "@/Type";
import axios from "axios";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(
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
    const response = await axios.post(
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
