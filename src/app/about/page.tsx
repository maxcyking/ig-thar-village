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
  Sprout
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: Users, value: "525+", label: "Farmers Trained", color: "text-amber-600" },
    { icon: Leaf, value: "1000+", label: "Acres Under Organic", color: "text-green-600" },
    { icon: Home, value: "50+", label: "Families Supported", color: "text-blue-600" },
    { icon: Award, value: "15+", label: "Awards Received", color: "text-purple-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in empowering local communities and preserving traditional knowledge while promoting sustainable development.",
      color: "text-red-500"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Our commitment to organic farming and eco-friendly practices ensures a healthier planet for future generations.",
      color: "text-green-500"
    },
    {
      icon: Handshake,
      title: "Authenticity",
      description: "Every experience we offer is rooted in genuine local culture, traditions, and time-tested practices of the Thar Desert.",
      color: "text-amber-500"
    },
    {
      icon: Target,
      title: "Impact Driven",
      description: "We measure success not just in profits, but in the positive impact we create for farmers and rural communities.",
      color: "text-blue-500"
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description: "IG Thar Village was established with a vision to bridge traditional wisdom with modern sustainable practices.",
      icon: Sunrise
    },
    {
      year: "2019",
      title: "First Training Program",
      description: "Launched our inaugural farmer training program, reaching 50 farmers in the first year.",
      icon: BookOpen
    },
    {
      year: "2020",
      title: "Organic Certification",
      description: "Achieved organic certification for our farming practices and helped 100+ farmers transition to organic methods.",
      icon: Sprout
    },
    {
      year: "2021",
      title: "Tourism Initiative",
      description: "Expanded into sustainable tourism, offering authentic desert experiences while supporting local communities.",
      icon: Mountain
    },
    {
      year: "2022",
      title: "500+ Farmers Milestone",
      description: "Reached our goal of training over 500 farmers, impacting thousands of lives across rural Rajasthan.",
      icon: Users
    },
    {
      year: "2023",
      title: "Digital Platform Launch",
      description: "Launched our comprehensive digital platform connecting farmers directly with consumers and tourists.",
      icon: Globe
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-medium">
              <Heart className="h-4 w-4 mr-2" />
              About IG Thar Village
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bridging 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Tradition </span>
              & 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Innovation</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-light">
              Empowering rural communities through sustainable agriculture, authentic experiences, 
              and the timeless wisdom of the Thar Desert.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full">
                <Users className="h-5 w-5 mr-2" />
                Our Impact
              </Button>
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-full">
                <MapPin className="h-5 w-5 mr-2" />
                Visit Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To increase farmers' income and promote organic agriculture awareness for the betterment 
                    of farmers and society. We are dedicated to empowering rural communities through sustainable 
                    farming practices and authentic desert experiences.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To create a thriving ecosystem where traditional knowledge meets modern innovation, 
                    ensuring sustainable livelihoods for rural communities while preserving the rich 
                    cultural heritage of the Thar Desert.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <TreePine className="h-24 w-24 text-amber-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Rooted in Heritage</h3>
                      <p className="text-gray-600 px-6">Growing sustainably for generations</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Wheat className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every number tells a story of transformed lives, sustainable practices, and thriving communities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-opacity-10 flex items-center justify-center ${stat.color.replace('text-', 'bg-')}`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to transforming rural communities across Rajasthan
              </p>
            </div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:w-1/2">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                            <milestone.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 text-lg px-3 py-1 font-semibold">
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-amber-100 to-green-100 rounded-full flex items-center justify-center">
                      <milestone.icon className="h-24 w-24 text-amber-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do and every decision we make
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${value.color.replace('text-', 'bg-')}`}>
                        <value.icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our comprehensive approach to sustainable development and community empowerment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wheat className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Organic Agriculture</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Training farmers in sustainable organic farming practices, helping them transition 
                    from conventional to organic methods with proven techniques.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Organic certification assistance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Soil health improvement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Natural pest management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mountain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Desert Tourism</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Offering authentic desert experiences that showcase local culture while 
                    providing sustainable income opportunities for rural communities.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      Cultural immersion programs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      Traditional accommodation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      Local guide training
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Community Development</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Building stronger rural communities through education, skill development, 
                    and sustainable livelihood programs.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Farmer training programs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Women empowerment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Youth skill development
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Founder/Team Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Guided by passionate leaders committed to sustainable development and community empowerment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Founder & Director</h3>
                  <p className="text-amber-600 font-medium mb-4">Visionary Leader</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    With deep roots in Rajasthani agriculture and a passion for sustainable development, 
                    our founder has dedicated their life to empowering rural communities.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Agriculture Expert</h3>
                  <p className="text-green-600 font-medium mb-4">Organic Specialist</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Leading our organic farming initiatives with extensive knowledge of traditional 
                    and modern sustainable agricultural practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mountain className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tourism Director</h3>
                  <p className="text-blue-600 font-medium mb-4">Experience Curator</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Creating authentic desert experiences that celebrate local culture while 
                    ensuring sustainable tourism practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Be part of a movement that's transforming rural communities and preserving 
              traditional wisdom for future generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-full">
                  <Mountain className="h-5 w-5 mr-2" />
                  Experience the Desert
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-full">
                  <Leaf className="h-5 w-5 mr-2" />
                  Shop Organic Products
                </Button>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>Barmer, Rajasthan, India</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+91 XXXXX XXXXX</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>info@igtharvillage.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}