import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertiesSection } from "@/components/home/properties-section";
import { ProductsSection } from "@/components/home/products-section";
import { ServicesSection } from "@/components/home/services-section";
import EnhancedHero from "@/components/enhanced-hero";
import { 
  Mountain, 
  Tent, 
  Utensils, 
  Camera, 
  TreePine, 
  Users, 
  Star,
  Quote,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Leaf,
  Sun,
  Heart,
  Shield,
  Clock,
  Globe,
  ArrowRight,
  Play
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Tent,
    title: "Authentic Farm Stay",
    description: "Experience traditional mud houses built with natural materials in the heart of Thar Desert",
    color: "text-green-600"
  },
  {
    icon: Mountain,
    title: "Desert Adventures",
    description: "Thrilling jeep safaris and camel rides across the magnificent sand dunes",
    color: "text-orange-600"
  },
  {
    icon: Utensils,
    title: "Organic Cuisine",
    description: "Savor authentic Rajasthani dishes made with fresh, organic ingredients",
    color: "text-blue-600"
  },
  {
    icon: Users,
    title: "Cultural Immersion",
    description: "Witness traditional Ghoomar dance and Langa folk music performances",
    color: "text-purple-600"
  },
  {
    icon: TreePine,
    title: "Sustainable Farming",
    description: "Learn about innovative organic farming practices in arid regions",
    color: "text-green-600"
  },
  {
    icon: Camera,
    title: "Heritage Tours",
    description: "Visit sacred sites and historic landmarks of Rajasthani culture",
    color: "text-orange-600"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "An absolutely magical experience! The authentic desert lifestyle, warm hospitality, and organic food made our stay unforgettable. Dr. Devaram and Dhapu are wonderful hosts.",
    image: "👩‍💼",
    experience: "Desert Explorer Package"
  },
  {
    name: "Rajesh Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "Perfect blend of adventure and culture. The camel safari at sunset was breathtaking, and the traditional performances were mesmerizing. Highly recommended!",
    image: "👨‍💻",
    experience: "Cultural Heritage Package"
  },
  {
    name: "Emma Wilson",
    location: "London, UK",
    rating: 5,
    text: "The organic products are exceptional! Fresh goat milk, traditional grains, and desert vegetables - everything was pure and delicious. A true farm-to-table experience.",
    image: "👩‍🎨",
    experience: "Farm Visit & Products"
  },
  {
    name: "Amit Patel",
    location: "Delhi, India",
    rating: 5,
    text: "Educational and inspiring! Learning about sustainable farming in the desert was fascinating. The mud house accommodation was surprisingly comfortable and authentic.",
    image: "👨‍🔬",
    experience: "Farm Stay Experience"
  }
];

// Stats moved to EnhancedHero component



export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Enhanced Desert Hero Section */}
      <EnhancedHero />

      {/* Showcase Cards Section - New */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 font-accent rounded-md">
              Experience Highlights
            </Badge>
            <h2 className="section-title text-gray-900 mb-6">
              Why Choose IG Thar Village
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="group hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="card-title text-gray-900 mb-2">100% Organic</h3>
                <p className="body-text text-gray-600 text-sm">Chemical-free farming and pure products from our sustainable farm</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h3 className="card-title text-gray-900 mb-2">Authentic Culture</h3>
                <p className="body-text text-gray-600 text-sm">Traditional lifestyle and genuine cultural immersion experiences</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="card-title text-gray-900 mb-2">Warm Hospitality</h3>
                <p className="body-text text-gray-600 text-sm">Genuine care and personalized service from local hosts</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="card-title text-gray-900 mb-2">Award Winning</h3>
                <p className="body-text text-gray-600 text-sm">Recognized excellence in sustainable tourism and hospitality</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Accommodations Section */}
      <PropertiesSection />

      {/* Products Section */}
      <ProductsSection />

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 font-accent rounded-md">
              Our Experiences
            </Badge>
            <h2 className="section-title text-gray-900 mb-6">
              Immerse in Desert Culture
            </h2>
            <p className="body-text text-xl text-gray-600 max-w-3xl mx-auto">
              From traditional farming practices to cultural performances, 
              discover the authentic lifestyle of Rajasthan's desert communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="card-title text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="body-text text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* About Preview Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 font-accent rounded-md">
                Our Story
              </Badge>
              <h2 className="section-title text-gray-900 mb-6">
                Founded by Visionary
                <span className="block text-green-600">Farmer Couple</span>
              </h2>
              <p className="body-text text-lg text-gray-700 mb-6 leading-relaxed">
                Established in 2023 by Dr. Devaram Pawar and Dhapu, IG Thar Village represents 
                a revolutionary approach to sustainable tourism and cultural preservation in the 
                heart of Rajasthan's Thar Desert.
              </p>
              <p className="body-text text-lg text-gray-700 mb-8 leading-relaxed">
                Our mission extends beyond hospitality - we're dedicated to promoting innovation 
                in agriculture, preserving traditional desert culture, and creating meaningful 
                connections between visitors and authentic rural life.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="body-text text-gray-700">Sustainable Practices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="body-text text-gray-700">Cultural Preservation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="body-text text-gray-700">Organic Farming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="body-text text-gray-700">Community Support</span>
                </div>
              </div>

              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-md cta-button">
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="glass-effect rounded-lg p-8 shadow-sm border border-gray-100">
                <h3 className="card-title text-gray-900 mb-6">What Makes Us Special</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">100% Organic</h4>
                      <p className="text-gray-600 text-sm">Chemical-free farming and pure products</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Sun className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Authentic Experience</h4>
                      <p className="text-gray-600 text-sm">Traditional lifestyle and cultural immersion</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Warm Hospitality</h4>
                      <p className="text-gray-600 text-sm">Genuine care and personalized service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 font-accent rounded-md">
              Guest Stories
            </Badge>
            <h2 className="section-title text-gray-900 mb-6">
              What Our Guests Say
            </h2>
            <p className="body-text text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from travelers who discovered the magic of authentic desert life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-effect border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gray-400 mb-4" />
                  <p className="body-text text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-accent">{testimonial.name}</h4>
                      <p className="body-text text-gray-600 text-sm">{testimonial.location}</p>
                      <Badge variant="outline" className="mt-1 text-xs font-accent rounded-md border-gray-200">
                        {testimonial.experience}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 font-accent rounded-md">
              Why Choose Us
            </Badge>
            <h2 className="section-title text-gray-900 mb-6">
              Trusted by Travelers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="card-title text-gray-900 mb-2">Authentic & Safe</h3>
              <p className="body-text text-gray-600">Genuine experiences with complete safety and comfort</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="card-title text-gray-900 mb-2">24/7 Support</h3>
              <p className="body-text text-gray-600">Round-the-clock assistance for all your needs</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="card-title text-gray-900 mb-2">Award Winning</h3>
              <p className="body-text text-gray-600">Recognized for excellence in sustainable tourism</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="card-title text-gray-900 mb-2">Global Reach</h3>
              <p className="body-text text-gray-600">Welcoming guests from around the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-white mb-6">
            Ready for Your Desert Adventure?
          </h2>
          <p className="body-text text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of travelers who have discovered the magic of authentic Thar Desert culture. 
            Book your unforgettable experience today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-md shadow-lg cta-button">
              <Link href="/services">
                Book Your Experience
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg rounded-md cta-button">
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}