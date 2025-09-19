"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service, getServices } from "@/lib/database";
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  Camera,
  Mountain,
  Tent,
  TreePine,
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryIcons: { [key: string]: any } = {
  'safari': Mountain,
  'cultural': Heart,
  'adventure': Tent,
  'spiritual': TreePine,
  'educational': Camera,
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const featuredServices = await getServices(true);
        setServices(featuredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 agricultural-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-80 mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 font-accent rounded-md">
            Our Services
          </Badge>
          <h2 className="section-title text-gray-900 mb-6">
            Choose Your Adventure
          </h2>
          <p className="body-text text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully crafted experiences that combine comfort, authenticity, and adventure in the heart of Thar Desert
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600 mb-6">Services will be added soon. Check back later!</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us for Custom Packages</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {services.map((service) => {
                const CategoryIcon = categoryIcons[service.category] || Mountain;
                
                return (
                  <Card key={service.id} className={`relative rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:border-gray-200 ${service.featured ? 'ring-2 ring-blue-400 scale-105' : ''}`}>
                    {service.featured && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-accent rounded-md">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    
                    {/* Service Image */}
                    {service.images && service.images.length > 0 && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={service.images[0]}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-accent rounded-md">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <CardTitle className="card-title text-gray-900">{service.name}</CardTitle>
                      <div className="price-text text-blue-600 mt-2">₹{service.price.toLocaleString()}</div>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Up to {service.maxParticipants}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="body-text text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.shortDescription}
                      </p>
                      
                      {/* Included Features */}
                      {service.included && service.included.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {service.included.slice(0, 4).map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-3 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-gray-600 font-body">{item}</span>
                            </li>
                          ))}
                          {service.included.length > 4 && (
                            <li className="text-sm text-gray-500 ml-7">
                              +{service.included.length - 4} more included
                            </li>
                          )}
                        </ul>
                      )}
                      
                      <div className="flex gap-2">
                        <Button asChild className={`flex-1 rounded-md cta-button ${service.featured ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}>
                          <Link href={`/services/${service.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="px-4 rounded-md cta-button border-gray-200 hover:border-gray-300">
                          <Link href={`/contact?service=${service.id}`}>
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* View All Services Button */}
            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl px-8">
                <Link href="/services">
                  View All Services
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