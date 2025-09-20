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
  Mountain,
  Sun,
  Moon,
  Wind,
  Droplets,
  Tent,
  Calendar,
  Check,
  Heart,
  Camera,
  Compass,
  Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const amenityIcons: { [key: string]: any } = {
  'wifi': Wifi,
  'parking': Car,
  'breakfast': Coffee,
  'meals': Utensils,
  'ac': Wind,
  'bathroom': Bath,
  'garden': TreePine,
  'desert-view': Mountain,
  'camel-safari': Compass,
  'cultural-show': Heart,
  'organic-food': TreePine,
  'hot-water': Droplets,
  'traditional-bed': Bed,
  'mud-house': Tent,
  'stargazing': Moon,
  'desert-walk': Sun,
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

  // Special showcase for single property
  if (properties.length === 1) {
    const property = properties[0];
    
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 text-lg px-6 py-2 rounded-full">
              <Tent className="h-4 w-4 mr-2" />
              Desert Stay Experience
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Authentic Desert
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Accommodation
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Immerse yourself in the timeless beauty of Rajasthan with our traditional mud house accommodation, 
              where ancient desert architecture meets modern comfort in the heart of the Thar Desert.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Main Property Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 flex items-center justify-center">
                        <div className="text-center">
                          <Tent className="h-20 w-20 text-amber-600 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-amber-800">{property.name}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Property Badges */}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      Premium Stay
                    </Badge>
                  </div>
                  
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                      100% Authentic
                    </Badge>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-900">₹{property.pricePerNight.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Images */}
                {property.images && property.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {property.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={image}
                          alt={`${property.name} view ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h3>
                  
                  <div className="flex items-center space-x-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">{property.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">Up to {property.maxGuests} guests</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {property.description || property.shortDescription}
                  </p>
                </div>

                {/* Key Features */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">What Makes It Special</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Traditional mud house architecture</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Panoramic Thar Desert views</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Organic farm-to-table meals</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Cultural performances included</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl px-8 py-4 text-lg shadow-lg">
                    <Link href={`/properties/${property.id}`}>
                      <Camera className="mr-2 h-5 w-5" />
                      Explore Details
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl px-8 py-4 text-lg">
                    <Link href={`/contact?property=${property.id}`}>
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Amenities Showcase */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/50 mb-16">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Desert Comfort & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity.toLowerCase().replace(' ', '-')] || TreePine;
                    return (
                      <div key={index} className="group text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <IconComponent className="h-8 w-8 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {amenity.replace('-', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experience Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Moon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Stargazing Nights</h4>
                  <p className="text-gray-600 text-sm">Experience the pristine desert sky with minimal light pollution, perfect for stargazing and astronomy.</p>
                </div>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sun className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Desert Sunrise</h4>
                  <p className="text-gray-600 text-sm">Wake up to breathtaking sunrises over the sand dunes, a magical start to your desert adventure.</p>
                </div>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Cultural Immersion</h4>
                  <p className="text-gray-600 text-sm">Live alongside local families and experience authentic Rajasthani culture, traditions, and hospitality.</p>
                </div>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready for Your Desert Adventure?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Book your authentic desert stay and create memories that will last a lifetime in the heart of the Thar Desert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg">
                  <Link href={`/properties/${property.id}`}>
                    <Shield className="mr-2 h-5 w-5" />
                    View Full Details
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg rounded-xl">
                  <Link href="/contact">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Original design for multiple properties or fallback
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