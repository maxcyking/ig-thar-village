"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  CreditCard,
  Smartphone,
  QrCode,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Copy,
  Check,
  Shield,
  Mountain
} from "lucide-react";
import { format } from "date-fns";
import { 
  getPropertyBooking, 
  getServiceBooking, 
  type PropertyBooking, 
  type ServiceBooking 
} from "@/lib/database";

type BookingType = 'property' | 'service';
type Booking = PropertyBooking | ServiceBooking;

interface PaymentFormData {
  paymentMethod: 'qr_code' | 'card' | 'upi' | 'cash_on_arrival';
  transactionId: string;
}

function BookingCheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>('property');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment Method, 2: Payment Processing, 3: Confirmation

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    paymentMethod: 'qr_code',
    transactionId: '',
  });

  useEffect(() => {
    const type = searchParams.get('type') as BookingType;
    if (type) {
      setBookingType(type);
    }
    
    if (params.id) {
      fetchBooking(params.id as string, type || 'property');
    }
  }, [params.id, searchParams]);

  const fetchBooking = async (id: string, type: BookingType) => {
    try {
      let bookingData;
      if (type === 'property') {
        bookingData = await getPropertyBooking(id);
      } else {
        bookingData = await getServiceBooking(id);
      }
      setBooking(bookingData);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (field: keyof PaymentFormData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (paymentData.paymentMethod !== 'cash_on_arrival') {
      if (!paymentData.transactionId.trim()) {
        newErrors.transactionId = "Transaction ID is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePayment() || !booking) return;

    setSubmitting(true);
    setStep(2);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally update the booking status
      // For now, we'll just proceed to confirmation
      setStep(3);
    } catch (error) {
      console.error("Error processing payment:", error);
      setErrors({ payment: "Payment processing failed. Please try again." });
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const isPropertyBooking = (booking: Booking): booking is PropertyBooking => {
    return 'checkIn' in booking;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/services')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Confirmation Step
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-lg text-gray-600">
                Your {bookingType} booking has been successfully confirmed.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Booking Number</span>
                    <span className="font-mono text-lg">{booking.bookingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">₹{booking.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <Badge className="bg-green-600 text-white">Confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-gray-600">
                A confirmation email has been sent to {booking.guestInfo.email}
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push(`/track?booking=${booking.bookingNumber}`)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Track Booking
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/services')}
                >
                  Browse More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Processing Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentData.paymentMethod} 
                    onValueChange={(value) => handlePaymentChange('paymentMethod', value)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="qr_code" id="qr_code" />
                      <Label htmlFor="qr_code" className="flex items-center gap-3 cursor-pointer flex-1">
                        <QrCode className="h-5 w-5 text-amber-600" />
                        <div>
                          <div className="font-medium">QR Code / UPI</div>
                          <div className="text-sm text-gray-500">Pay using any UPI app</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Card Payment</div>
                          <div className="text-sm text-gray-500">Credit or Debit Card</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">UPI ID</div>
                          <div className="text-sm text-gray-500">Pay using UPI ID</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cash_on_arrival" id="cash_on_arrival" />
                      <Label htmlFor="cash_on_arrival" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium">Cash on Arrival</div>
                          <div className="text-sm text-gray-500">Pay when you arrive</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentData.paymentMethod === 'qr_code' && (
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border text-center">
                      <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Scan this QR code with any UPI app</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-mono">UPI ID: igtharvillage@paytm</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard('igtharvillage@paytm')}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionId">Transaction ID *</Label>
                      <Input
                        id="transactionId"
                        value={paymentData.transactionId}
                        onChange={(e) => handlePaymentChange('transactionId', e.target.value)}
                        placeholder="Enter transaction ID after payment"
                        className={errors.transactionId ? "border-red-500" : ""}
                      />
                      {errors.transactionId && (
                        <p className="text-sm text-red-500">{errors.transactionId}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentData.paymentMethod === 'cash_on_arrival' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cash on Arrival</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-amber-800">
                        You can pay the full amount when you arrive. Please bring exact change if possible.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Error */}
              {errors.payment && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.payment}</p>
                </div>
              )}

              {/* Confirm Payment Button */}
              <Button 
                onClick={handlePayment}
                disabled={submitting}
                className="w-full bg-amber-600 hover:bg-amber-700"
                size="lg"
              >
                {submitting ? "Processing..." : `Confirm Payment - ₹${booking.total}`}
              </Button>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Service/Property Info */}
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {(isPropertyBooking(booking) ? booking.propertyImage : booking.serviceImage) ? (
                        <Image
                          src={isPropertyBooking(booking) ? booking.propertyImage : booking.serviceImage}
                          alt={isPropertyBooking(booking) ? booking.propertyName : booking.serviceName}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <Mountain className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {isPropertyBooking(booking) ? booking.propertyName : booking.serviceName}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>Thar Desert, Rajasthan</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Booking Number</span>
                      <span className="font-mono">{booking.bookingNumber}</span>
                    </div>
                    
                    {isPropertyBooking(booking) ? (
                      <>
                        <div className="flex justify-between">
                          <span>Check-in</span>
                          <span>{format(booking.checkIn, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out</span>
                          <span>{format(booking.checkOut, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights</span>
                          <span>{booking.totalNights}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span>{format(booking.bookingDate, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Slot</span>
                          <span className="capitalize">{booking.timeSlot}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Guests</span>
                      <span>
                        {booking.guests.adults + booking.guests.women + booking.guests.children}
                        {booking.guests.infants > 0 && ` + ${booking.guests.infants} infants`}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Guest Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Guest Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{booking.guestInfo.fullName}</p>
                      <p>{booking.guestInfo.phone}</p>
                      <p>{booking.guestInfo.email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{booking.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & fees</span>
                      <span>₹{booking.tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-amber-600">₹{booking.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">Secure Payment</p>
                      <p className="text-gray-600">
                        Your payment information is protected with end-to-end encryption.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function BookingCheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function BookingCheckoutPage() {
  return (
    <Suspense fallback={<BookingCheckoutLoading />}>
      <BookingCheckoutContent />
    </Suspense>
  );
}
