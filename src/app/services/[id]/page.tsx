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
  Clock,
  Star,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Mountain,
  Camera,
  Tent,
  TreePine,
  Activity,
  Shield,
  Award
} from "lucide-react";
import { getService, type Service } from "@/lib/database";
import { SocialShare } from "@/components/ui/social-share";

const categoryIcons: { [key: string]: any } = {
  'safari': Mountain,
  'cultural': Heart,
  'adventure': Tent,
  'spiritual': TreePine,
  'educational': Camera,
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchService(params.id as string);
    }
  }, [params.id]);

  const fetchService = async (id: string) => {
    try {
      const serviceData = await getService(id);
      setService(serviceData);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!service) return;
    router.push(`/booking/service/${service.id}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/services')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[service.category] || Mountain;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/services')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Services
          </Button>
          <span>/</span>
          <span className="capitalize">{service.category}</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{service.name}</span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                {service.images && service.images.length > 0 ? (
                  <Image
                    src={service.images[selectedImageIndex]}
                    alt={service.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <CategoryIcon className="h-24 w-24 text-blue-400" />
                  </div>
                )}
              </div>
              
              {service.images && service.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${service.name} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {service.category}
                  </Badge>
                  {service.featured && (
                    <Badge className="bg-orange-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                
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
                  <span className="text-sm text-gray-500">(4.7 - 89 reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{service.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Duration: {service.duration}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Up to {service.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm capitalize">{service.category} Experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Certified Guide</span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${
                  service.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    service.available ? 'bg-green-600' : 'bg-red-600'
                  }`} />
                  <span className="font-medium">
                    {service.available ? 'Available for Booking' : 'Currently Unavailable'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {service.available && (
                <div className="space-y-3">
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book This Experience
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
                      title={service.name}
                      description={service.description}
                      image={service.images?.[0] || ''}
                    />
                  </div>
                </div>
              )}

              {/* Quick Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Expert local guide included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Authentic cultural experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <span>Photography opportunities</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Small group experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mt-16 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Join us for an authentic desert experience that showcases the rich cultural heritage 
                  and natural beauty of the Thar Desert. Our expert local guides will take you on a 
                  journey through time, sharing stories, traditions, and hidden gems that only locals know.
                </p>
              </CardContent>
            </Card>

            {/* What's Included */}
            {service.included && service.included.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.included.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Experience Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Welcome & Introduction</h4>
                      <p className="text-sm text-gray-600">Meet your guide and get oriented with the experience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Main Activity</h4>
                      <p className="text-sm text-gray-600">Enjoy the core experience with expert guidance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Cultural Immersion</h4>
                      <p className="text-sm text-gray-600">Learn about local traditions and history</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Refreshments & Conclusion</h4>
                      <p className="text-sm text-gray-600">Enjoy traditional refreshments and share experiences</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What to Bring</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comfortable walking shoes</li>
                    <li>• Sun protection (hat, sunscreen)</li>
                    <li>• Water bottle</li>
                    <li>• Camera for memorable moments</li>
                    <li>• Light jacket for evening experiences</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-gray-600">
                    Free cancellation up to 24 hours before the experience. 
                    50% refund for cancellations within 24 hours. No refund for no-shows.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Safety Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Follow guide instructions at all times</li>
                    <li>• Stay with the group during the experience</li>
                    <li>• Inform guide of any medical conditions</li>
                    <li>• Experience may be modified due to weather conditions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}