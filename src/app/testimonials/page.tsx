"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Search, Filter, Quote, User, MapPin, Award } from "lucide-react";
import { getTestimonials, getTestimonialStats, type Testimonial } from '@/lib/testimonials';
import TestimonialForm from '@/components/testimonials/testimonial-form';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [experienceFilter, setExperienceFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, ratingFilter, experienceFilter]);

  const fetchData = async () => {
    try {
      const [testimonialsData, statsData] = await Promise.all([
        getTestimonials(false, 50), // Get up to 50 testimonials
        getTestimonialStats()
      ]);
      setTestimonials(testimonialsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.userLocation && t.userLocation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (ratingFilter > 0) {
      filtered = filtered.filter(t => t.rating === ratingFilter);
    }

    if (experienceFilter) {
      filtered = filtered.filter(t => t.experience === experienceFilter);
    }

    setFilteredTestimonials(filtered);
  };

  const uniqueExperiences = Array.from(
    new Set(testimonials.map(t => t.experience).filter(Boolean))
  );

  const handleTestimonialSubmitted = () => {
    setShowForm(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-8 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-5 h-5 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 font-accent rounded-md">
            Guest Stories
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Guests Say
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Real experiences from travelers who discovered the magic of authentic desert life at IG Thar Village
          </p>

          {/* Stats */}
          {stats && (
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.approved}</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 mr-2">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          )}

          <Button 
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Star className="h-5 w-5 mr-2" />
            Share Your Experience
          </Button>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <TestimonialForm onSuccess={handleTestimonialSubmitted} />
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>

                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Experiences</option>
                  {uniqueExperiences.map((experience) => (
                    <option key={experience} value={experience}>
                      {experience}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || ratingFilter || experienceFilter 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to share your experience!'
                }
              </p>
              {!showForm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </div>
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
          {testimonial.featured && (
            <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
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
              <p className="text-gray-600 text-sm flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {testimonial.userLocation}
              </p>
            )}
            {testimonial.experience && (
              <Badge variant="outline" className="mt-1 text-xs font-accent rounded-md border-gray-200">
                {testimonial.experience}
              </Badge>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {testimonial.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}