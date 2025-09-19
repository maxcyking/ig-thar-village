"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Service, getServices, Product, getProducts, Property, getProperties } from "@/lib/database";
import { PropertyCard } from "@/components/ui/property-card";
import { 
  Search, 
  Clock,
  Users,
  Star,
  Mountain,
  Heart,
  Tent,
  TreePine,
  Camera,
  Calendar,
  MapPin,
  CheckCircle
} from "lucide-react";
import Image from "next/image";

const categoryIcons: { [key: string]: any } = {
  'safari': Mountain,
  'cultural': Heart,
  'adventure': Tent,
  'spiritual': TreePine,
  'educational': Camera,
};

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { value: "all", label: "All Services" },
    { value: "safari", label: "Safari" },
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Adventure" },
    { value: "spiritual", label: "Spiritual" },
    { value: "educational", label: "Educational" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allServices, allProducts, allProperties] = await Promise.all([
          getServices(),
          getProducts(),
          getProperties()
        ]);
        
        setServices(allServices);
        setFeaturedProducts(allProducts.filter(product => product.featured).slice(0, 3));
        setFeaturedProperties(allProperties.filter(property => property.featured).slice(0, 3));
        setFeaturedServices(allServices.filter(service => service.featured).slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesFeatured = !showOnlyFeatured || service.featured;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const handleViewDetails = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Properties Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="desert-title text-gray-900 mb-8">
              Desert Accommodations
            </h1>
            <p className="body-text text-xl text-gray-700 max-w-4xl mx-auto mb-12">
              Experience authentic desert living in our carefully curated accommodations. From traditional mud houses 
              to luxury desert camps, each property offers a unique glimpse into the timeless beauty of Thar Desert life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white border border-gray-200 p-8 text-center">
                <Tent className="h-12 w-12 mb-6 mx-auto text-amber-600" />
                <h3 className="card-title mb-4 text-gray-900">Traditional Desert Camps</h3>
                <p className="body-text text-gray-600">
                  Sleep under the stars in authentic Rajasthani tents with modern amenities and traditional hospitality.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 text-center">
                <Heart className="h-12 w-12 mb-6 mx-auto text-amber-600" />
                <h3 className="card-title mb-4 text-gray-900">Heritage Properties</h3>
                <p className="body-text text-gray-600">
                  Stay in restored heritage buildings that showcase the architectural beauty of ancient Rajasthan.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-8 text-center">
                <TreePine className="h-12 w-12 mb-6 mx-auto text-amber-600" />
                <h3 className="card-title mb-4 text-gray-900">Eco-Friendly Stays</h3>
                <p className="body-text text-gray-600">
                  Sustainable accommodations built with local materials and powered by renewable energy sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Properties */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-6">Available Properties</h2>
            <p className="body-text text-lg text-gray-600 max-w-3xl mx-auto">
              Book your authentic desert experience with our carefully selected accommodations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  rating: 4.8,
                  reviewCount: Math.floor(Math.random() * 200) + 50
                }}
                onViewDetails={handleViewDetails}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(property.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-6">Organic Desert Products</h2>
            <p className="body-text text-lg text-gray-600 max-w-4xl mx-auto mb-12">
              Discover premium organic products cultivated in the unique climate of the Thar Desert. 
              Our traditional farming methods, passed down through generations, create products with distinctive 
              flavors and exceptional nutritional value.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-56">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <TreePine className="h-12 w-12 text-green-600" />
                      </div>
                    )}
                    {product.organic && (
                      <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                        Organic
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="card-title text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{product.name}</h3>
                    <p className="body-text text-gray-600 mb-4">{product.shortDescription || product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="price-text text-green-600">₹{product.price}/{product.unit}</span>
                      <Button 
                        className="cta-button bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/products/${product.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage & Mission Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="desert-title text-gray-900 mb-8">
                Authentic Thar Desert Experience
              </h2>
              <div className="bg-amber-100 border-l-4 border-amber-600 p-6 max-w-4xl mx-auto mb-12">
                <p className="text-xl font-semibold text-amber-800 italic">
                  "To increase farmers' income and promote organic agriculture awareness for the betterment of farmers and society."
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-6">
                <h3 className="heritage-title text-gray-900 mb-6">Our Mission & Heritage</h3>
                <p className="body-text text-lg text-gray-700">
                  We are dedicated to empowering rural communities through sustainable farming practices and authentic desert experiences. 
                  Based in Barmer district of Rajasthan, we work directly with local farmers to promote organic cultivation methods 
                  that have been practiced for generations in the Thar Desert.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our initiatives span across agricultural training, rural tourism, and sustainable development. 
                  From comprehensive farmer training programs to authentic desert safaris and traditional accommodations, 
                  we bridge the gap between ancient wisdom and modern sustainable practices.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Every experience we offer is rooted in authenticity, designed to showcase the rich cultural heritage 
                  of the Thar Desert while supporting local communities and preserving traditional ways of life.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">525</div>
                  <div className="text-gray-600">Farmers Trained</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">1000+</div>
                  <div className="text-gray-600">Acres Under Organic</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">Multiple</div>
                  <div className="text-gray-600">Training Programs</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">Rural</div>
                  <div className="text-gray-600">Development Focus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Desert Experiences */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-6">Featured Desert Experiences</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in the magic of the Thar Desert with our most popular experiences and cultural adventures
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredServices.map((service) => {
              const CategoryIcon = categoryIcons[service.category] || Mountain;
              return (
                <Link key={service.id} href={`/services/${service.id}`} className="group">
                  <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-56">
                      {service.images && service.images.length > 0 ? (
                        <Image
                          src={service.images[0]}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <CategoryIcon className="h-12 w-12 text-blue-600" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="card-title text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                      <p className="body-text text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="price-text text-blue-600">₹{service.price}/person</span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                      </div>
                      <Button 
                        className="cta-button w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/services/${service.id}`);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="border-gray-300"
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyFeatured}
                  onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                />
                Featured Only
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-6">All Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through our complete collection of desert experiences, tours, and cultural activities
            </p>
          </div>
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <Mountain className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service) => {
                const CategoryIcon = categoryIcons[service.category] || Mountain;
                
                return (
                  <Link key={service.id} href={`/services/${service.id}`} className="group">
                    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-56">
                        {service.images && service.images.length > 0 ? (
                          <Image
                            src={service.images[0]}
                            alt={service.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <CategoryIcon className="h-12 w-12 text-blue-600" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {service.featured && (
                            <Badge className="bg-orange-600 text-white">
                              Featured
                            </Badge>
                          )}
                          <Badge className="bg-blue-600 text-white capitalize">
                            {service.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge 
                            className={service.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                          >
                            {service.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="card-title text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {service.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Up to {service.maxParticipants}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="price-text text-blue-600">₹{service.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">per person</div>
                          </div>
                        </div>

                        <p className="body-text text-gray-600 mb-4">
                          {service.description}
                        </p>

                        {service.included && service.included.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">What's Included:</h4>
                            <div className="space-y-1">
                              {service.included.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  {item}
                                </div>
                              ))}
                              {service.included.length > 3 && (
                                <span className="text-sm text-gray-500">+{service.included.length - 3} more inclusions</span>
                              )}
                            </div>
                          </div>
                        )}

                        <Button 
                          className="cta-button w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!service.available}
                          onClick={(e) => {
                            e.preventDefault();
                            if (service.available) {
                              router.push(`/services/${service.id}`);
                            }
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {service.available ? 'View Details' : 'Unavailable'}
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}