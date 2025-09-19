"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property, getProperties } from "@/lib/database";
import { 
  MapPin, 
  Users, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils,
  ArrowRight,
  Bed,
  Bath,
  TreePine,
  Mountain
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const amenityIcons: { [key: string]: any } = {
  'wifi': Wifi,
  'parking': Car,
  'breakfast': Coffee,
  'meals': Utensils,
  'ac': TreePine,
  'bathroom': Bath,
  'garden': TreePine,
  'desert-view': Mountain,
};

export function PropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const featuredProperties = await getProperties(true);
        setProperties(featuredProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 font-accent rounded-md">
            Our Accommodations
          </Badge>
          <h2 className="section-title text-gray-900 mb-6">
            Authentic Desert Accommodations
          </h2>
          <p className="body-text text-xl text-gray-600 max-w-3xl mx-auto">
            Experience traditional Rajasthani hospitality in our carefully designed properties, 
            each offering a unique blend of comfort and cultural authenticity
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bed className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
            <p className="text-gray-600 mb-6">Properties will be added soon. Check back later!</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us for Bookings</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map((property) => (
                <Card key={property.id} className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg bg-white hover:border-gray-200">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                          <Bed className="h-16 w-16 text-green-600" />
                        </div>
                      )}
                    </div>
                    
                    {/* Property Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-accent rounded-md">
                        {property.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    {/* Featured Badge */}
                    {property.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600 text-white font-accent rounded-md">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Price Overlay */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-2">
                        <div className="price-text text-gray-900">₹{property.pricePerNight.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 font-body">per night</div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="card-title text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {property.name}
                        </CardTitle>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="font-body">{property.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="font-body">Up to {property.maxGuests} guests</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="body-text text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.shortDescription}
                    </p>

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.slice(0, 4).map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity.toLowerCase()] || TreePine;
                          return (
                            <div key={index} className="flex items-center bg-gray-50 rounded-md px-2 py-1 text-xs text-gray-600 border border-gray-100">
                              <IconComponent className="h-3 w-3 mr-1" />
                              <span className="font-body">{amenity}</span>
                            </div>
                          );
                        })}
                        {property.amenities.length > 4 && (
                          <div className="flex items-center bg-gray-50 rounded-md px-2 py-1 text-xs text-gray-600 border border-gray-100">
                            <span className="font-body">+{property.amenities.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md cta-button">
                        <Link href={`/properties/${property.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="px-4 rounded-md cta-button border-gray-200 hover:border-gray-300">
                        <Link href={`/contact?property=${property.id}`}>
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Properties Button */}
            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl px-8">
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}