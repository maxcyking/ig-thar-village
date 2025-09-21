"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FileText, Video, Image as ImageIcon, Newspaper, X } from "lucide-react";
import Link from "next/link";

const staticMediaItems = [
  {
    id: 1,
    type: "Press Release",
    title: "IG Thar Village Wins Best Sustainable Tourism Award 2024",
    description: "Recognition for outstanding contribution to eco-friendly tourism and cultural preservation in Rajasthan.",
    date: "March 15, 2024",
    source: "IG Thar Village",
    icon: FileText,
    category: "Press Release"
  },
  {
    id: 2,
    type: "News Article",
    title: "Desert Tourism Gets a Boost with Authentic Farm Stay Experiences",
    description: "Leading travel magazine features IG Thar Village as a model for authentic desert tourism.",
    date: "February 28, 2024",
    source: "Travel India Magazine",
    icon: Newspaper,
    category: "News Coverage"
  },
  {
    id: 3,
    type: "Video Feature",
    title: "Traditional Desert Life: A Documentary Feature",
    description: "30-minute documentary showcasing traditional desert lifestyle and sustainable farming practices.",
    date: "January 20, 2024",
    source: "Desert Heritage Channel",
    icon: Video,
    category: "Video"
  },
  {
    id: 4,
    type: "Photo Story",
    title: "Capturing the Essence of Thar Desert Culture",
    description: "Professional photography series highlighting traditional practices and cultural experiences.",
    date: "December 10, 2023",
    source: "National Geographic India",
    icon: ImageIcon,
    category: "Photography"
  }
];

const mediaKit = [
  {
    title: "High-Resolution Images",
    description: "Professional photos of accommodations, activities, and cultural experiences",
    format: "JPG, PNG",
    size: "Various sizes available"
  },
  {
    title: "Logo & Brand Assets",
    description: "Official IG Thar Village logos and brand guidelines",
    format: "PNG, SVG, PDF",
    size: "Vector and raster formats"
  },
  {
    title: "Fact Sheet",
    description: "Key information about services, awards, and company background",
    format: "PDF",
    size: "2 pages"
  },
  {
    title: "Founder Biographies",
    description: "Professional biographies of Dr. Devaram Pawar and team members",
    format: "PDF, DOC",
    size: "1 page each"
  }
];

export default function MediaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Media images from public/images/media/ (numbered 1-55)
  const mediaImages = Array.from({ length: 55 }, (_, index) => {
    const number = index + 1;
    // Determine file extension based on known patterns
    let extension = 'jpeg';
    if ([3, 12, 13, 14, 15, 16, 17, 18].includes(number)) {
      extension = 'png';
    } else if ([5, 6, 7].includes(number)) {
      extension = 'jpg';
    }
    return `${number}.${extension}`;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Media Corner
            </h1>
            <p className="text-xl text-primary/80 mb-8">
              Latest news, press releases, and media coverage about IG Thar Village
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                Press Kit Available
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                Media Inquiries Welcome
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Media Coverage */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Press Coverage & Media Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recent news articles, features, and press coverage about our authentic desert experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {staticMediaItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card key={item.id} className="rounded-lg hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <span>{item.source}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Media Images Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">Media Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mediaImages.map((imageName, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedImage(`/images/media/${imageName}`)}
                >
                  <img
                    src={`/images/media/${imageName}`}
                    alt={`Media image ${index + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.log(`Failed to load media image: ${imageName}`);
                      // Hide broken images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press Kit Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Media Kit & Resources
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Download high-quality assets and information for media coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mediaKit.map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                <CardHeader>
                  <CardTitle className="text-white">{item.title}</CardTitle>
                  <CardDescription className="text-white/80">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-white/70">Format: {item.format}</p>
                      <p className="text-sm text-white/70">Size: {item.size}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-lg">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Need Custom Assets?</h3>
              <p className="text-white/90 mb-6">
                For specific media requirements, custom photography, or additional information, 
                please contact our media relations team.
              </p>
              <Button asChild size="lg" className="rounded-lg bg-white text-primary hover:bg-gray-100">
                <Link href="/contact">Contact Media Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Inquiries */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Media Inquiries
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We welcome media coverage and are happy to provide information, arrange interviews, 
                and facilitate site visits for journalists and content creators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle className="text-primary">For Press Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> media@igtharvillage.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Phone:</strong> +91 XXXXX XXXXX
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Response Time:</strong> Within 24 hours
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Languages:</strong> English, Hindi, Rajasthani
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle className="text-primary">What We Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Expert interviews with founders</li>
                    <li>• Guided media tours and experiences</li>
                    <li>• High-resolution photography</li>
                    <li>• Video content and B-roll footage</li>
                    <li>• Cultural demonstrations</li>
                    <li>• Guest testimonials and stories</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-primary/5 rounded-xl p-8">
                <h3 className="text-xl font-bold text-primary mb-4">Media Visit Opportunities</h3>
                <p className="text-muted-foreground mb-6">
                  We offer complimentary media visits for qualified journalists and content creators. 
                  Experience our authentic desert culture firsthand and create compelling stories 
                  about sustainable tourism and cultural preservation.
                </p>
                <Button asChild size="lg" className="rounded-lg">
                  <Link href="/contact">Schedule Media Visit</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-orange-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Follow Our Story
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Stay updated with our latest news, guest experiences, and behind-the-scenes content
            </p>
          </div>

          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" className="rounded-lg bg-white text-orange-600 border-white hover:bg-orange-50">
              Instagram
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg bg-white text-orange-600 border-white hover:bg-orange-50">
              Facebook
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg bg-white text-orange-600 border-white hover:bg-orange-50">
              YouTube
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg bg-white text-orange-600 border-white hover:bg-orange-50">
              LinkedIn
            </Button>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/90">
              Tag us @igtharvillage in your stories and posts for a chance to be featured!
            </p>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}