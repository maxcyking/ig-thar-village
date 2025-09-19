"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  Minus,
  Plus,
  User,
  UserCheck,
  Baby,
  Mountain
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { getProperty, createPropertyBooking, type Property, type BookingGuest } from "@/lib/database";

interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: BookingGuest;
  specialRequests: string;
}

export default function PropertyBookingPage() {
  const params = useParams();
  const router = useRouter();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    phone: "",
    email: "",
    checkInDate: undefined,
    checkOutDate: undefined,
    guests: {
      adults: 2,
      women: 0,
      children: 0,
      infants: 0,
    },
    specialRequests: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    try {
      const propertyData = await getProperty(id);
      setProperty(propertyData);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleGuestChange = (type: keyof BookingGuest, increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: increment 
          ? prev.guests[type] + 1 
          : Math.max(0, prev.guests[type] - 1)
      }
    }));
  };

  const getTotalGuests = () => {
    return formData.guests.adults + formData.guests.women + formData.guests.children;
  };

  const getTotalNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      return differenceInDays(formData.checkOutDate, formData.checkInDate);
    }
    return 0;
  };

  const calculateTotal = () => {
    if (!property || !formData.checkInDate || !formData.checkOutDate) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    
    const nights = getTotalNights();
    const subtotal = property.price * nights;
    const tax = Math.round(subtotal * 0.12); // 12% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.checkInDate) newErrors.checkInDate = "Check-in date is required";
    if (!formData.checkOutDate) newErrors.checkOutDate = "Check-out date is required";

    // Phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date validation
    if (formData.checkInDate && formData.checkInDate < new Date()) {
      newErrors.checkInDate = "Check-in date cannot be in the past";
    }

    if (formData.checkInDate && formData.checkOutDate && formData.checkOutDate <= formData.checkInDate) {
      newErrors.checkOutDate = "Check-out date must be after check-in date";
    }

    // Guest validation
    if (getTotalGuests() === 0) {
      newErrors.guests = "At least one guest is required";
    }

    if (property && getTotalGuests() > property.maxGuests) {
      newErrors.guests = `Maximum ${property.maxGuests} guests allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !property) return;

    setSubmitting(true);

    try {
      const { subtotal, tax, total } = calculateTotal();
      const nights = getTotalNights();

      const bookingData = {
        propertyId: property.id,
        propertyName: property.name,
        propertyImage: property.images?.[0] || '',
        guestInfo: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },
        checkIn: formData.checkInDate!,
        checkOut: formData.checkOutDate!,
        guests: formData.guests,
        totalNights: nights,
        pricePerNight: property.price,
        subtotal,
        tax,
        total,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: 'qr_code' as const,
        specialRequests: formData.specialRequests.trim() || undefined,
      };

      const bookingId = await createPropertyBooking(bookingData);
      
      // Redirect to checkout
      router.push(`/checkout/booking/${bookingId}?type=property`);
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrors({ submit: "Failed to create booking. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you're trying to book doesn't exist.</p>
            <Button onClick={() => router.push('/services')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Book Your Stay</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Check-in Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !formData.checkInDate ? "text-muted-foreground" : ""
                              } ${errors.checkInDate ? "border-red-500" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.checkInDate}
                              onSelect={(date) => handleInputChange("checkInDate", date)}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkInDate && <p className="text-sm text-red-500">{errors.checkInDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Check-out Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !formData.checkOutDate ? "text-muted-foreground" : ""
                              } ${errors.checkOutDate ? "border-red-500" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.checkOutDate}
                              onSelect={(date) => handleInputChange("checkOutDate", date)}
                              disabled={(date) => 
                                date < new Date() || 
                                (formData.checkInDate ? date <= formData.checkInDate : false)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkOutDate && <p className="text-sm text-red-500">{errors.checkOutDate}</p>}
                      </div>
                    </div>

                    {formData.checkInDate && formData.checkOutDate && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-amber-700 text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {getTotalNights()} night{getTotalNights() !== 1 ? 's' : ''} stay
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Guests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Adults</p>
                            <p className="text-sm text-gray-500">Age 13 or above</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('adults', false)}
                            disabled={formData.guests.adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{formData.guests.adults}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('adults', true)}
                            disabled={getTotalGuests() >= (property.maxGuests || 8)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Women</p>
                            <p className="text-sm text-gray-500">Age 13 or above</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('women', false)}
                            disabled={formData.guests.women <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{formData.guests.women}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('women', true)}
                            disabled={getTotalGuests() >= (property.maxGuests || 8)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Children</p>
                            <p className="text-sm text-gray-500">Age 2-12</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('children', false)}
                            disabled={formData.guests.children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{formData.guests.children}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('children', true)}
                            disabled={getTotalGuests() >= (property.maxGuests || 8)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Baby className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Infants</p>
                            <p className="text-sm text-gray-500">Under 2</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('infants', false)}
                            disabled={formData.guests.infants <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{formData.guests.infants}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuestChange('infants', true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {errors.guests && <p className="text-sm text-red-500">{errors.guests}</p>}

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        Total: {getTotalGuests()} guest{getTotalGuests() !== 1 ? 's' : ''} 
                        {formData.guests.infants > 0 && ` + ${formData.guests.infants} infant${formData.guests.infants !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Any special requirements or requests?</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Let us know about any dietary restrictions, accessibility needs, or special occasions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={submitting || getTotalNights() === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  {submitting ? "Creating Booking..." : "Proceed to Payment"}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Info */}
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.name}
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
                      <h3 className="font-medium text-gray-900 line-clamp-2">{property.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>Thar Desert, Rajasthan</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  {formData.checkInDate && formData.checkOutDate && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Check-in</span>
                        <span>{format(formData.checkInDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out</span>
                        <span>{format(formData.checkOutDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights</span>
                        <span>{getTotalNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests</span>
                        <span>{getTotalGuests()}</span>
                      </div>
                    </div>
                  )}

                  {getTotalNights() > 0 && (
                    <>
                      <Separator />

                      {/* Price Breakdown */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>₹{property.price} × {getTotalNights()} night{getTotalNights() !== 1 ? 's' : ''}</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes & fees</span>
                          <span>₹{tax}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-amber-600">₹{total}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Property Features */}
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Included</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Traditional breakfast</li>
                      <li>• WiFi access</li>
                      <li>• Local guide assistance</li>
                      <li>• Desert experience</li>
                    </ul>
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
