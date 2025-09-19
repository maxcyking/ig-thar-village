"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service, getServiceById } from "@/lib/database";
import { 
  ArrowLeft,
  Star, 
  Clock,
  Users,
  CheckCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Camera,
  Mountain,
  Tent,
  TreePine,
  MapPin,
  Award,
  Shield
} from "lucide-react";

const categoryIcons: { [key: string]: any } = {
  'safari': Mountain,
  'cultural': Heart,
  'adventure': Tent,
  'spiritual': TreePine,
  'educational': Camera,
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    const fetchService = async () => {
      if (!params.id) return;
      
      try {
        const serviceData = await getServiceById(params.id as string);
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  const nextImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => 
        prev === service.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name,
          text: service?.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mountain className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[service.category] || Mountain;

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
          {service.images && service.images.length > 0 ? (
            <>
              <Image
                src={service.images[currentImageIndex]}
                alt={service.name}
                fill
                className="object-cover"
              />
              
              {service.images.length > 1 && (
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
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {service.images.map((_, index) => (
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
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <CategoryIcon className="h-24 w-24 text-blue-600" />
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
              aria-label="Share service"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {service.featured && (
              <Badge className="bg-blue-600 text-white font-accent rounded-md">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-accent rounded-md">
              <CategoryIcon className="h-3 w-3 mr-1" />
              {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Info */}
            <div className="mb-8">
              <h1 className="section-title text-gray-900 mb-4">{service.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-body">{service.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-body">Up to {service.maxParticipants} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 mr-2 fill-blue-600 text-blue-600" />
                  <span className="font-body">4.9 (89 reviews)</span>
                </div>
              </div>

              {service.shortDescription && (
                <p className="body-text text-gray-700 text-lg leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              )}
            </div>

            {/* What's Included */}
            {service.included && service.included.length > 0 && (
              <Card className="mb-8 border border-gray-100 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="card-title">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.included.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-body text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Highlights */}
            <Card className="mb-8 border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="card-title">Service Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Expert Guides</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Local experts with deep knowledge of the region
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Safety First</h4>
                      <p className="text-sm text-gray-600 font-body">
                        All safety equipment and protocols included
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Camera className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Photo Opportunities</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Stunning locations perfect for memorable photos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Authentic Experience</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Genuine cultural immersion and local interactions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="card-title">About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="body-text text-gray-700 space-y-4">
                  <p>
                    Embark on an unforgettable journey with our {service.name} experience, designed to showcase 
                    the best of Thar Desert's natural beauty and rich cultural heritage. Our expert guides will 
                    take you through landscapes that have remained unchanged for centuries.
                  </p>
                  <p>
                    This carefully curated experience combines adventure with cultural immersion, offering you 
                    the chance to witness traditional desert life, interact with local communities, and create 
                    memories that will last a lifetime.
                  </p>
                  <p>
                    Whether you're seeking adventure, cultural enrichment, or simply a unique way to connect 
                    with nature, this experience offers something special for every traveler. All equipment 
                    and refreshments are provided for your comfort and safety.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div>
            <Card className="sticky top-8 border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <div className="text-center">
                  <div className="price-text text-gray-900">₹{service.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 font-body">per person</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participants
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(Math.max(1, Math.min(service.maxParticipants, parseInt(e.target.value) || 1)))}
                      className="flex-1 px-3 py-2 text-center border-0 focus:ring-0"
                      min="1"
                      max={service.maxParticipants}
                    />
                    <button
                      type="button"
                      onClick={() => setParticipants(Math.min(service.maxParticipants, participants + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum {service.maxParticipants} participants
                  </p>
                </div>

                <div className="text-sm text-gray-600 font-body">
                  Total: ₹{(service.price * participants).toLocaleString()}
                </div>
                
                <div className="space-y-3">
                  <Button 
                    asChild 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md cta-button"
                  >
                    <Link href={`/contact?service=${service.id}&date=${selectedDate}&participants=${participants}&type=booking`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Experience
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full rounded-md cta-button border-gray-200 hover:border-gray-300"
                  >
                    <Link href={`/contact?service=${service.id}&type=inquiry`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Ask Questions
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600 font-body space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Free cancellation up to 48 hours
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      24/7 support available
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Safety equipment included
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