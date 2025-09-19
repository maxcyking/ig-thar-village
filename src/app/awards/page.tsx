"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Trophy, Star, Medal, Users, Leaf, Download, ExternalLink, Quote, ArrowRight, CheckCircle } from "lucide-react";
import { getAwards, type Award as AwardType } from "@/lib/database";

const categoryIcons = {
  sustainability: Leaf,
  tourism: Trophy,
  hospitality: Medal,
  culture: Award,
  community: Users,
  agriculture: Leaf,
  innovation: Star,
  other: Medal
};

const categoryColors = {
  sustainability: "text-green-600 bg-green-50",
  tourism: "text-blue-600 bg-blue-50",
  hospitality: "text-purple-600 bg-purple-50",
  culture: "text-orange-600 bg-orange-50",
  community: "text-pink-600 bg-pink-50",
  agriculture: "text-emerald-600 bg-emerald-50",
  innovation: "text-indigo-600 bg-indigo-50",
  other: "text-gray-600 bg-gray-50"
};

// Static recognitions data
const recognitions = [
  {
    title: "Featured in National Geographic",
    description: "IG Thar Village was featured as one of the authentic desert experiences in India.",
    year: "2024"
  },
  {
    title: "Travel Magazine Spotlight",
    description: "Highlighted in leading travel publications for unique cultural tourism offerings.",
    year: "2024"
  },
  {
    title: "Documentary Feature",
    description: "Featured in a documentary about sustainable tourism practices in Rajasthan.",
    year: "2023"
  },
  {
    title: "Government Partnership",
    description: "Selected as a model for rural tourism development by the state government.",
    year: "2023"
  }
];

export default function AwardsPage() {
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadAwards = async () => {
      try {
        const awardData = await getAwards();
        setAwards(awardData);
      } catch (error) {
        console.error("Error loading awards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAwards();
  }, []);

  const filteredAwards = selectedCategory === "all" 
    ? awards 
    : awards.filter(award => award.category === selectedCategory);

  const categories = [
    { value: "all", label: "All Awards" },
    ...Array.from(new Set(awards.map(award => award.category))).map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Awards & Recognition
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Celebrating our commitment to authentic desert experiences, sustainable tourism, and cultural preservation
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2 backdrop-blur-sm">
                <Trophy className="h-4 w-4 mr-2" />
                {awards.length}+ Awards
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2 backdrop-blur-sm">
                <Star className="h-4 w-4 mr-2" />
                Multi-year Recognition
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Verified Excellence
              </Badge>
            </div>
            {awards.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Array.from(new Set(awards.map(a => a.year))).slice(0, 4).map((year) => (
                  <div key={year} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{year}</div>
                    <div className="text-sm text-white/80">
                      {awards.filter(a => a.year === year).length} Awards
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="rounded-full"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Awards Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recognition for our dedication to preserving desert culture and promoting sustainable tourism
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAwards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAwards.map((award) => {
                const IconComponent = categoryIcons[award.category as keyof typeof categoryIcons] || Medal;
                const colorClass = categoryColors[award.category as keyof typeof categoryColors] || "text-gray-600 bg-gray-50";
                
                return (
                  <Card key={award.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 cursor-pointer h-72 rounded-xl">
                    {/* Certificate Image Background */}
                    <div className="absolute inset-0">
                      {award.certificateUrl ? (
                        <img
                          src={award.certificateUrl}
                          alt={award.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : award.imageUrl ? (
                        <img
                          src={award.imageUrl}
                          alt={award.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${colorClass.split(' ').slice(-1)[0]} bg-gradient-to-br from-gray-100 to-gray-200`}>
                          <IconComponent className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                      {/* Top badges */}
                      <div className="flex items-start justify-between">
                        {award.featured && (
                          <Badge className="bg-yellow-500/90 text-white border-0 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                          {award.year}
                        </Badge>
                      </div>
                      
                      {/* Bottom content */}
                      <div className="space-y-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs capitalize bg-white/20 text-white border-white/30 backdrop-blur-sm w-fit"
                        >
                          {award.category.replace("-", " ")}
                        </Badge>
                        
                        <h3 className="text-lg font-bold leading-tight line-clamp-2">
                          {award.title}
                        </h3>
                        
                        <p className="text-sm text-white/90 font-medium">
                          {award.organization}
                        </p>
                        
                        {/* Hidden description that appears on hover */}
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <p className="text-xs text-white/80 leading-relaxed line-clamp-3 mb-3">
                            {award.description}
                          </p>
                          
                          {award.certificateUrl && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-xs h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(award.certificateUrl, '_blank');
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              View Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedCategory === "all" ? "No Awards Yet" : "No Awards in This Category"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedCategory === "all" 
                  ? "We're working hard to earn recognition for our authentic desert experiences and sustainable practices."
                  : `No awards found in the ${categories.find(c => c.value === selectedCategory)?.label} category. Check out other categories.`
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Media Recognition */}
      <section className="py-16 agricultural-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Media Recognition
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Featured in leading publications and media outlets for our authentic desert experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {recognitions.map((recognition, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{recognition.title}</CardTitle>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {recognition.year}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">{recognition.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials from Award Bodies */}
      {(awards.some(award => award.testimonial) || awards.length > 0) && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What They Say About Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Testimonials from award organizations and recognition bodies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Dynamic testimonials from awards */}
              {awards
                .filter(award => award.testimonial && award.testimonialAuthor)
                .slice(0, 2)
                .map((award) => (
                  <Card key={award.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Quote className="h-8 w-8 text-primary/20 mr-3" />
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                        "{award.testimonial}"
                      </blockquote>
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-2 mr-4">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{award.testimonialAuthor}</p>
                          <p className="text-sm text-gray-600">{award.testimonialPosition}</p>
                          <p className="text-xs text-primary mt-1">Related to: {award.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {/* Static testimonials if no dynamic ones or to fill slots */}
              {awards.filter(award => award.testimonial && award.testimonialAuthor).length < 2 && (
                <>
                  <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Quote className="h-8 w-8 text-primary/20 mr-3" />
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                        "IG Thar Village represents the perfect blend of authentic cultural preservation 
                        and sustainable tourism practices. Their commitment to showcasing traditional 
                        desert life while supporting local communities is truly commendable."
                      </blockquote>
                      <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-2 mr-4">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dr. Rajesh Sharma</p>
                          <p className="text-sm text-gray-600">Director, Rajasthan Tourism Board</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {awards.filter(award => award.testimonial && award.testimonialAuthor).length === 0 && (
                    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-center mb-6">
                          <Quote className="h-8 w-8 text-primary/20 mr-3" />
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                          "The innovative approach of Dr. Devaram Pawar and Dhapu in creating authentic 
                          desert experiences while maintaining ecological balance sets a new standard 
                          for rural tourism in India."
                        </blockquote>
                        <div className="flex items-center">
                          <div className="bg-primary/10 rounded-full p-2 mr-4">
                            <Medal className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Prof. Meera Joshi</p>
                            <p className="text-sm text-gray-600">Cultural Heritage Expert</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Future Goals */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <ArrowRight className="h-4 w-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">Looking Ahead</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Our Vision Forward
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Continuing our mission to preserve desert culture and promote sustainable tourism
              while setting new standards for authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">National Recognition</h3>
                <p className="text-white/80 leading-relaxed">
                  Aiming for national-level awards for cultural preservation and sustainable tourism excellence, 
                  setting benchmarks for authentic desert experiences.
                </p>
              </div>
            </div>

            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community Impact</h3>
                <p className="text-white/80 leading-relaxed">
                  Expanding our positive impact on local communities through increased tourism, 
                  employment generation, and preservation of traditional livelihoods.
                </p>
              </div>
            </div>

            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sustainability Leadership</h3>
                <p className="text-white/80 leading-relaxed">
                  Becoming a model for sustainable desert tourism practices across India and beyond, 
                  inspiring others to follow our eco-friendly approach.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Our Journey
              </h3>
              <p className="text-white/90 mb-6">
                Be part of our mission to preserve desert heritage while creating meaningful, 
                sustainable tourism experiences.
              </p>
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
                onClick={() => window.location.href = '/contact'}
              >
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}