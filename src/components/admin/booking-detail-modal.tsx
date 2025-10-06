"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PropertyBooking, ServiceBooking } from "@/lib/database";
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
  CreditCard,
  FileText,
  User
} from "lucide-react";
import { format } from "date-fns";

interface BookingDetailModalProps {
  booking: PropertyBooking | ServiceBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, type: 'property' | 'service') => void;
}

export function BookingDetailModal({ booking, isOpen, onClose, onStatusUpdate }: BookingDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!booking) return null;

  const isPropertyBooking = 'checkIn' in booking;
  const bookingType = isPropertyBooking ? 'property' : 'service';

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

  const handleStatusUpdate = async (status: string) => {
    setUpdatingStatus(true);
    await onStatusUpdate(booking.id, status, bookingType);
    setUpdatingStatus(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {isPropertyBooking ? (booking as PropertyBooking).propertyName : (booking as ServiceBooking).serviceName}
              </DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <span className="font-medium">#{booking.bookingNumber}</span>
                <span className="mx-2">•</span>
                <span>Booked on {format(booking.createdAt, 'MMM dd, yyyy')}</span>
              </DialogDescription>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Guest Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm">{booking.guestDetails?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {booking.guestDetails?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {booking.guestDetails?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Guests</label>
                  <p className="text-sm flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {isPropertyBooking 
                      ? `${((booking as PropertyBooking).guests?.adults || 0) + ((booking as PropertyBooking).guests?.women || 0) + ((booking as PropertyBooking).guests?.children || 0)} total`
                      : `${(booking as ServiceBooking).totalGuests} total`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Booking Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {isPropertyBooking ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Check-in</label>
                    <p className="text-sm">{format((booking as PropertyBooking).checkIn, 'PPP')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Check-out</label>
                    <p className="text-sm">{format((booking as PropertyBooking).checkOut, 'PPP')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nights</label>
                    <p className="text-sm">{(booking as PropertyBooking).totalNights} nights</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rate per night</label>
                    <p className="text-sm">₹{((booking as PropertyBooking).pricePerNight || 0).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Date</label>
                    <p className="text-sm">{format((booking as ServiceBooking).bookingDate, 'PPP')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time Slot</label>
                    <p className="text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {(booking as ServiceBooking).timeSlot}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rate per person</label>
                    <p className="text-sm">₹{((booking as ServiceBooking).pricePerPerson || 0).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guest Breakdown (for property bookings) */}
          {isPropertyBooking && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Guest Breakdown
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{(booking as PropertyBooking).guests?.adults || 0}</p>
                    <p className="text-sm text-gray-600">Adults</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{(booking as PropertyBooking).guests?.women || 0}</p>
                    <p className="text-sm text-gray-600">Women</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{(booking as PropertyBooking).guests?.children || 0}</p>
                    <p className="text-sm text-gray-600">Children</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {isPropertyBooking && (booking as PropertyBooking).specialRequests && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Special Requests
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm">{(booking as PropertyBooking).specialRequests}</p>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Payment Status: <Badge variant="outline">{booking.paymentStatus}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Update Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Update Status</h3>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={booking.status === 'confirmed' ? 'default' : 'outline'}
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={updatingStatus}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant={booking.status === 'cancelled' ? 'destructive' : 'outline'}
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updatingStatus}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                variant={booking.status === 'completed' ? 'default' : 'outline'}
                onClick={() => handleStatusUpdate('completed')}
                disabled={updatingStatus}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}