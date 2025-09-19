"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  QrCode,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { createOrder, type ShippingAddress, type OrderItem } from "@/lib/database";

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

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: cartState, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [upiCopied, setUpiCopied] = useState(false);
  
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
    paymentMethod: "qr_code",
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
  }, [cartState.items, isBuyNow, router]);

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

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.paymentMethod === 'qr_code' || formData.paymentMethod === 'upi') {
      if (!formData.transactionId.trim()) {
        newErrors.transactionId = "Transaction ID is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddressForm()) {
      setStep(2);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartState.total;
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) return;

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
      const orderItems: OrderItem[] = cartState.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      // Calculate estimated delivery (7 days from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

      // Create order
      const orderData = {
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending' as const,
        paymentStatus: formData.paymentMethod === 'cash_on_delivery' ? 'pending' as const : 'completed' as const,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || undefined,
        shippingAddress,
        notes: formData.notes || undefined,
        estimatedDelivery,
        trackingUrl: `${window.location.origin}/track`,
      };

      const newOrderId = await createOrder(orderData);
      setOrderId(newOrderId);
      
      // Clear cart
      clearCart();
      
      setStep(3);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrors({ submit: "Failed to create order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText('igtharvillage@paytm');
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy UPI ID:', error);
    }
  };

  if (step === 3 && orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your order. We'll process it shortly.</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order ID:</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {orderId}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Delivery:</span>
                    <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={() => router.push(`/track?order=${orderId}`)}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Track Your Order
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/products')}
                className="w-full"
                size="lg"
              >
                Continue Shopping
              </Button>
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

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
              }`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            <div className={`w-12 h-px ${step > 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
              }`}>
                {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className={`w-12 h-px ${step > 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
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

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="qr_code" id="qr_code" />
                        <QrCode className="h-5 w-5 text-blue-600" />
                        <Label htmlFor="qr_code" className="flex-1 cursor-pointer">
                          QR Code Payment (Recommended)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          UPI Payment
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cash_on_delivery" id="cod" />
                        <Truck className="h-5 w-5 text-orange-600" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* QR Code Payment */}
                    {formData.paymentMethod === 'qr_code' && (
                      <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                        <h3 className="font-semibold text-blue-900">Scan QR Code to Pay</h3>
                        <div className="flex justify-center">
                          <div className="bg-white p-4 rounded-lg shadow">
                            <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                              <QrCode className="h-16 w-16 text-gray-400" />
                              <span className="ml-2 text-sm text-gray-600">QR Code</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-blue-700">
                            Scan this QR code with any UPI app to pay ₹{total}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="transactionId">Transaction ID *</Label>
                          <Input
                            id="transactionId"
                            value={formData.transactionId}
                            onChange={(e) => handleInputChange("transactionId", e.target.value)}
                            placeholder="Enter transaction ID after payment"
                            className={errors.transactionId ? "border-red-500" : ""}
                          />
                          {errors.transactionId && <p className="text-sm text-red-500">{errors.transactionId}</p>}
                          <p className="text-xs text-gray-600">
                            Enter the transaction ID you receive after completing the payment
                          </p>
                        </div>
                      </div>
                    )}

                    {/* UPI Payment */}
                    {formData.paymentMethod === 'upi' && (
                      <div className="bg-green-50 p-6 rounded-lg space-y-4">
                        <h3 className="font-semibold text-green-900">UPI Payment</h3>
                        <div className="bg-white p-4 rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">UPI ID:</p>
                              <p className="text-lg font-mono">igtharvillage@paytm</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={copyUpiId}
                            >
                              {upiCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-green-700">
                          Send ₹{total} to the above UPI ID and enter transaction ID below
                        </p>
                        
                        <div className="space-y-2">
                          <Label htmlFor="transactionId">Transaction ID *</Label>
                          <Input
                            id="transactionId"
                            value={formData.transactionId}
                            onChange={(e) => handleInputChange("transactionId", e.target.value)}
                            placeholder="Enter transaction ID after payment"
                            className={errors.transactionId ? "border-red-500" : ""}
                          />
                          {errors.transactionId && <p className="text-sm text-red-500">{errors.transactionId}</p>}
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery */}
                    {formData.paymentMethod === 'cash_on_delivery' && (
                      <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-orange-900 mb-2">Cash on Delivery</h3>
                        <p className="text-sm text-orange-700">
                          Pay ₹{total} in cash when your order is delivered. 
                          Additional charges of ₹25 may apply for COD orders.
                        </p>
                      </div>
                    )}

                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back to Address
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {loading ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
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
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartState.items.map((item) => (
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
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{total}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-green-600">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
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
