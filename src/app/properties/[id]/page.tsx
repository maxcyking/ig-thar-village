"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property, getPropertyById } from "@/lib/database";
import { 
  ArrowLeft,
  MapPin, 
  Users, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils,
  Bed,
  Bath,
  TreePine,
  Mountain,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2
} from "lucide-react";

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Coffee,
  'Swimming Pool': TreePine,
  'Garden View': TreePine,
  'Private Bathroom': Bath,
  'Air Conditioning': TreePine,
  'Complimentary Breakfast': Coffee,
  'Meals': Utensils,
  'Desert View': Mountain,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!params.id) return;
      
      try {
        const propertyData = await getPropertyById(params.id as string);
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.name,
          text: property?.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bed className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/properties">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
          {property.images && property.images.length > 0 ? (
            <>
              <Image
                src={property.images[currentImageIndex]}
                alt={property.name}
                fill
                className="object-cover"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <Bed className="h-24 w-24 text-green-600" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {property.featured && (
              <Badge className="bg-green-600 text-white font-accent rounded-md">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-accent rounded-md">
              {property.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="mb-8">
              <h1 className="section-title text-gray-900 mb-4">{property.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-body">{property.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-body">Up to {property.maxGuests} guests</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 mr-2 fill-green-600 text-green-600" />
                  <span className="font-body">4.8 (126 reviews)</span>
                </div>
              </div>

              {property.shortDescription && (
                <p className="body-text text-gray-700 text-lg leading-relaxed mb-6">
                  {property.shortDescription}
                </p>
              )}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="mb-8 border border-gray-100 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="card-title">Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || TreePine;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-green-600" />
                          <span className="font-body text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="card-title">About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="body-text text-gray-700 space-y-4">
                  <p>
                    Experience authentic Rajasthani hospitality at {property.name}, located in the heart of {property.location}. 
                    Our property offers a perfect blend of traditional architecture and modern comfort, ensuring a memorable stay 
                    in the Thar Desert.
                  </p>
                  <p>
                    Wake up to stunning desert views, enjoy traditional Rajasthani cuisine, and immerse yourself in the rich 
                    culture of the region. Whether you're here for adventure or relaxation, our property provides the perfect 
                    base for your desert experience.
                  </p>
                  <p>
                    All our accommodations are designed with sustainability in mind, using local materials and traditional 
                    building techniques while providing modern amenities for your comfort.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div>
            <Card className="sticky top-8 border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="price-text text-gray-900">₹{property.pricePerNight.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 font-body">per night</div>
                  </div>
                  {!property.available && (
                    <Badge className="bg-red-100 text-red-800 font-accent rounded-md">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 font-body">
                  Total: ₹{(property.pricePerNight * 1.18).toLocaleString()} (including taxes)
                </div>
                
                <div className="space-y-3">
                  <Button 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md cta-button"
                    disabled={!property.available}
                  >
                    <Link href={`/contact?property=${property.id}&type=booking`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {property.available ? 'Book Now' : 'Unavailable'}
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full rounded-md cta-button border-gray-200 hover:border-gray-300"
                  >
                    <Link href={`/contact?property=${property.id}&type=inquiry`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600 font-body space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Free cancellation up to 24 hours
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      24/7 customer support
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