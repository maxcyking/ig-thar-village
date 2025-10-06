"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Property, getProperties } from "@/lib/database";
import {
  MapPin,
  Users,
  Star,
  ArrowRight,
  Tent,
  Calendar,
  Heart,
  Camera
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";



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
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-64 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Cool & Compact showcase for single property
  if (properties.length === 1) {
    const property = properties[0];

    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Compact Property Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative group">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Tent className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold">{property.name}</h3>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Price */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="text-2xl font-bold text-gray-900">₹{property.pricePerNight.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Authentic Desert
                    <span className="block text-amber-600">Accommodation</span>
                  </h2>

                  <div className="flex items-center space-x-6 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">{property.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">Up to {property.maxGuests} guests</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {property.description || property.shortDescription}
                  </p>
                </div>

                {/* Quick Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Tent className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Traditional Architecture</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Premium Experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Cultural Immersion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Desert Views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-lg">
                    <Link href={`/properties/${property.id}`}>
                      Explore Details
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl">
                    <Link href={`/booking/property/${property.id}`}>
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback for no properties
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tent className="h-10 w-10 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Desert Stay Coming Soon</h3>
          <p className="text-gray-600 mb-6">Our authentic accommodation will be available soon!</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
            <Link href="/contact">Contact Us for Updates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}