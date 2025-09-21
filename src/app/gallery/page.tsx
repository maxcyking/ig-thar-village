"use client";

export default function GalleryPage() {
  // Gallery images from public/images/gallery/
  const galleryImages = [
    "1.jpeg",
    "26 Jan 24 Bmr Collectret.jpeg",
    "Aduram ji MLA Pransha Ptra.jpeg",
    "ARC Bikaner Award.jpeg",
    "AU Jodhpur VC.jpg",
    "Bajra Anusandhan Gudamalani.jpeg",
    "Bakari Maakumbh 18-11-24.jpeg",
    "Bakari Maakumbh 19-11-24.jpeg",
    "Barmer Gourav Samman.jpeg",
    "CSWRI Avika Nagar Foundation Day.jpg",
    "MOFI.jpeg",
    "MS4.jpeg",
    "Nasl Sarkshan Award NBAGR 2023.jpeg",
    "NRCSS Ajmer.jpeg",
    "NTRS GADSA 09-02-24.jpeg",
    "Padam Shree Magraj Award.jpg",
    "Pratibha Shree Award.jpg",
    "RCFC.jpeg",
    "SDM Baytu 15 Aug 24.jpeg",
    "Tilwada Pashu mela.jpg"
  ];

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((imageName, index) => (
            <div 
              key={index} 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={`/images/gallery/${imageName}`}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  console.log(`Failed to load image: ${imageName}`);
                  e.currentTarget.src = '/images/placeholder.jpg'; // Fallback if needed
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}