import axiosInstance from "@/lib/axiosInstance"; 

export const fetchWarehouses = async () => {
    try {
        
        const response = await axiosInstance.get("v1/inventory/warehouse"); 
        return response.data; 
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        throw error;
    }
};

export const addWarehouse = async (warehouse: {
    name: string;
    address: string;
    managerName: string;
}) => {
    try {
        const response = await axiosInstance.post("/warehouses", warehouse);
        return response.data;
    } catch (error) {
        console.error("Error adding warehouse:", error);
        throw error;
    }
};

export const deleteWarehouse = async (id: string) => {
    try {
        await axiosInstance.delete(`/warehouses/${id}`);
    } catch (error) {
        console.error("Error deleting warehouse:", error);
        throw error;
    }
};