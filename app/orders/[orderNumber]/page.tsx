"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Truck, CheckCircle, Loader, AlertTriangle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
//import "./OrderDetailsPage.css"; // Import custom CSS for scroll styling
import toast, { Toaster } from 'react-hot-toast';
import { deliverOrderById, fetchOrderByOrderNumber, shipOrderById } from "@/services/orderService";

interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  date: string;
  shippingAddress: string;
  paymentStatus: string;
  deliveryStatus: string;
  email: string;
}

interface OrderItem {
  skuCode: string;
  quantity: number;
}

function OrderDetailsPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>();
  const [isShipModalOpen, setIsshipModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"DELIVERED" | "PENDING" | "SHIPPED" | null>(null);
 

  const loadOrderData = async () => {
    try {
      const data = await fetchOrderByOrderNumber(params.orderNumber);
      console.log("Fetched order data: ", data);
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order data:", err);
    }
  };

  const deliverOrder = async (id?: number) => {
    try {
      if(id==undefined) return;
      const data = await deliverOrderById(id);
      toast.success(data);
      loadOrderData();
    } catch (err:any) {
      if(err.response)
      toast.error(` ${err.response.data}`);
    }
  }

  const shipOrder = async (id?: number) => {
    try {
      if(id==undefined) return;
      const data = await shipOrderById(id);
      toast.success(data);
      loadOrderData();
    } catch (err:any) {
      if(err.response)
      toast.error(` ${err.response.data}`);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, []);

 

  const handleBackClick = () => {
    router.back();
  };

 

  const openConfirmationModal = (status: "DELIVERED" | "PENDING" | "SHIPPED") => {
    if(status=="DELIVERED")
      setIsDeliverModalOpen(true);
    else if(status=="SHIPPED")
      setIsshipModalOpen(true);
  };

  const closeModal = () => {
    setIsDeliverModalOpen(false);
    setIsshipModalOpen(false);
  };

  return (
    
    <div className="order-details-page h-full w-full p-8 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <Toaster />
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <CircleArrowLeft
          className="w-6 h-6 text-gray-600 cursor-pointer mr-4"
          onClick={handleBackClick}
          aria-label="Back"
        />
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
      </div>
      <hr className="mb-6 border-gray-200" />

      {/* Scrollable Order Details Section */}
      <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar">
        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="font-sm text-gray-600">Order No:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.orderNumber}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Email:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.email}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Bill Value:</p>
            <p className="text-sm font-semibold text-gray-600">${order?.total}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Date:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.date}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Payment Status:</p>
            <p
              className={`text-sm font-semibold ${
                order?.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
              }`}
            >
              {order?.paymentStatus}
            </p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Shipping Address:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.shippingAddress}</p>
          </div>
        </div>

<br/>
        {/* Status Update Buttons */}
        <div className="mb-8">
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Delivery Status</h3> */}
          {order && order.paymentStatus=="PAID" &&
          <div className="flex space-x-4 w-full ">
            <Button className="flex-grow" variant="outline" size="sm" onClick={() => openConfirmationModal("PENDING")} disabled={order?.deliveryStatus=="PENDING"|| order?.deliveryStatus=="DELIVERED"||order?.deliveryStatus=="SHIPPED" }>
              {(order?.deliveryStatus=="PENDING" || order?.deliveryStatus=="SHIPPED" || order?.deliveryStatus=="DELIVERED") ?<CheckCircle className="h-4 w-4 mr-2 text-green-500" />:<LoaderCircle className="h-4 w-4 mr-2 text-blue-500" />}
              Pending
            </Button>
            <Button className="flex-grow" variant="outline" size="sm" onClick={() => openConfirmationModal("SHIPPED")} disabled={order?.deliveryStatus=="DELIVERED" || order?.deliveryStatus=="SHIPPED" }>
            {(order?.deliveryStatus=="SHIPPED" || order?.deliveryStatus=="DELIVERED" ) ?<CheckCircle  className="h-4 w-4 mr-2 text-green-500" />:<LoaderCircle className="h-4 w-4 mr-2 text-blue-500" />}
              Shipped
            </Button>
            <Button className="flex-grow" variant="outline" size="sm" onClick={() => openConfirmationModal("DELIVERED")} disabled={order?.deliveryStatus=="DELIVERED"}>
            {order?.deliveryStatus=="DELIVERED"  ?<CheckCircle className="h-4 w-4 mr-2 text-green-500" />:<LoaderCircle className="h-4 w-4 mr-2 text-blue-500" />}
              Delivered
            </Button>
          
          </div>
}
        </div>

        {/* Modal */}
        {isDeliverModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Status Change</h3>
              <p className="text-gray-700 mb-6">
                Are you sure order is <span className="font-semibold text-gray-900">Delivered</span>?
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={() => {deliverOrder(order?.id);closeModal()}}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
         {isShipModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Status Change</h3>
              <p className="text-gray-700 mb-6">
                Are you sure order is <span className="font-semibold text-gray-900">Shipped</span>?
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={() => {shipOrder(order?.id);closeModal()}}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

      

          {/* Order Items Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-lg shadow-inner p-4">
            <ul className="divide-y divide-gray-200">
              {order?.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 px-2 bg-white hover:bg-gray-100 rounded-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-700">SKU:</p>
                    <p className="text-gray-900">{item.skuCode}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Quantity:</p>
                    <p className="text-gray-900">{item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

  );
}

export default OrderDetailsPage;
