"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  MapPin, 
  Users, 
  Bed,
  Bath,
  Wifi,
  Coffee,
  Car,
  Star,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  Utensils,
  Tv,
  Shield,
  Mountain
} from "lucide-react";
import { getProperty, type Property } from "@/lib/database";
import { SocialShare } from "@/components/ui/social-share";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleBookNow = () => {
    if (!property) return;
    router.push(`/booking/property/${property.id}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image skeleton */}
                <div className="space-y-4">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
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
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/services')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/services')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Services
          </Button>
          <span>/</span>
          <span>Properties</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{property.name}</span>
      </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
          {property.images && property.images.length > 0 ? (
              <Image
                    src={property.images[selectedImageIndex]}
                alt={property.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Mountain className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.images.map((image, index) => (
                      <button
                        key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-amber-500 ring-2 ring-amber-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.name} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
            </div>
          )}
          </div>

            {/* Property Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {property.category}
                  </Badge>
            {property.featured && (
                    <Badge className="bg-amber-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>Thar Desert, Rajasthan</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.8 - 156 reviews)</span>
          </div>
        </div>

              {/* Price */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-600">
                    ₹{property.price}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Includes all amenities and breakfast
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Up to {property.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Bed className="h-4 w-4" />
                  <span className="text-sm">2 bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Bath className="h-4 w-4" />
                  <span className="text-sm">2 bathrooms</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mountain className="h-4 w-4" />
                  <span className="text-sm">Desert view</span>
                </div>
                </div>

              {/* Availability */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${
                  property.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    property.available ? 'bg-green-600' : 'bg-red-600'
                  }`} />
                  <span className="font-medium">
                    {property.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {property.available && (
                <div className="space-y-3">
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    size="lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleToggleFavorite}
                      className={`flex-1 ${
                        isFavorite 
                          ? 'border-red-500 text-red-500 bg-red-50' 
                          : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 mr-2 ${
                          isFavorite ? 'fill-current' : ''
                        }`} 
                      />
                      {isFavorite ? 'Saved' : 'Save'}
                    </Button>
                    
                    <SocialShare
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                      title={property.name}
                      description={property.description}
                      image={property.images?.[0] || ''}
                    />
                  </div>
                </div>
              )}

              {/* Quick Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wifi className="h-4 w-4 text-amber-600" />
                  <span>Free WiFi included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Utensils className="h-4 w-4 text-amber-600" />
                  <span>Traditional meals available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="h-4 w-4 text-amber-600" />
                  <span>Free parking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>Safe and secure</span>
                </div>
              </div>
            </div>
            </div>

          {/* Property Details */}
          <div className="mt-16 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
                <CardHeader>
                <CardTitle>Amenities & Services</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-amber-600" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Utensils className="h-5 w-5 text-amber-600" />
                    <span>Traditional Meals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-amber-600" />
                    <span>Free Parking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    <span>Desert Tea Service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tv className="h-5 w-5 text-amber-600" />
                    <span>Entertainment Area</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mountain className="h-5 w-5 text-amber-600" />
                    <span>Desert Safari Access</span>
                        </div>
                  </div>
                </CardContent>
              </Card>

            {/* Included */}
            {property.included && property.included.length > 0 && (
              <Card>
              <CardHeader>
                  <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.included.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            )}

            {/* House Rules */}
            <Card>
              <CardHeader>
                <CardTitle>House Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Check-in / Check-out</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Check-in: 2:00 PM - 8:00 PM</span>
                </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Check-out: 11:00 AM</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Respect local customs and traditions</p>
                  <p>• No smoking inside the property</p>
                  <p>• Quiet hours: 10:00 PM - 7:00 AM</p>
                  <p>• Maximum {property.maxGuests} guests allowed</p>
                  <p>• Children must be supervised at all times</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}