import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const galleryImages = [
  {
    id: 1,
    title: "Traditional Mud Houses",
    category: "Accommodation",
    description: "Authentic desert homes built with cow dung, clay, and grass"
  },
  {
    id: 2,
    title: "Desert Safari Adventure",
    category: "Activities",
    description: "Exploring the vast sand dunes of Thar Desert"
  },
  {
    id: 3,
    title: "Camel Safari Experience",
    category: "Activities",
    description: "Riding the ship of the desert at sunset"
  },
  {
    id: 4,
    title: "Traditional Rajasthani Cuisine",
    category: "Food",
    description: "Dal Baati Churma and other authentic dishes"
  },
  {
    id: 5,
    title: "Ghoomar Dance Performance",
    category: "Culture",
    description: "Traditional folk dance of Rajasthan"
  },
  {
    id: 6,
    title: "Organic Farm Tour",
    category: "Agriculture",
    description: "Sustainable farming practices in the desert"
  },
  {
    id: 7,
    title: "Traditional Attire",
    category: "Culture",
    description: "Authentic Rajasthani clothing and accessories"
  },
  {
    id: 8,
    title: "Baba Ramdev Ji Temple",
    category: "Spirituality",
    description: "Sacred birthplace of the folk deity"
  },
  {
    id: 9,
    title: "Historic Batadu Well",
    category: "Heritage",
    description: "Ancient water conservation architecture"
  },
  {
    id: 10,
    title: "Desert Sunset Views",
    category: "Nature",
    description: "Breathtaking sunsets over the sand dunes"
  },
  {
    id: 11,
    title: "Traditional Farming Tools",
    category: "Agriculture",
    description: "Hand-operated mills and ox-drawn plows"
  },
  {
    id: 12,
    title: "Langa Folk Music",
    category: "Culture",
    description: "Soulful traditional music performances"
  }
];

const categories = ["All", "Accommodation", "Activities", "Food", "Culture", "Agriculture", "Heritage", "Nature", "Spirituality"];

export default function GalleryPage() {
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

          {/* Category Filter - For now showing all, can be made interactive later */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <Card key={image.id} className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden">
                  {/* Placeholder for actual images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl text-primary">📸</span>
                      </div>
                      <p className="text-sm text-primary/70 font-medium">
                        {image.title}
                      </p>
                    </div>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 text-white w-full">
                      <Badge className="mb-2 bg-white/20 text-white border-white/30">
                        {image.category}
                      </Badge>
                      <h3 className="font-semibold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/90">{image.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

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