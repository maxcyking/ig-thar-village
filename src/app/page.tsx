import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertiesSection } from "@/components/home/properties-section";
import { ProductsSection } from "@/components/home/products-section";
import { ServicesSection } from "@/components/home/services-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import EnhancedHero from "@/components/enhanced-hero";
import TestimonialsSection from "@/components/testimonials/testimonials-section";
import {
  Mountain,
  Tent,
  Utensils,
  Camera,
  TreePine,
  Users,
  Award,
  Phone,
  CheckCircle,
  Leaf,
  Sun,
  Heart,
  Shield,
  Clock,
  Globe,
  ArrowRight
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
    title: "Natural Cuisine",
    description: "Savor authentic Rajasthani dishes made with fresh, natural ingredients",
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
    description: "Learn about innovative natural farming practices in arid regions",
    color: "text-green-600"
  },
  {
    icon: Camera,
    title: "Heritage Tours",
    description: "Visit sacred sites and historic landmarks of Rajasthani culture",
    color: "text-orange-600"
  }
];



// Stats moved to EnhancedHero component

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Enhanced Desert Hero Section */}
      <EnhancedHero />

      {/* Ultra-Compact Cool Showcase Section */}
      <section className="py-4 sm:py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Mobile: Compact 4-column grid */}
          <div className="grid grid-cols-4 gap-3 sm:hidden">
            <div className="group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Natural</span>
            </div>

            <div className="group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Culture</span>
            </div>

            <div className="group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Care</span>
            </div>

            <div className="group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Awards</span>
            </div>
          </div>

          {/* Desktop: Elegant horizontal layout */}
          <div className="hidden sm:flex justify-center items-center space-x-8 lg:space-x-12">
            <div className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">100% Natural</h3>
                <p className="text-sm text-gray-600">Chemical-free farming</p>
              </div>
            </div>

            <div className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                <Sun className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Authentic Culture</h3>
                <p className="text-sm text-gray-600">Traditional lifestyle</p>
              </div>
            </div>

            <div className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Warm Hospitality</h3>
                <p className="text-sm text-gray-600">Genuine care</p>
              </div>
            </div>

            <div className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Award Winning</h3>
                <p className="text-sm text-gray-600">Excellence recognized</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Accommodations Section */}
      <PropertiesSection />

      {/* Products Section */}
      <ProductsSection />

      {/* Compact Features Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-blue-100 text-blue-800 border-blue-200 font-accent rounded-md">
              Our Experiences
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Desert Culture Immersion
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Authentic experiences that connect you with traditional Rajasthani desert life
            </p>
          </div>

          {/* Compact 2x2 Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.slice(0, 4).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group text-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Features - Mobile Hidden, Desktop Minimal */}
          <div className="hidden lg:grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-4">
            {features.slice(4).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index + 4} className="group text-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
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
                  <span className="body-text text-gray-700">Natural Farming</span>
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
                      <h4 className="font-semibold text-gray-900">100% Natural</h4>
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



      {/* Dynamic Testimonials Section */}
      <TestimonialsSection showForm={true} maxTestimonials={4} featured={true} />

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