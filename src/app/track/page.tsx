"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search,
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import { getOrderByNumber, type Order } from "@/lib/database";

const orderStatusConfig = {
  pending: {
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    label: "Order Pending",
    description: "Your order is being processed"
  },
  confirmed: {
    icon: CheckCircle,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    label: "Order Confirmed",
    description: "Your order has been confirmed"
  },
  processing: {
    icon: Package,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    label: "Processing",
    description: "Your order is being prepared"
  },
  shipped: {
    icon: Truck,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    label: "Shipped",
    description: "Your order is on the way"
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    label: "Delivered",
    description: "Your order has been delivered"
  },
  cancelled: {
    icon: AlertCircle,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    label: "Cancelled",
    description: "Your order has been cancelled"
  }
};

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
      handleTrackOrder(orderParam);
    }
  }, [searchParams]);

  const handleTrackOrder = async (orderNo?: string) => {
    const orderToTrack = orderNo || orderNumber;
    if (!orderToTrack.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const orderData = await getOrderByNumber(orderToTrack.trim());
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Order not found. Please check your order number and try again.');
        setOrder(null);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = async () => {
    if (order) {
      try {
        await navigator.clipboard.writeText(order.orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy order number:', error);
      }
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.indexOf(order.status);
  };

  const getStatusConfig = (status: string) => {
    return orderStatusConfig[status as keyof typeof orderStatusConfig] || orderStatusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order number to track your package</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="orderNumber" className="sr-only">Order Number</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order number (e.g., IG123456ABC)"
                    className="text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  />
                </div>
                <Button 
                  onClick={() => handleTrackOrder()}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Details
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-mono">{order.orderNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyOrderNumber}
                          className="h-6 w-6 p-0"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{order.total}</div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Order Date</p>
                        <p className="text-sm text-gray-600">
                          {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-sm text-gray-600">
                          {order.estimatedDelivery?.toLocaleDateString() || 'TBD'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Tracking Number</p>
                        <p className="text-sm text-gray-600">
                          {order.trackingNumber || 'Not assigned yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Status Badge */}
                    <div className="flex items-center justify-center">
                      <div className={`${getStatusConfig(order.status).bgColor} px-6 py-3 rounded-full`}>
                        <div className="flex items-center gap-3">
                          {React.createElement(getStatusConfig(order.status).icon, {
                            className: `h-6 w-6 ${getStatusConfig(order.status).textColor}`
                          })}
                          <div>
                            <p className={`font-semibold ${getStatusConfig(order.status).textColor}`}>
                              {getStatusConfig(order.status).label}
                            </p>
                            <p className={`text-sm ${getStatusConfig(order.status).textColor}`}>
                              {getStatusConfig(order.status).description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {statusSteps.map((status, index) => {
                          const config = getStatusConfig(status);
                          const isCompleted = index <= getCurrentStepIndex();
                          const isCurrent = index === getCurrentStepIndex();
                          
                          return (
                            <div key={status} className="flex flex-col items-center relative">
                              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                                isCompleted 
                                  ? `${config.color} border-transparent text-white` 
                                  : 'border-gray-300 bg-white text-gray-400'
                              }`}>
                                {React.createElement(config.icon, { className: "h-5 w-5" })}
                              </div>
                              <div className="mt-2 text-center">
                                <p className={`text-xs font-medium ${
                                  isCurrent ? config.textColor : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {config.label}
                                </p>
                              </div>
                              
                              {/* Connecting Line */}
                              {index < statusSteps.length - 1 && (
                                <div className={`absolute top-5 left-10 w-20 h-0.5 ${
                                  index < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      {order.shippingAddress.landmark && (
                        <p>Landmark: {order.shippingAddress.landmark}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.shippingAddress.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.shippingAddress.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <Badge variant="outline" className="capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <Badge 
                        className={
                          order.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    {order.transactionId && (
                      <div className="flex justify-between">
                        <span>Transaction ID</span>
                        <span className="font-mono text-sm">{order.transactionId}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{order.tax}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-green-600">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
