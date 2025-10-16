"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  LogOut,
  ShoppingBag,
  Bed,
  Mountain,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Heart,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { 
  getUserOrders, 
  getUserPropertyBookings, 
  getUserServiceBookings,
  type Order,
  type PropertyBooking,
  type ServiceBooking
} from "@/lib/database";

// Mock data - replace with actual API calls
const mockOrders = [
  {
    id: "ORD001",
    orderNumber: "IG2024001",
    type: "product",
    items: [
      {
        name: "Organic Desert Honey",
        image: "/images/products/honey.jpg",
        quantity: 2,
        price: 450
      }
    ],
    total: 900,
    status: "delivered",
    createdAt: new Date("2024-01-15"),
    deliveredAt: new Date("2024-01-20")
  },
  {
    id: "BOOK001",
    bookingNumber: "IG2024B001",
    type: "service",
    serviceName: "Desert Safari Experience",
    serviceImage: "/images/services/safari.jpg",
    total: 2500,
    status: "confirmed",
    bookingDate: new Date("2024-02-15"),
    createdAt: new Date("2024-01-25")
  },
  {
    id: "BOOK002",
    bookingNumber: "IG2024B002",
    type: "property",
    propertyName: "Traditional Mud House",
    propertyImage: "/images/properties/mudhouse.jpg",
    total: 3500,
    status: "pending",
    checkIn: new Date("2024-03-01"),
    checkOut: new Date("2024-03-03"),
    createdAt: new Date("2024-02-01")
  }
];

const mockWishlist = [
  {
    id: "1",
    name: "Organic Bajra Flour",
    image: "/images/products/bajra.jpg",
    price: 120,
    type: "product"
  },
  {
    id: "2",
    name: "Cultural Heritage Tour",
    image: "/images/services/culture.jpg",
    price: 1800,
    type: "service"
  }
];

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [propertyBookings, setPropertyBookings] = useState<PropertyBooking[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    
    if (user) {
      setUserProfile({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: "",
        address: ""
      });
      
      // Load user data
      loadUserData();
    }
  }, [user, loading, router]);

  const loadUserData = async () => {
    if (!user) return;
    
    setDataLoading(true);
    try {
      const [userOrders, userPropertyBookings, userServiceBookings] = await Promise.all([
        getUserOrders(user.uid),
        getUserPropertyBookings(user.uid),
        getUserServiceBookings(user.uid)
      ]);
      
      setOrders(userOrders);
      setPropertyBookings(userPropertyBookings);
      setServiceBookings(userServiceBookings);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account and view your orders</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{user.displayName || "User"}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "overview" ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "orders" ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      Orders & Bookings
                    </button>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "wishlist" ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "settings" ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {dataLoading ? "..." : orders.length}
                            </p>
                            <p className="text-sm text-gray-600">Total Orders</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {dataLoading ? "..." : propertyBookings.length + serviceBookings.length}
                            </p>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Star className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {dataLoading ? "..." : `₹${[...orders, ...propertyBookings, ...serviceBookings].reduce((sum, item) => sum + item.total, 0).toLocaleString()}`}
                            </p>
                            <p className="text-sm text-gray-600">Total Spent</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dataLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                              <div className="w-16 h-6 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {[...orders, ...propertyBookings, ...serviceBookings]
                            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                            .slice(0, 3)
                            .map((item) => {
                              const isOrder = 'orderNumber' in item;
                              const isPropertyBooking = 'checkIn' in item;
                              
                              return (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                    {isOrder ? (
                                      <ShoppingBag className="h-6 w-6 text-amber-600" />
                                    ) : isPropertyBooking ? (
                                      <Bed className="h-6 w-6 text-green-600" />
                                    ) : (
                                      <Mountain className="h-6 w-6 text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {isOrder 
                                        ? `Order ${(item as Order).orderNumber}` 
                                        : isPropertyBooking
                                        ? (item as PropertyBooking).propertyName
                                        : (item as ServiceBooking).serviceName
                                      }
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {format(item.createdAt, "MMM dd, yyyy")} • ₹{item.total.toLocaleString()}
                                    </p>
                                  </div>
                                  <Badge className={getStatusColor(item.status)}>
                                    {getStatusIcon(item.status)}
                                    <span className="ml-1 capitalize">{item.status}</span>
                                  </Badge>
                                </div>
                              );
                            })}
                          
                          {[...orders, ...propertyBookings, ...serviceBookings].length === 0 && (
                            <div className="text-center py-8">
                              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600">No recent activity</p>
                              <p className="text-sm text-gray-500">Your orders and bookings will appear here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Orders & Bookings</CardTitle>
                      <p className="text-sm text-gray-600">View and manage all your orders and bookings</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {order.type === "product" 
                                      ? `Order ${order.orderNumber}` 
                                      : order.type === "service"
                                      ? order.serviceName
                                      : order.propertyName
                                    }
                                  </h3>
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status}</span>
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Placed on {format(order.createdAt, "MMM dd, yyyy")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">₹{order.total}</p>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>

                            {order.type === "product" && order.items && (
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                      <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{item.name}</p>
                                      <p className="text-sm text-gray-600">Qty: {item.quantity} • ₹{item.price} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {order.type === "service" && (
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                                  <Mountain className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Experience Date</p>
                                  <p className="text-sm text-gray-600">{format(order.bookingDate!, "MMM dd, yyyy")}</p>
                                </div>
                              </div>
                            )}

                            {order.type === "property" && (
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center">
                                  <Bed className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Stay Duration</p>
                                  <p className="text-sm text-gray-600">
                                    {format(order.checkIn!, "MMM dd")} - {format(order.checkOut!, "MMM dd, yyyy")}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                      <p className="text-sm text-gray-600">Items you've saved for later</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockWishlist.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                {item.type === "product" ? (
                                  <Package className="h-8 w-8 text-gray-400" />
                                ) : (
                                  <Mountain className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-lg font-semibold text-amber-600">₹{item.price}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                    {item.type === "product" ? "Add to Cart" : "Book Now"}
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <p className="text-sm text-gray-600">Update your personal information</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input
                              id="displayName"
                              value={userProfile.displayName}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, displayName: e.target.value }))}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              value={userProfile.email}
                              disabled
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={userProfile.phone}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={userProfile.address}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Enter your address"
                          />
                        </div>

                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button onClick={() => setIsEditing(false)}>
                                Save Changes
                              </Button>
                              <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button onClick={() => setIsEditing(true)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Email Notifications</p>
                              <p className="text-sm text-gray-600">Receive updates about your orders</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Password</p>
                              <p className="text-sm text-gray-600">Change your account password</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}