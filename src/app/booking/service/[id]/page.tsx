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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { format } from "date-fns";
import { getService, createServiceBooking, type Service, type BookingGuest } from "@/lib/database";

interface ServiceBookingFormData {
  fullName: string;
  phone: string;
  email: string;
  bookingDate: Date | undefined;
  timeSlot: string;
  guests: BookingGuest;
  specialRequests: string;
}

const timeSlots = [
  { value: "morning", label: "Morning (6:00 AM - 10:00 AM)", description: "Best for sunrise experiences" },
  { value: "midday", label: "Midday (10:00 AM - 2:00 PM)", description: "Perfect weather conditions" },
  { value: "afternoon", label: "Afternoon (2:00 PM - 6:00 PM)", description: "Ideal for cultural activities" },
  { value: "evening", label: "Evening (6:00 PM - 10:00 PM)", description: "Sunset and evening experiences" },
];

export default function ServiceBookingPage() {
  const params = useParams();
  const router = useRouter();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<ServiceBookingFormData>({
    fullName: "",
    phone: "",
    email: "",
    bookingDate: undefined,
    timeSlot: "",
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
      fetchService(params.id as string);
    }
  }, [params.id]);

  const fetchService = async (id: string) => {
    try {
      const serviceData = await getService(id);
      setService(serviceData);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ServiceBookingFormData, value: any) => {
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

  const calculateTotal = () => {
    if (!service) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    
    const totalGuests = getTotalGuests();
    const subtotal = service.price * totalGuests;
    const tax = Math.round(subtotal * 0.12); // 12% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.bookingDate) newErrors.bookingDate = "Booking date is required";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";

    // Phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date validation
    if (formData.bookingDate && formData.bookingDate < new Date()) {
      newErrors.bookingDate = "Booking date cannot be in the past";
    }

    // Guest validation
    if (getTotalGuests() === 0) {
      newErrors.guests = "At least one guest is required";
    }

    if (service && getTotalGuests() > service.maxParticipants) {
      newErrors.guests = `Maximum ${service.maxParticipants} participants allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !service) return;

    setSubmitting(true);

    try {
      const { subtotal, tax, total } = calculateTotal();
      const totalGuests = getTotalGuests();

      const bookingData = {
        serviceId: service.id,
        serviceName: service.name,
        serviceImage: service.images?.[0] || '',
        guestInfo: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },
        bookingDate: formData.bookingDate!,
        timeSlot: formData.timeSlot,
        guests: formData.guests,
        totalGuests,
        pricePerPerson: service.price,
        subtotal,
        tax,
        total,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: 'qr_code' as const,
        specialRequests: formData.specialRequests.trim() || undefined,
      };

      const bookingId = await createServiceBooking(bookingData);
      
      // Redirect to checkout
      router.push(`/checkout/booking/${bookingId}?type=service`);
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrors({ submit: "Failed to create booking. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're trying to book doesn't exist.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Book Your Experience</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
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

                {/* Date & Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Experience Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !formData.bookingDate ? "text-muted-foreground" : ""
                              } ${errors.bookingDate ? "border-red-500" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.bookingDate ? format(formData.bookingDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.bookingDate}
                              onSelect={(date) => handleInputChange("bookingDate", date)}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.bookingDate && <p className="text-sm text-red-500">{errors.bookingDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Time Slot *</Label>
                        <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                          <SelectTrigger className={errors.timeSlot ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                <div>
                                  <div className="font-medium">{slot.label}</div>
                                  <div className="text-xs text-gray-500">{slot.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot}</p>}
                      </div>
                    </div>

                    {formData.bookingDate && formData.timeSlot && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-700 text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {format(formData.bookingDate, "PPP")} • {timeSlots.find(slot => slot.value === formData.timeSlot)?.label}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle>Participants</CardTitle>
                    <p className="text-sm text-gray-600">Duration: {service.duration}</p>
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
                            disabled={getTotalGuests() >= (service.maxParticipants || 20)}
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
                            disabled={getTotalGuests() >= (service.maxParticipants || 20)}
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
                            disabled={getTotalGuests() >= (service.maxParticipants || 20)}
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
                            <p className="text-sm text-gray-500">Under 2 (Free)</p>
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
                        Total: {getTotalGuests()} participant{getTotalGuests() !== 1 ? 's' : ''} 
                        {formData.guests.infants > 0 && ` + ${formData.guests.infants} infant${formData.guests.infants !== 1 ? 's' : ''} (free)`}
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
                        placeholder="Let us know about any dietary restrictions, accessibility needs, or special interests..."
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
                  disabled={submitting || getTotalGuests() === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
                  {/* Service Info */}
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {service.images && service.images.length > 0 ? (
                        <Image
                          src={service.images[0]}
                          alt={service.name}
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
                      <h3 className="font-medium text-gray-900 line-clamp-2">{service.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>Thar Desert, Rajasthan</span>
                      </div>
                      <Badge variant="outline" className="mt-1 capitalize text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  {formData.bookingDate && formData.timeSlot && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span>{format(formData.bookingDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time</span>
                        <span>{timeSlots.find(slot => slot.value === formData.timeSlot)?.label.split(' (')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participants</span>
                        <span>{getTotalGuests()}</span>
                      </div>
                    </div>
                  )}

                  {getTotalGuests() > 0 && (
                    <>
                      <Separator />

                      {/* Price Breakdown */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>₹{service.price} × {getTotalGuests()} participant{getTotalGuests() !== 1 ? 's' : ''}</span>
                          <span>₹{subtotal}</span>
                        </div>
                        {formData.guests.infants > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>{formData.guests.infants} infant{formData.guests.infants !== 1 ? 's' : ''} (Free)</span>
                            <span>₹0</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Taxes & fees</span>
                          <span>₹{tax}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-blue-600">₹{total}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Service Features */}
                  {service.included && service.included.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Included</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {service.included.slice(0, 4).map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                        {service.included.length > 4 && (
                          <li>• +{service.included.length - 4} more inclusions</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
