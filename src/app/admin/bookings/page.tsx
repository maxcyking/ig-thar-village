"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PropertyBooking, 
  ServiceBooking, 
  getAllPropertyBookings, 
  getAllServiceBookings,
  updatePropertyBookingStatus,
  updateServiceBookingStatus
} from "@/lib/database";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { BookingDetailModal } from "@/components/admin/booking-detail-modal";

export default function BookingsPage() {
  const [propertyBookings, setPropertyBookings] = useState<PropertyBooking[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<PropertyBooking | ServiceBooking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [properties, services] = await Promise.all([
        getAllPropertyBookings(),
        getAllServiceBookings()
      ]);
      setPropertyBookings(properties);
      setServiceBookings(services);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string, 
    status: PropertyBooking['status'] | ServiceBooking['status'], 
    type: 'property' | 'service'
  ) => {
    try {
      setUpdatingStatus(id);
      
      if (type === 'property') {
        await updatePropertyBookingStatus(id, status as PropertyBooking['status']);
        setPropertyBookings(prev => 
          prev.map(booking => 
            booking.id === id ? { ...booking, status: status as PropertyBooking['status'] } : booking
          )
        );
      } else {
        await updateServiceBookingStatus(id, status as ServiceBooking['status']);
        setServiceBookings(prev => 
          prev.map(booking => 
            booking.id === id ? { ...booking, status: status as ServiceBooking['status'] } : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = (booking: PropertyBooking | ServiceBooking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const PropertyBookingCard = ({ booking }: { booking: PropertyBooking }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {booking.propertyName}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="font-medium">#{booking.bookingNumber}</span>
              <span className="mx-2">•</span>
              <span>{format(booking.createdAt, 'MMM dd, yyyy')}</span>
            </CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {(booking.guests?.adults || 0) + (booking.guests?.women || 0) + (booking.guests?.children || 0)} guests
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {format(booking.checkIn, 'MMM dd')} - {format(booking.checkOut, 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              ₹{(booking.totalAmount || 0).toLocaleString()} ({booking.totalNights || 0} nights)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Guest Details</h4>
            <p className="text-sm text-gray-600">{booking.guestDetails?.name || 'N/A'}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{booking.guestDetails?.phone || 'N/A'}</span>
              <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{booking.guestDetails?.email || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Special Requests</h4>
            <p className="text-sm text-gray-600">{booking.specialRequests || 'None'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={booking.status === 'confirmed' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'confirmed', 'property')}
              disabled={updatingStatus === booking.id}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant={booking.status === 'cancelled' ? 'destructive' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'cancelled', 'property')}
              disabled={updatingStatus === booking.id}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={booking.status === 'completed' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'completed', 'property')}
              disabled={updatingStatus === booking.id}
            >
              Complete
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(booking)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceBookingCard = ({ booking }: { booking: ServiceBooking }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {booking.serviceName}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="font-medium">#{booking.bookingNumber}</span>
              <span className="mx-2">•</span>
              <span>{format(booking.createdAt, 'MMM dd, yyyy')}</span>
            </CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.totalGuests || 0} guests</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{format(booking.bookingDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.timeSlot || 'N/A'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Guest Details</h4>
            <p className="text-sm text-gray-600">{booking.guestDetails?.name || 'N/A'}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{booking.guestDetails?.phone || 'N/A'}</span>
              <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{booking.guestDetails?.email || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Total Amount</h4>
            <p className="text-lg font-semibold text-green-600">₹{(booking.totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={booking.status === 'confirmed' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'confirmed', 'service')}
              disabled={updatingStatus === booking.id}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant={booking.status === 'cancelled' ? 'destructive' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'cancelled', 'service')}
              disabled={updatingStatus === booking.id}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={booking.status === 'completed' ? 'default' : 'outline'}
              onClick={() => handleStatusUpdate(booking.id, 'completed', 'service')}
              disabled={updatingStatus === booking.id}
            >
              Complete
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(booking)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage property and service bookings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{propertyBookings.length + serviceBookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Property Bookings</p>
                <p className="text-2xl font-bold">{propertyBookings.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Bookings</p>
                <p className="text-2xl font-bold">{serviceBookings.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {[...propertyBookings, ...serviceBookings].filter(b => b.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">
            Property Bookings ({propertyBookings.length})
          </TabsTrigger>
          <TabsTrigger value="services">
            Service Bookings ({serviceBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          {propertyBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Property Bookings</h3>
                <p className="text-gray-600">Property bookings will appear here when customers make reservations.</p>
              </CardContent>
            </Card>
          ) : (
            propertyBookings.map((booking) => (
              <PropertyBookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          {serviceBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Service Bookings</h3>
                <p className="text-gray-600">Service bookings will appear here when customers book experiences.</p>
              </CardContent>
            </Card>
          ) : (
            serviceBookings.map((booking) => (
              <ServiceBookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}