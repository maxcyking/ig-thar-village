"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { getTestimonials, type Testimonial } from '@/lib/testimonials';
import SimpleTestimonialForm from './simple-testimonial-form';

interface TestimonialsSectionProps {
  showForm?: boolean;
  maxTestimonials?: number;
  featured?: boolean;
  className?: string;
}

export default function TestimonialsSection({ 
  showForm = true, 
  maxTestimonials = 4, 
  featured = true,
  className = '' 
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials(featured, maxTestimonials);
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTestimonialSubmitted = () => {
    // Refresh testimonials after new submission
    fetchTestimonials();
  };

  if (loading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 font-accent rounded-md">
              Guest Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Guests Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-5 h-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center space-x-4 mt-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 font-accent rounded-md">
            Guest Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from travelers who discovered the magic of authentic desert life
          </p>
        </div>

        {testimonials.length > 0 ? (
          <>
            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            {/* Mobile Carousel View */}
            <div className="md:hidden mb-12">
              <div className="relative">
                <TestimonialCard testimonial={testimonials[currentIndex]} />
                
                {testimonials.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevTestimonial}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextTestimonial}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {testimonials.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Be the First to Share!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Help other travelers discover the magic of IG Thar Village by sharing your experience.
            </p>
          </div>
        )}

        {/* Simplified Testimonial Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            <SimpleTestimonialForm onSuccess={handleTestimonialSubmitted} />
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="glass-effect border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-all duration-300 h-full">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
          ))}
          {[...Array(5 - testimonial.rating)].map((_, i) => (
            <Star key={i + testimonial.rating} className="h-5 w-5 text-gray-300" />
          ))}
        </div>
        
        <Quote className="h-8 w-8 text-gray-400 mb-4" />
        
        <div className="flex-grow">
          <h4 className="font-semibold text-gray-900 mb-2">{testimonial.title}</h4>
          <p className="text-gray-700 mb-6 leading-relaxed italic">
            "{testimonial.message}"
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-auto">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 font-accent">{testimonial.userName}</h4>
            {testimonial.userLocation && (
              <p className="text-gray-600 text-sm">{testimonial.userLocation}</p>
            )}
            {testimonial.experience && (
              <Badge variant="outline" className="mt-1 text-xs font-accent rounded-md border-gray-200">
                {testimonial.experience}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}