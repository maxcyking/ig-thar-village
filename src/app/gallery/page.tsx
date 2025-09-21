"use client";

import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="bg-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Gallery
            </h1>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              Experience the beauty and authenticity of IG Thar Village
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Images Grid */}
        {!loading && galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div 
                key={image.id} 
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={image.imageUrl}
                  alt="Gallery image"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && galleryImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No images yet
            </h3>
            <p className="text-gray-500">
              Gallery images will appear here once uploaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}