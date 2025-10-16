"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { createOrder, getProductById, type ShippingAddress, type OrderItem } from "@/lib/database";

interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  notes: string;
  paymentMethod: 'qr_code' | 'card' | 'upi' | 'cash_on_delivery';
  transactionId: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: cartState, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    notes: "",
    paymentMethod: "cash_on_delivery",
    transactionId: "",
  });

  // Check if this is a buy now flow
  const isBuyNow = searchParams.get('buyNow') === 'true';
  const buyNowProductId = searchParams.get('productId');
  const buyNowQuantity = parseInt(searchParams.get('quantity') || '1');

  useEffect(() => {
    // If cart is empty and not buy now, redirect to products
    if (!isBuyNow && cartState.items.length === 0) {
      router.push('/products');
    }

    // If buy now, fetch the product
    if (isBuyNow && buyNowProductId) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(buyNowProductId);
          setBuyNowProduct(product);
        } catch (error) {
          console.error("Error fetching product:", error);
          router.push('/products');
        }
      };
      fetchProduct();
    }
  }, [cartState.items, isBuyNow, buyNowProductId, router]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateAddressForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    // Phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    setLoading(true);

    try {
      // Prepare shipping address
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
      };

      // Prepare order items
      let orderItems: OrderItem[] = [];
      let orderSubtotal = 0;

      if (isBuyNow && buyNowProduct) {
        // Single product purchase
        orderItems = [{
          productId: buyNowProduct.id,
          productName: buyNowProduct.name,
          productImage: buyNowProduct.images?.[0] || '',
          price: buyNowProduct.price,
          quantity: buyNowQuantity,
          total: buyNowProduct.price * buyNowQuantity,
        }];
        orderSubtotal = buyNowProduct.price * buyNowQuantity;
      } else {
        // Cart items
        orderItems = cartState.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images?.[0] || '',
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        }));
        orderSubtotal = cartState.total;
      }

      // Create order data - all orders are now pre-orders
      const orderData: any = {
        items: orderItems,
        subtotal: orderSubtotal,
        shipping: 0, // No shipping for pre-orders
        tax: 0, // No tax for pre-orders
        total: orderSubtotal,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: 'cash_on_delivery' as const,
        shippingAddress,
        notes: `ORDER REQUEST: Customer wants to order these products. Contact customer at ${formData.phone} to confirm order and arrange delivery. Customer notes: ${formData.notes || 'None'}`,
      };

      const newOrderId = await createOrder(orderData);
      setOrderId(newOrderId);
      
      // Clear cart
      clearCart();
      
      setStep(2);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrors({ submit: "Failed to submit order request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    
    if (isBuyNow && buyNowProduct) {
      subtotal = buyNowProduct.price * buyNowQuantity;
    } else {
      subtotal = cartState.total;
    }

    return { subtotal };
  };

  const { subtotal } = calculateTotals();





  if (step === 2 && orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Interest!</h1>
              <p className="text-lg text-gray-600 mb-6">
                We've received your order request and will reach out to you within some time to confirm your order and arrange delivery.
              </p>
            </div>

            <Card className="mb-8 text-left">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">What happens next?</h3>
                      <p className="text-sm text-gray-600">Our team will contact you to confirm your order details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Personal Contact</h3>
                      <p className="text-sm text-gray-600">We'll call you at {formData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Delivery Arrangement</h3>
                      <p className="text-sm text-gray-600">We'll arrange delivery to your address after confirmation</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Payment</h3>
                      <p className="text-sm text-gray-600">Pay when you receive your order (Cash on Delivery)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Request ID:</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {orderId}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Total:</span>
                    <span className="text-xl font-bold text-blue-600">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Contact Number:</span>
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Expected timeframe:</strong> We typically contact customers within 2-4 hours during business hours. 
                We'll confirm your order and arrange delivery at your convenience!
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/products')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse More Products
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>+91 8302676869</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>info@igtharvillage.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email address"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        placeholder="House/Flat No., Building Name"
                        className={errors.addressLine1 ? "border-red-500" : ""}
                      />
                      {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                        placeholder="Area, Street, Locality"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter city"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="Enter state"
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          placeholder="Enter pincode"
                          className={errors.pincode ? "border-red-500" : ""}
                        />
                        {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange("landmark", e.target.value)}
                        placeholder="Nearby landmark (optional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Special instructions for delivery"
                        rows={3}
                      />
                    </div>

                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      size="lg"
                    >
                      {loading ? "Submitting..." : "Submit Order Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}


          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {isBuyNow && buyNowProduct ? (
                    // Single product for buy now
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12">
                        {buyNowProduct.images?.[0] ? (
                          <Image
                            src={buyNowProduct.images[0]}
                            alt={buyNowProduct.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{buyNowProduct.name}</h4>
                        <p className="text-xs text-gray-500">
                          ₹{buyNowProduct.price} × {buyNowQuantity}
                        </p>
                      </div>
                      <span className="font-medium">₹{buyNowProduct.price * buyNowQuantity}</span>
                    </div>
                  ) : (
                    // Cart items
                    cartState.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">
                            ₹{item.product.price} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Estimated Total</span>
                    <span className="text-blue-600">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Final amount will be confirmed when we contact you
                  </p>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">We'll Contact You</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Within 2-4 hours to confirm your order
                  </p>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Secure checkout with SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
