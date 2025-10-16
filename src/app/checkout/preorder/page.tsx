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
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Bell,
  Heart
} from "lucide-react";
import { getProductById, createOrder, type ShippingAddress, type OrderItem, type Product } from "@/lib/database";

interface PreOrderFormData {
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
  quantity: number;
}

function PreOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const productId = searchParams.get('productId');
  const initialQuantity = parseInt(searchParams.get('quantity') || '1');
  
  const [formData, setFormData] = useState<PreOrderFormData>({
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
    quantity: initialQuantity,
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      router.push('/products');
    }
  }, [productId, router]);

  const fetchProduct = async (id: string) => {
    try {
      const productData = await getProductById(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PreOrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !product) return;

    setSubmitting(true);

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
      const orderItems: OrderItem[] = [{
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        price: product.price,
        quantity: formData.quantity,
        total: product.price * formData.quantity,
      }];

      const subtotal = product.price * formData.quantity;
      const shipping = 0; // No shipping for pre-orders
      const tax = 0; // No tax for pre-orders
      const total = subtotal;

      // Create pre-order (special status)
      const orderData: any = {
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending' as const, // Will be marked as pre-order in notes
        paymentStatus: 'pending' as const,
        paymentMethod: 'cash_on_delivery' as const,
        shippingAddress,
        notes: `PRE-ORDER: Customer wants to order this product. Contact when ready for delivery. Customer notes: ${formData.notes || 'None'}`,
      };

      await createOrder(orderData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating pre-order:", error);
      setErrors({ submit: "Failed to submit pre-order. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're trying to pre-order doesn't exist.</p>
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Interest!</h1>
              <p className="text-lg text-gray-600 mb-6">
                We've received your order request for <strong>{product.name}</strong>. 
                We'll contact you as soon as it becomes available!
              </p>
            </div>

            <Card className="mb-8 text-left">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">What happens next?</h3>
                      <p className="text-sm text-gray-600">We'll contact you as soon as this product is back in stock</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Personal Contact</h3>
                      <p className="text-sm text-gray-600">Our team will call you at {formData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Priority Access</h3>
                      <p className="text-sm text-gray-600">You'll be among the first to know when it's available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Expected timeframe:</strong> We typically restock within 1-2 weeks. 
                We'll reach out to you as soon as possible!
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
          </div>
        </div>
      </div>
    );
  }

  const subtotal = product.price * formData.quantity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Pre-Order Request</h1>
        </div>

        {/* Info Banner */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Reserve Your Order</h3>
                  <p className="text-sm text-blue-700">
                    This product is currently being prepared. Fill out your details below and we'll contact you as soon as it's ready for delivery!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pre-Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your Details
                </CardTitle>
                <p className="text-sm text-gray-600">We'll use this information to contact you when the product is available</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Label htmlFor="quantity">Quantity Needed</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                      className="w-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any specific requirements or preferred contact time..."
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
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {submitting ? "Submitting Request..." : "Submit Pre-Order Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Product Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Pre-Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Info */}
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600">₹{product.price} per {product.unit}</p>
                    <Badge className="mt-1 bg-blue-100 text-blue-800">
                      Available for Pre-Order
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Quantity & Price */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formData.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per {product.unit}:</span>
                    <span>₹{product.price}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Estimated Total:</span>
                    <span className="text-blue-600">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How It Works</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• No payment required now</li>
                    <li>• We'll contact you when ready</li>
                    <li>• Confirm your order over phone</li>
                    <li>• Pay on delivery</li>
                    <li>• Cancel anytime before delivery</li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>+91 8302676869</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>info@igtharvillage.com</span>
                    </div>
                  </div>
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
function PreOrderLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pre-order form...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function PreOrderPage() {
  return (
    <Suspense fallback={<PreOrderLoading />}>
      <PreOrderContent />
    </Suspense>
  );
}