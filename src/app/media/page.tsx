"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FileText, Video, Image as ImageIcon, Newspaper } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMediaItems, type MediaItem } from "@/lib/database";

const mediaItems = [
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
  },
  {
    id: 5,
    type: "Interview",
    title: "Dr. Devaram Pawar Speaks on Sustainable Desert Tourism",
    description: "Exclusive interview with the founder about vision, challenges, and future of desert tourism.",
    date: "November 25, 2023",
    source: "Rural Tourism Today",
    icon: FileText,
    category: "Interview"
  },
  {
    id: 6,
    type: "News Article",
    title: "Organic Farming in Arid Regions: A Success Story",
    description: "Feature article on innovative organic farming practices in the Thar Desert region.",
    date: "October 15, 2023",
    source: "Agriculture Weekly",
    icon: Newspaper,
    category: "News Coverage"
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
    description: "Detailed biographies of Dr. Devaram Pawar and Dhapu",
    format: "PDF, DOC",
    size: "1 page each"
  }
];

export default function MediaPage() {
  const [mediaImages, setMediaImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMediaImages = async () => {
      try {
        const images = await getMediaItems('media');
        setMediaImages(images);
      } catch (error) {
        console.error("Error loading media images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMediaImages();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 thar-sand">
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
              Latest Media Coverage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recent news articles, features, and press coverage about our authentic desert experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card key={item.id} className="rounded-lg border-2 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 rounded-lg p-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-primary line-clamp-2">{item.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary/70">
                      {item.source}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media Images Gallery */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Media Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visual assets and images available for media use
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 animate-pulse">
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && mediaImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaImages.map((image) => (
                <Card key={image.id} className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt="Media image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-primary">📸</span>
                          </div>
                          <p className="text-sm text-primary/70 font-medium">
                            Media Image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && mediaImages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📸</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Media Images Yet
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Media images will be uploaded by our team and made available for press use.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Press Kit Section */}
      <section className="py-16 agricultural-green">
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
              <Button asChild variant="secondary" size="lg" className="rounded-lg">
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
      <section className="py-16 rajasthani-orange">
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
            <Button variant="secondary" size="lg" className="rounded-lg">
              Instagram
            </Button>
            <Button variant="secondary" size="lg" className="rounded-lg">
              Facebook
            </Button>
            <Button variant="secondary" size="lg" className="rounded-lg">
              YouTube
            </Button>
            <Button variant="secondary" size="lg" className="rounded-lg">
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
    </div>
  );
}