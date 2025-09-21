"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMediaItems, type MediaItem } from "@/lib/database";

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getMediaItems('gallery');
        setGalleryImages(images);
      } catch (error) {
        console.error("Error loading gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 thar-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Gallery
            </h1>
            <p className="text-xl text-primary/80 mb-8">
              Discover the beauty and authenticity of IG Thar Village through our visual journey
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Experience Our Desert Heritage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A visual showcase of authentic desert culture, traditional practices, and unforgettable experiences
            </p>
          </div>


          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 animate-pulse">
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
                      <div className="h-3 bg-primary/10 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && galleryImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
              <Card key={image.id} className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt="Gallery image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-primary">📸</span>
                          </div>
                          <p className="text-sm text-primary/70 font-medium">
                            Gallery Image
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            ))}
          </div>
          )}

          {/* No Images Found */}
          {!loading && galleryImages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📸</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                No Gallery Images Yet
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                We're currently building our gallery. Check back soon for stunning images of our desert experiences!
              </p>
            </div>
          )}

          {/* Note about images */}
          <div className="text-center mt-12">
            <div className="bg-primary/5 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-primary mb-4">Coming Soon: High-Quality Images</h3>
              <p className="text-muted-foreground">
                We're currently capturing stunning photographs of our authentic desert experiences, 
                traditional accommodations, cultural performances, and organic farming practices. 
                These images will be added to showcase the true beauty of IG Thar Village.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section Placeholder */}
      <section className="py-16 agricultural-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Virtual Tour
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Take a virtual journey through our desert village and experience the authentic culture
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎥</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Virtual Tour Video</h3>
                <p className="text-white/90">
                  Coming soon - An immersive video tour of IG Thar Village showcasing our 
                  authentic desert experiences, traditional culture, and sustainable practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram-style Grid Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Follow Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay connected with us on social media for daily updates, behind-the-scenes content, 
              and guest experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Follow us @igtharvillage for daily updates and authentic desert experiences
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Instagram
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Facebook
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                YouTube
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}