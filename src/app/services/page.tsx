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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
        setAllProducts(allProducts);
        setFeaturedProducts(allProducts.slice(0, 8)); // Show up to 8 products in horizontal scroll
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

      {/* Best Property Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-6">Our Premier Desert Property</h2>
            <p className="body-text text-lg text-gray-600 max-w-3xl mx-auto">
              Experience authentic desert living at its finest with our flagship accommodation
            </p>
          </div>
          
          {featuredProperties.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                      {featuredProperties[0].images && featuredProperties[0].images.length > 0 ? (
                        <Image
                          src={featuredProperties[0].images[0]}
                          alt={featuredProperties[0].name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 flex items-center justify-center">
                          <div className="text-center">
                            <Tent className="h-20 w-20 text-amber-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-amber-800">{featuredProperties[0].name}</h3>
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
                      <Badge className="bg-orange-600 text-white px-6 py-3 text-lg font-bold rounded-full shadow-lg">
                        ₹{featuredProperties[0].price}/night
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Additional Images */}
                  {featuredProperties[0].images && featuredProperties[0].images.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {featuredProperties[0].images.slice(1, 4).map((image, index) => (
                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <Image
                            src={image}
                            alt={`${featuredProperties[0].name} - View ${index + 2}`}
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
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">{featuredProperties[0].name}</h3>
                    <div className="flex items-center gap-6 text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">{featuredProperties[0].location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-orange-600" />
                        <span>Up to {featuredProperties[0].capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500 fill-current" />
                        <span>4.9 (127 reviews)</span>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      {featuredProperties[0].description}
                    </p>
                  </div>

                  {/* Amenities */}
                  {featuredProperties[0].amenities && featuredProperties[0].amenities.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-900">What's Included</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {featuredProperties[0].amenities.slice(0, 8).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="capitalize">{amenity.replace('-', ' ')}</span>
                          </div>
                        ))}
                      </div>
                      {featuredProperties[0].amenities.length > 8 && (
                        <p className="text-gray-500 text-sm">
                          +{featuredProperties[0].amenities.length - 8} more amenities
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleViewDetails(featuredProperties[0].id)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-8 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 rounded-full py-4 font-semibold"
                      onClick={() => handleViewDetails(featuredProperties[0].id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-6 w-max">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="flex-none w-80 group overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white hover:border-orange-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                          <TreePine className="h-20 w-20 text-orange-600" />
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Badges */}
                    {product.organic && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 text-white px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                          <TreePine className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      </div>
                    )}
                    
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-amber-600 text-white px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm leading-relaxed">
                        {product.shortDescription || product.description}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-orange-600">₹{product.price}</div>
                        <div className="text-sm text-gray-500">per {product.unit}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/products/${product.id}`);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart functionality can be added here
                            router.push(`/products/${product.id}`);
                          }}
                        >
                          <TreePine className="h-4 w-4 mr-1" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold"
              >
                View All Products
                <TreePine className="h-5 w-5 ml-2" />
              </Button>
            </Link>
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