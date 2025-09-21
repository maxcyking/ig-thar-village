/* eslint-disable react/no-inline-styles */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Users, 
  Leaf, 
  Star, 
  Award,
  Mountain,
  TreePine,
  Sunrise
} from "lucide-react";

const stats = [
  { number: "500+", label: "Happy Guests", icon: Users },
  { number: "50+", label: "Organic Products", icon: Leaf },
  { number: "15+", label: "Cultural Programs", icon: Star },
  { number: "5+", label: "Awards Won", icon: Award }
];

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  life: number;
  opacity: number;
}

export function EnhancedHero() {
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create sand particles following cursor
      if (Math.random() > 0.7) { // 30% chance to create particle
        const newParticle: CursorParticle = {
          id: particleId++,
          x: e.clientX,
          y: e.clientY,
          life: 100,
          opacity: 1
        };
        
        setCursorParticles(prev => [...prev.slice(-10), newParticle]); // Keep only last 10 particles
      }
    };

    const updateParticles = () => {
      setCursorParticles(prev => 
        prev.map(particle => ({
          ...particle,
          life: particle.life - 2,
          opacity: particle.opacity - 0.02,
          y: particle.y + 1 // Particles fall down
        })).filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(updateParticles, 50);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative w-full hero-section flex items-center justify-center overflow-hidden">
      {/* Desert Background with Image - Responsive Aspect Ratio */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Image - Maintains proportional aspect ratio */}
        <div 
          className="absolute inset-0 hero-bg"
          style={{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
              <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#FDB462;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#F4E4BC;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#E6D3A3;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#D2B48C;stop-opacity:1" />
                  </linearGradient>
                </defs>
                
                <!-- Sky -->
                <rect width="1200" height="400" fill="url(#skyGradient)"/>
                
                <!-- Desert Dunes Background -->
                <path d="M0,300 Q300,250 600,300 T1200,300 L1200,800 L0,800 Z" fill="url(#sandGradient)" opacity="0.8"/>
                <path d="M0,350 Q400,300 800,350 T1200,350 L1200,800 L0,800 Z" fill="url(#sandGradient)" opacity="0.6"/>
                <path d="M0,400 Q200,350 400,400 T800,400 T1200,400 L1200,800 L0,800 Z" fill="url(#sandGradient)" opacity="0.4"/>
                
                <!-- Sun -->
                <circle cx="1000" cy="120" r="60" fill="#FFD700" opacity="0.9"/>
                <circle cx="1000" cy="120" r="70" fill="#FFD700" opacity="0.6"/>
                <circle cx="1000" cy="120" r="80" fill="#FFD700" opacity="0.3"/>
              </svg>
            `)}')`
          } as React.CSSProperties}
        />
        
        {/* Desert Gradient Overlay */}
        <div className="absolute inset-0 desert-hero-gradient"></div>
      </div>

      {/* Animated Desert Sun */}
      <div className="desert-sun"></div>

      {/* Floating Desert Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' } as React.CSSProperties}>
          <Mountain className="h-16 w-16 text-orange-600" />
        </div>
        <div className="absolute top-32 right-20 opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' } as React.CSSProperties}>
          <TreePine className="h-12 w-12 text-green-600" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' } as React.CSSProperties}>
          <Sunrise className="h-14 w-14 text-yellow-600" />
        </div>
      </div>

      {/* Desert Particles */}
      <div className="desert-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Cursor Following Particles */}
      {cursorParticles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
            transform: 'translate(-50%, -50%)',
            opacity: particle.opacity,
          } as React.CSSProperties}
        >
          <div 
            className="w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              boxShadow: '0 0 6px rgba(251, 191, 36, 0.8)',
            } as React.CSSProperties}
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-yellow-100 text-yellow-800 border-yellow-300 text-sm px-6 py-3 font-accent rounded-full shadow-lg backdrop-blur-sm bg-white/80">
            🏆 Award-Winning Desert Experience
          </Badge>
          
          <h1 className="desert-title text-gray-900 mb-6 leading-tight drop-shadow-lg">
            Discover Authentic
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-red-600 animate-pulse">
              Thar Desert Life
            </span>
          </h1>
          
          <p className="body-text text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-white/60 rounded-lg p-4 shadow-lg">
            Experience the rich heritage of West Rajasthan through sustainable farm stays, 
            organic products, and authentic cultural immersion in the heart of Thar Desert.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 cta-button">
              <Link href="/services" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-orange-500 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg rounded-full backdrop-blur-sm bg-white/80 shadow-xl transform hover:scale-105 transition-all duration-300 cta-button">
              <Play className="mr-2 h-5 w-5" />
              Watch Virtual Tour
            </Button>
          </div>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-200 transform group-hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    <IconComponent className="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:animate-bounce" />
                    <div className="price-text text-gray-900 text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm text-gray-700 font-body font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Sand Dune Waves at Bottom */}
      <div className="sand-waves">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="shape-fill sand-wave-1" 
                fill="#F59E0B" 
                fillOpacity="0.8"></path>
        </svg>
        <svg data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{position: 'absolute', bottom: 0} as React.CSSProperties}>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="shape-fill sand-wave-2" 
                fill="#D97706" 
                fillOpacity="0.6"></path>
        </svg>
        <svg data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{position: 'absolute', bottom: 0} as React.CSSProperties}>
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                className="shape-fill sand-wave-3" 
                fill="#B45309" 
                fillOpacity="0.4"></path>
        </svg>
      </div>

      {/* Camel Silhouette */}
      <div className="camel-silhouette">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 60 Q15 45 25 50 Q35 55 45 50 Q55 45 65 50 Q75 55 85 50 Q95 45 105 50 L110 60 Q105 65 95 65 Q85 65 75 65 Q65 65 55 65 Q45 65 35 65 Q25 65 15 65 Q10 65 10 60 Z" 
                fill="currentColor" className="text-orange-900" opacity="0.6"/>
          <circle cx="20" cy="45" r="8" fill="currentColor" className="text-orange-900" opacity="0.6"/>
          <path d="M20 35 Q22 25 25 30 Q28 35 25 40" fill="currentColor" className="text-orange-900" opacity="0.6"/>
          <rect x="15" y="50" width="4" height="15" fill="currentColor" className="text-orange-900" opacity="0.6"/>
          <rect x="25" y="50" width="4" height="15" fill="currentColor" className="text-orange-900" opacity="0.6"/>
        </svg>
      </div>
    </section>
  );
}

export default EnhancedHero;
