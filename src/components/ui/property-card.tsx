"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Wifi, 
  Car, 
  Coffee,
  Waves,
  TreePine,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    location: string;
    category: string;
    pricePerNight: number;
    maxGuests: number;
    images: string[];
    amenities: string[];
    featured: boolean;
    available: boolean;
    shortDescription?: string;
    rating?: number;
    reviewCount?: number;
  };
  onViewDetails?: (propertyId: string) => void;
  onToggleFavorite?: (propertyId: string) => void;
  isFavorite?: boolean;
}

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Coffee,
  'Swimming Pool': Waves,
  'Garden View': TreePine,
  'Private Bathroom': Bed,
  'Air Conditioning': Waves,
  'Complimentary Breakfast': Coffee,
};

export function PropertyCard({ 
  property, 
  onViewDetails, 
  onToggleFavorite, 
  isFavorite = false 
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(property.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(property.id);
  };

  // Get top 4 amenities for display
  const displayAmenities = property.amenities.slice(0, 4);

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer rounded-lg border border-gray-100 shadow-sm hover:border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <TreePine className="h-12 w-12 text-amber-600" />
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-4 w-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-amber-600 text-white text-xs px-2 py-1 rounded-md font-accent">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {!property.available && (
            <Badge className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-accent">
              Unavailable
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Rating and Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-green-600 text-green-600" />
            <span className="text-sm font-medium font-body text-gray-700">
              {property.rating || 4.8} ({property.reviewCount || 126} reviews)
            </span>
          </div>
          <Badge variant="secondary" className="text-xs capitalize font-accent rounded-md bg-gray-50 text-gray-600 border-gray-200">
            {property.category.replace('-', ' ')}
          </Badge>
        </div>

        {/* Property Name */}
        <h3 className="card-title text-gray-900 mb-2 line-clamp-1">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-body">{property.location}</span>
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {displayAmenities.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || Bed;
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <IconComponent className="h-4 w-4 text-gray-500" />
                <span className="truncate font-body">{amenity}</span>
              </div>
            );
          })}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="price-text text-gray-900">
                ₹{property.pricePerNight.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-body">/ night</span>
            </div>
            <div className="text-xs text-gray-400 font-body">
              ₹{(property.pricePerNight * 1.18).toLocaleString()} total with taxes
            </div>
          </div>
          
          <Button 
            className={`rounded-md transition-all duration-200 cta-button ${
              isHovered ? 'bg-green-700' : 'bg-green-600'
            } hover:bg-green-700 shadow-sm`}
            disabled={!property.available}
          >
            {property.available ? 'View Details' : 'Unavailable'}
          </Button>
        </div>

        {/* Guest Capacity */}
        <div className="flex items-center gap-1 text-sm text-gray-500 border-t border-gray-100 pt-3">
          <Users className="h-4 w-4" />
          <span className="font-body">Up to {property.maxGuests} guests</span>
        </div>
      </CardContent>
    </Card>
  );
}