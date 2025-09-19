import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Award, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 thar-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About IG Thar Village
            </h1>
            <p className="text-xl text-primary/80 mb-8">
              A Journey of Preserving Desert Heritage and Promoting Sustainable Agriculture
            </p>
          </div>
        </div>
      </section>

      {/* Organization Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                About IG Thar Village
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                IG Thar Village is a pioneering organization dedicated to agricultural development and rural empowerment 
                in the Thar Desert region of Rajasthan. Based in Barmer district, we work tirelessly to bridge the gap 
                between traditional farming wisdom and modern sustainable practices.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our comprehensive approach includes farmer training programs, organic agriculture promotion, 
                rural tourism development, and cultural preservation initiatives. We believe in empowering local 
                communities while showcasing the rich heritage of West Rajasthan to the world.
              </p>
              <p className="text-lg text-muted-foreground">
                Through our various initiatives, we have successfully trained over 525 farmers in organic cultivation 
                methods and sustainable agricultural practices, contributing to the economic development of rural communities.
              </p>
            </div>
            <div className="bg-primary/5 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Our Mission</h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p className="text-lg font-semibold text-amber-800 italic">
                  "To increase farmers' income and promote organic agriculture awareness for the betterment of farmers and society."
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Enhance agricultural productivity through organic farming methods
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Preserve and promote traditional desert culture and heritage
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Empower rural communities through sustainable livelihood opportunities
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Develop eco-friendly tourism that benefits local communities
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs & Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Training Programs & Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive training initiatives that have transformed agricultural practices across the Thar Desert region
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">525 Farmers Trained</h3>
              <p className="text-gray-600 text-sm">
                Successfully trained farmers in organic cultivation methods and sustainable agricultural practices
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Certifications</h3>
              <p className="text-gray-600 text-sm">
                Recognized training programs by various agricultural institutions and government bodies
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600 text-sm">
                Training programs spanning organic farming, animal husbandry, and sustainable practices
              </p>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-primary mb-6">Key Training Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Agricultural Training</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Organic farming methods and certification processes</li>
                  <li>• Sustainable crop cultivation techniques</li>
                  <li>• Soil health management and water conservation</li>
                  <li>• Integrated pest management systems</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Livestock & Dairy</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Scientific animal husbandry practices</li>
                  <li>• Dairy farming and milk production enhancement</li>
                  <li>• Goat and sheep rearing techniques</li>
                  <li>• Feed management and health care</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Facilities */}
      <section className="py-16 agricultural-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Facilities & Infrastructure
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Modern facilities combined with traditional wisdom to provide comprehensive agricultural and tourism services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Organic Livestock Farm</CardTitle>
                <CardDescription className="text-white/80">
                  State-of-the-art livestock facility with 550 goats (Sirohi breed) and modern 
                  infrastructure for organic dairy and meat production.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Vermi-Composting Unit</CardTitle>
                <CardDescription className="text-white/80">
                  Advanced vermi-composting facility producing high-quality organic fertilizer 
                  using scientific methods and earthworm cultivation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Fodder Production</CardTitle>
                <CardDescription className="text-white/80">
                  Comprehensive fodder cultivation system ensuring year-round feed availability 
                  for livestock through sustainable farming practices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Training Center</CardTitle>
                <CardDescription className="text-white/80">
                  Dedicated training facility equipped with modern amenities for conducting 
                  farmer education programs and agricultural workshops.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Desert Accommodation</CardTitle>
                <CardDescription className="text-white/80">
                  Authentic desert camps and traditional mud houses providing visitors with 
                  genuine Thar Desert living experiences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <CardHeader>
                <CardTitle className="text-white">Agricultural Equipment</CardTitle>
                <CardDescription className="text-white/80">
                  Modern and traditional farming equipment including tractors, plows, 
                  and traditional tools for comprehensive agricultural operations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the authentic lifestyle and culture of Rajasthan through our carefully curated offerings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-primary">Organic Products</CardTitle>
                <CardDescription>
                  Premium organic dairy products, including fresh milk, ghee, and traditional 
                  dairy items produced using sustainable and ethical farming practices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-primary">Desert Safari Experiences</CardTitle>
                <CardDescription>
                  Authentic camel and jeep safaris across the Thar Desert, offering breathtaking 
                  views of sand dunes and traditional desert landscapes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-primary">Cultural Immersion</CardTitle>
                <CardDescription>
                  Traditional Rajasthani cultural programs including folk music, dance performances, 
                  and authentic cuisine prepared using age-old recipes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-primary">Agricultural Training</CardTitle>
                <CardDescription>
                  Comprehensive training programs for farmers covering organic farming, 
                  livestock management, and sustainable agricultural practices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Adventure & Spirituality */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Adventure & Exploration
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  <strong>Desert Safari:</strong> Experience the thrill of exploring sand dunes 
                  in open jeeps, feeling the vastness and beauty of the Thar Desert.
                </p>
                <p className="text-lg text-muted-foreground">
                  <strong>Camel Safari:</strong> Ride the "ship of the desert" and experience 
                  traditional desert transportation while enjoying breathtaking sunset views.
                </p>
                <p className="text-lg text-muted-foreground">
                  <strong>Cultural Performances:</strong> Enjoy mesmerizing Ghoomar dance 
                  performances and soulful Langa folk music that echo the spirit of Rajasthan.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Spiritual & Historical Sites
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  <strong>Baba Ramdev Ji's Birthplace:</strong> Visit the sacred birthplace 
                  of Rajasthan's beloved folk deity, Baba Ramdev Ji, and experience the 
                  spiritual significance of this holy site.
                </p>
                <p className="text-lg text-muted-foreground">
                  <strong>Historic Batadu Well (Jal Mahal):</strong> Explore this magnificent 
                  historical water palace, a testament to the ingenious water conservation 
                  techniques of ancient Rajasthan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 desert-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Values
            </h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto">
              The principles that guide our mission to preserve and share desert heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Authenticity</h3>
              <p className="text-primary/70">
                We preserve and share genuine traditional practices, ensuring visitors 
                experience the true essence of desert culture.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Community</h3>
              <p className="text-primary/70">
                We support local communities by creating sustainable tourism opportunities 
                that benefit everyone involved.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Innovation</h3>
              <p className="text-primary/70">
                We blend traditional wisdom with modern sustainable practices to create 
                unique and meaningful experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}