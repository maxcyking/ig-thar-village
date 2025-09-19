import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Star, Medal, Users, Leaf } from "lucide-react";

const awards = [
  {
    id: 1,
    title: "Best Sustainable Tourism Initiative",
    organization: "Rajasthan Tourism Board",
    year: "2024",
    description: "Recognized for promoting eco-friendly tourism practices and preserving traditional desert culture.",
    icon: Leaf,
    category: "Sustainability"
  },
  {
    id: 2,
    title: "Excellence in Rural Tourism",
    organization: "Ministry of Tourism, India",
    year: "2024",
    description: "Awarded for outstanding contribution to rural tourism development and community empowerment.",
    icon: Trophy,
    category: "Tourism"
  },
  {
    id: 3,
    title: "Best Farm Stay Experience",
    organization: "Desert Tourism Association",
    year: "2023",
    description: "Honored for providing authentic farm stay experiences and traditional hospitality.",
    icon: Award,
    category: "Hospitality"
  },
  {
    id: 4,
    title: "Cultural Heritage Preservation Award",
    organization: "Rajasthan Cultural Society",
    year: "2023",
    description: "Recognized for efforts in preserving and promoting traditional Rajasthani culture and practices.",
    icon: Medal,
    category: "Culture"
  },
  {
    id: 5,
    title: "Community Impact Recognition",
    organization: "Local Development Council",
    year: "2023",
    description: "Acknowledged for positive impact on local community development and employment generation.",
    icon: Users,
    category: "Community"
  },
  {
    id: 6,
    title: "Organic Farming Excellence",
    organization: "Organic Farmers Association",
    year: "2023",
    description: "Awarded for innovative organic farming practices in arid regions and sustainable agriculture.",
    icon: Leaf,
    category: "Agriculture"
  }
];

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
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 rajasthani-orange">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Awards & Recognition
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Celebrating our commitment to authentic desert experiences, sustainable tourism, and cultural preservation
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                6+ Awards
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                Since 2023
              </Badge>
            </div>
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => {
              const IconComponent = award.icon;
              return (
                <Card key={award.id} className="rounded-lg border-2 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{award.category}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{award.year}</p>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-primary">{award.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary/70">
                      {award.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{award.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What They Say About Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Testimonials from award organizations and recognition bodies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="rounded-lg border-2">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "IG Thar Village represents the perfect blend of authentic cultural preservation 
                  and sustainable tourism practices. Their commitment to showcasing traditional 
                  desert life while supporting local communities is truly commendable."
                </p>
                <div>
                  <p className="font-semibold text-primary">Dr. Rajesh Sharma</p>
                  <p className="text-sm text-muted-foreground">Director, Rajasthan Tourism Board</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-2">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "The innovative approach of Dr. Devaram Pawar and Dhapu in creating authentic 
                  desert experiences while maintaining ecological balance sets a new standard 
                  for rural tourism in India."
                </p>
                <div>
                  <p className="font-semibold text-primary">Prof. Meera Joshi</p>
                  <p className="text-sm text-muted-foreground">Cultural Heritage Expert</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-16 desert-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Vision Forward
            </h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto">
              Continuing our mission to preserve desert culture and promote sustainable tourism
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">National Recognition</h3>
              <p className="text-primary/70">
                Aiming for national-level awards for cultural preservation and sustainable tourism excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Community Impact</h3>
              <p className="text-primary/70">
                Expanding our positive impact on local communities through increased tourism and employment.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Sustainability Leadership</h3>
              <p className="text-primary/70">
                Becoming a model for sustainable desert tourism practices across India and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}