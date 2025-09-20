"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  Users,
  Leaf,
  Award,
  Target,
  Eye,
  Handshake,
  TreePine,
  Mountain,
  Wheat,
  Home,
  BookOpen,
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  Sunrise,
  Sprout,
  Tent,
  Utensils,
  Camera,
  Compass,
  Music,
  Shirt,
  Hammer,
  Sun,
  Moon,
  Wind,
  Crown,
  Shield,
  Coffee,
  Calendar,
  Palette,
  Building
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: Users, value: "500+", label: "Happy Visitors", color: "text-amber-600" },
    { icon: Leaf, value: "100%", label: "Organic Products", color: "text-green-600" },
    { icon: Home, value: "1", label: "Authentic Experience", color: "text-orange-600" },
    { icon: Award, value: "2023", label: "Year Established", color: "text-red-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description: "Dedicated to preserving and promoting the traditional desert lifestyle, culture, and heritage of Rajasthan across the world.",
      color: "text-red-500"
    },
    {
      icon: Leaf,
      title: "Organic Innovation",
      description: "Leading innovation in agriculture and animal husbandry through organic farming practices and sustainable methods.",
      color: "text-green-500"
    },
    {
      icon: Handshake,
      title: "Authentic Experiences",
      description: "Providing genuine traditional experiences in mud houses built with natural materials in the heart of the Thar Desert.",
      color: "text-amber-500"
    },
    {
      icon: Target,
      title: "Community Empowerment",
      description: "Empowering local communities through sustainable tourism while maintaining the authenticity of traditional desert life.",
      color: "text-blue-500"
    },
  ];

  const traditionalExperiences = [
    {
      icon: Tent,
      title: "Traditional Mud Houses",
      description: "Experience authentic desert accommodation in mud houses built with cow dung, clay, and grass in the open desert.",
      color: "text-amber-600"
    },
    {
      icon: Utensils,
      title: "Rajasthani Cuisine",
      description: "Savor traditional dishes like Dal Bati Churma, Bajra Roti, Ker Sangri, with desi ghee, rab, and garlic-chili chutney.",
      color: "text-orange-600"
    },
    {
      icon: Shirt,
      title: "Traditional Attire",
      description: "Witness men in dhoti-kurta with safa and pagri, women in lahanga-lugri with chuda and mojari.",
      color: "text-red-600"
    },
    {
      icon: Hammer,
      title: "Ancient Tools",
      description: "See hand-operated flour mills, ox and camel plows, camel carts, and bullock carts in action.",
      color: "text-green-600"
    },
    {
      icon: Compass,
      title: "Desert Safaris",
      description: "Enjoy thrilling jeep safaris through sand dunes and peaceful camel rides across the desert landscape.",
      color: "text-blue-600"
    },
    {
      icon: Music,
      title: "Cultural Performances",
      description: "Experience the famous Ghoomar dance and traditional Rajasthani folk music performances.",
      color: "text-purple-600"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Foundation by Visionary Couple",
      description: "IG Thar Village was established by farmer couple Dr. Devaram Pawar and Dhapu with a mission to preserve desert culture.",
      icon: Sunrise
    },
    {
      year: "2023",
      title: "Organic Farming Initiative",
      description: "Launched innovative organic farming and animal husbandry programs in the heart of the Thar Desert.",
      icon: Sprout
    },
    {
      year: "2023",
      title: "Cultural Tourism Launch",
      description: "Started offering authentic desert experiences showcasing traditional lifestyle and culture to global visitors.",
      icon: Mountain
    },
    {
      year: "2024",
      title: "Heritage Preservation",
      description: "Expanded programs to preserve and promote traditional Rajasthani clothing, food, and cultural practices.",
      icon: Crown
    },
    {
      year: "2024",
      title: "Community Impact",
      description: "Growing impact in promoting desert culture and supporting local communities through sustainable tourism.",
      icon: Users
    },
    {
      year: "Future",
      title: "Global Outreach",
      description: "Continuing mission to spread awareness of desert culture and lifestyle to every corner of the world.",
      icon: Globe
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-yellow-600 rounded-full"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-8 bg-amber-100 text-amber-800 border-amber-200 px-6 py-3 text-lg font-medium rounded-full">
              <Crown className="h-5 w-5 mr-2" />
              About IG Thar Village
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Preserving 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Desert </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> Heritage</span>
              <span className="text-gray-900"> Since 2023</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed font-light max-w-4xl mx-auto">
              Founded by visionary farmer couple <span className="font-semibold text-amber-700">Dr. Devaram Pawar and Dhapu</span>, 
              we are dedicated to promoting traditional desert lifestyle, culture, and organic innovation 
              to every corner of the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg rounded-full shadow-lg">
                <Tent className="h-5 w-5 mr-2" />
                Experience Desert Life
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 text-lg rounded-full">
                <MapPin className="h-5 w-5 mr-2" />
                Visit Our Village
              </Button>
            </div>

            {/* Founder Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Devaram Pawar</h3>
                <p className="text-gray-600">Visionary farmer and agricultural innovator</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dhapu</h3>
                <p className="text-gray-600">Cultural preservation enthusiast and co-founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Experiences */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200 px-6 py-3 text-lg font-medium rounded-full">
                <Tent className="h-5 w-5 mr-2" />
                Authentic Desert Experiences
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Live the 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Traditional </span>
                Desert Life
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Immerse yourself in the authentic desert lifestyle with traditional accommodations, 
                cuisine, attire, and cultural performances that have been preserved for generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {traditionalExperiences.map((experience, index) => (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <experience.icon className={`h-8 w-8 ${experience.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{experience.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                      <Target className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To promote and preserve the traditional desert lifestyle, culture, clothing, and cuisine 
                    of Rajasthan, while advancing innovation in agriculture and animal husbandry. We are committed 
                    to sharing the authentic desert experience with visitors from around the world.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                      <Eye className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become a global ambassador for Rajasthani desert culture, ensuring that traditional 
                    knowledge, customs, and lifestyle are preserved and celebrated across every corner of the world, 
                    while fostering sustainable community development.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 rounded-3xl overflow-hidden shadow-xl">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <Crown className="h-24 w-24 text-amber-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Cultural Heritage</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Preserving the timeless traditions of the Thar Desert for future generations
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-1/4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-yellow-100 text-yellow-800 border-yellow-200 px-6 py-3 text-lg font-medium rounded-full">
                <Award className="h-5 w-5 mr-2" />
                Our Impact
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Desert Heritage in Numbers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Since our establishment in 2023, we've been making a meaningful impact in preserving 
                desert culture and promoting authentic experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="group text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      stat.color === 'text-amber-600' ? 'from-amber-100 to-amber-200' :
                      stat.color === 'text-green-600' ? 'from-green-100 to-green-200' :
                      stat.color === 'text-orange-600' ? 'from-orange-100 to-orange-200' :
                      'from-red-100 to-red-200'
                    }`}>
                      <stat.icon className={`h-10 w-10 ${stat.color}`} />
                    </div>
                    <div className={`text-4xl md:text-5xl font-bold mb-3 ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg font-medium rounded-full">
                <Calendar className="h-5 w-5 mr-2" />
                Our Journey
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">From Vision to Reality</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The inspiring story of how a passionate farmer couple transformed their vision 
                into a beacon of desert culture preservation and authentic experiences.
              </p>
            </div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:w-1/2">
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-10">
                        <div className="flex items-center gap-6 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <milestone.icon className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xl px-6 py-2 font-bold rounded-full border border-amber-200">
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                      <milestone.icon className="h-32 w-32 text-amber-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-green-100 text-green-800 border-green-200 px-6 py-3 text-lg font-medium rounded-full">
                <Shield className="h-5 w-5 mr-2" />
                Our Core Values
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Drives Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The fundamental principles that guide our mission to preserve desert heritage 
                and create authentic experiences for travelers worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:bg-white hover:-translate-y-2">
                  <CardContent className="p-10">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                        value.color === 'text-red-500' ? 'from-red-100 to-red-200' :
                        value.color === 'text-green-500' ? 'from-green-100 to-green-200' :
                        value.color === 'text-amber-500' ? 'from-amber-100 to-amber-200' :
                        'from-blue-100 to-blue-200'
                      }`}>
                        <value.icon className={`h-8 w-8 ${value.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Attractions */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg font-medium rounded-full">
                <Camera className="h-5 w-5 mr-2" />
                Special Attractions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Explore Sacred &
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Historic Sites</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Journey through time and spirituality as you visit ancient landmarks and sacred sites 
                that tell the story of Rajasthan's rich heritage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white">
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Crown className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Baba Ramdev Ji's Birthplace</h3>
                  <p className="text-gray-700 leading-relaxed text-center mb-6">
                    Pay homage at the sacred birthplace of Baba Ramdev Ji, the revered folk deity of Rajasthan. 
                    Experience the spiritual energy and rich history of this holy site.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Sacred pilgrimage site</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Historical significance</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Spiritual experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white">
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Historic Batadu Well</h3>
                  <p className="text-gray-700 leading-relaxed text-center mb-6">
                    Marvel at the architectural wonder of Rajasthan's famous step-well, known as the "Jal Mahal" 
                    (Water Palace) - a testament to ancient engineering and water conservation.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Ancient architecture</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Water conservation marvel</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Photography paradise</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desert Activities */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Desert Adventure Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Sun className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Jeep Safari</h4>
                  <p className="text-sm text-gray-600">Thrilling rides through sand dunes</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Compass className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Camel Safari</h4>
                  <p className="text-sm text-gray-600">Traditional desert ship rides</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Music className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ghoomar Dance</h4>
                  <p className="text-sm text-gray-600">Traditional Rajasthani performances</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Hammer className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Traditional Crafts</h4>
                  <p className="text-sm text-gray-600">Ancient tools and craftsmanship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder/Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gray-100 text-gray-800 border-gray-200 px-6 py-3 text-lg font-medium rounded-full">
                <Users className="h-5 w-5 mr-2" />
                Our Founders
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Visionary Leaders</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Meet the passionate farmer couple who transformed their vision of preserving 
                desert heritage into a reality that inspires visitors from around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white text-center group hover:-translate-y-2">
                <CardContent className="p-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Dr. Devaram Pawar</h3>
                  <p className="text-amber-600 font-semibold mb-6 text-lg">Co-Founder & Agricultural Innovator</p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    A visionary farmer with deep expertise in agriculture and animal husbandry. 
                    Dr. Pawar brings innovative organic farming practices to the arid landscapes 
                    of the Thar Desert, combining traditional wisdom with modern techniques.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">Agricultural Innovation Expert</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">Organic Farming Pioneer</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">Community Development Leader</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white text-center group hover:-translate-y-2">
                <CardContent className="p-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Heart className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Dhapu</h3>
                  <p className="text-red-600 font-semibold mb-6 text-lg">Co-Founder & Cultural Heritage Keeper</p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The heart behind preserving and promoting traditional desert culture. 
                    Dhapu is passionate about sharing authentic Rajasthani lifestyle, cuisine, 
                    clothing, and customs with visitors from across the globe.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-600">Cultural Preservation Expert</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-600">Traditional Cuisine Specialist</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-600">Heritage Tourism Guide</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Joint Vision */}
            <div className="mt-16 text-center">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 max-w-4xl mx-auto">
                <CardContent className="p-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Shared Vision</h3>
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    "Together, we are committed to preserving the authentic desert heritage of Rajasthan 
                    and sharing its timeless beauty with visitors from every corner of the world. Our goal 
                    is to ensure that traditional culture, organic practices, and genuine hospitality 
                    continue to thrive for generations to come."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3 text-lg font-medium rounded-full backdrop-blur-sm">
              <Tent className="h-5 w-5 mr-2" />
              Experience Authentic Desert Life
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready for Your
              <span className="block text-yellow-200"> Desert Adventure?</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
              Join thousands of travelers who have discovered the magic of authentic Rajasthani culture. 
              Experience traditional mud houses, savor organic cuisine, and witness the timeless beauty 
              of the Thar Desert with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/services">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-5 text-lg rounded-2xl shadow-2xl">
                  <Compass className="h-6 w-6 mr-3" />
                  Book Desert Experience
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-5 text-lg rounded-2xl backdrop-blur-sm">
                  <Tent className="h-6 w-6 mr-3" />
                  View Accommodations
                </Button>
              </Link>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MapPin className="h-8 w-8 mx-auto mb-4 text-yellow-200" />
                <h3 className="font-bold mb-2">Visit Us</h3>
                <p className="text-sm opacity-90">Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Phone className="h-8 w-8 mx-auto mb-4 text-yellow-200" />
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-sm opacity-90">+91 8302676869</p>
                <p className="text-xs opacity-75 mt-1">Available 24/7</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Mail className="h-8 w-8 mx-auto mb-4 text-yellow-200" />
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-sm opacity-90">info@igtharvillage.com</p>
                <p className="text-xs opacity-75 mt-1">Quick response guaranteed</p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 mb-2 text-yellow-200" />
                  <span className="text-sm font-medium">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6 mb-2 text-yellow-200" />
                  <span className="text-sm font-medium">Warm Hospitality</span>
                </div>
                <div className="flex flex-col items-center">
                  <Leaf className="h-6 w-6 mb-2 text-yellow-200" />
                  <span className="text-sm font-medium">Organic Experience</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="h-6 w-6 mb-2 text-yellow-200" />
                  <span className="text-sm font-medium">Award Winning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}