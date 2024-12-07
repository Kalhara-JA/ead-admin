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
        const response = await axiosInstance.post("/v1/inventory/warehouse", warehouse);
        return response.data;
    } catch (error) {
        console.error("Error adding warehouse:", error);
        throw error;
    }
};

export const deleteWarehouse = async (id: string) => {
    try {
        await axiosInstance.delete(`/v1/inventory/warehouse/${id}`);
    } catch (error) {
        console.error("Error deleting warehouse:", error);
        throw error;
    }
};

export const updateWarehouse = async (id: string , warehouse:{
    name: string;
    address: string;
    managerName: string;
}) => {
    try {
        const response = await axiosInstance.put(`/v1/inventory/warehouse/${id}` , warehouse);
        return response.data;
    } catch (error) {
        console.error("Error deleting warehouse:", error);
        throw error;
    }
};

