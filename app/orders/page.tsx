"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, ArrowDown, ArrowUp, CircleAlert, CircleX, ClockAlert, MoreVertical, Package, PackageCheck, PackageX, RotateCcw, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { fetchAllOrders } from '@/services/orderService'

interface Order {
  id: number;
  orderNumber: string;
  email: string;
  items: OrderItem[];
  total: number;
  date: string; // ISO date string
  shippingAddress: string;
  paymentStatus: string;
  deliveryStatus: string;
}

interface OrderItem {
  skuCode: string;
  quantity: number;
}





function OrderPage() {

  const router = useRouter();
  
  const handleNavigation = (orderNumber:string) => {
    router.push(`/orders/${orderNumber}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders,setOrders] =useState<Order[]>([]);
  const[loading,setLoading] = useState(false);
  const[deliveryStatus,setDeliveryStatus] = useState<string>('all');
  const[paymentStatus,setPaymentStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const[searchDate,setSearchDate] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      console.log(response);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  const filteredOrders = orders.filter((item) => {
    const matchesSearch =
      item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = item.date.includes(searchDate);
    const matchesPayments=
      !paymentStatus ||
      paymentStatus === "all" ||
      item.paymentStatus === paymentStatus;
    const matchesDelivery =
      !deliveryStatus ||
      deliveryStatus === "all" ||
      item.deliveryStatus === deliveryStatus;
    return matchesPayments && matchesDelivery && matchesSearch && matchesDate;
  });

  



  useEffect(() => {
    fetchOrders();
  }, []);

  return (

    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-5">
            Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">
            Canceled Orders
            </CardTitle>
          <PackageX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((order=> order.paymentStatus=="CANCELED")).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">
            Unpaid Orders
            </CardTitle>
           <CircleAlert className="h-4 w-4  text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((order=> order.paymentStatus=="UNPAID")).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">
            Awaiting Shipment
            </CardTitle>
            <ClockAlert className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((order=> order.deliveryStatus=="PENDING")).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-10">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((order=> order.deliveryStatus=="SHIPPED")).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">Delivered Orders</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.filter((order=> order.deliveryStatus=="DELIVERED")).length}</div>
          </CardContent>
        </Card>
      </div>
    
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by order number or user email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
            <Input
        type="date"
        value={searchDate}
        onChange={(e) =>setSearchDate(e.target.value)}
        className="w-35"
      />
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="By payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="PAID">PAID</SelectItem>
              <SelectItem value="UNPAID">UNPAID</SelectItem>
              <SelectItem value="CANCEL">CANCEL</SelectItem>
            </SelectContent>
          </Select>

          <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="By Delivery Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
      </div>
      <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order No</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Bill Value</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Delivery Status</TableHead>
          <TableHead colSpan={2}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.orderNumber}</TableCell>
            <TableCell>
  <a
    href={`mailto:${item.email}`}
    className="text-blue-500 no-underline hover:underline truncate"
    title={item.email}
  >
    {item.email}
  </a>
</TableCell>



            <TableCell>{item.date}</TableCell>
            <TableCell>{item.total}</TableCell>
            <TableCell >
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  item.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                ${
                  item.paymentStatus === "CANCELED"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                ${
                  item.paymentStatus === "UNPAID"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
              `}
              >
                {item.paymentStatus}
              </div>
            </TableCell>
            <TableCell >
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  item.deliveryStatus === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                  ${
                  item.deliveryStatus === "CANCELED"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                ${
                  item.deliveryStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  item.deliveryStatus === "SHIPPED"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }
              `}
              >
                {item.deliveryStatus}
              </div>
            </TableCell>
            {/* <TableCell>
              <Button variant="outline" size="sm">
               
                Change Status
              </Button>

            </TableCell>  */}
            <TableCell>
              <Button variant="outline" size="sm" onClick={()=>handleNavigation(item.orderNumber)}>
                <MoreVertical className="h-4 w-4 mr-2" />
                More
              </Button>
              {/* <OrderModel isModalOpen={isModalOpen} openModal={openModal} closeModal={closeModal} orderprop={item}/> */}
            </TableCell> 
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  
  
  </div>
  
  )
}

export default OrderPage