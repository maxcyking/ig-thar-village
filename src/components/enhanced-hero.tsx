/* eslint-disable react/no-inline-styles */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Sunrise,
  ChevronLeft,
  ChevronRight,
  Pause,
  Camera,
  Heart,
  Globe,
  Tent,
  Music
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

interface HeroSlide {
  id: number;
  type: 'content' | 'poster';
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeIcon: any;
  primaryCTA: {
    text: string;
    href: string;
    icon: any;
  };
  secondaryCTA: {
    text: string;
    href: string;
    icon: any;
  };
  backgroundTheme: 'desert' | 'cultural' | 'organic' | 'adventure' | 'heritage';
  posterImage?: string;
  overlayOpacity?: number;
  textPosition?: 'center' | 'left' | 'right';
  floatingElements: {
    icon: any;
    position: string;
    color: string;
    delay: string;
    duration: string;
  }[];
}

const heroSlides: HeroSlide[] = [
  // Original content slide (Slide 1)
  {
    id: 1,
    type: 'content',
    title: "Discover Authentic",
    subtitle: "Thar Desert Life",
    description: "Experience the rich heritage of West Rajasthan through sustainable farm stays, organic products, and authentic cultural immersion in the heart of Thar Desert.",
    badge: "🏆 Award-Winning Desert Experience",
    badgeIcon: Award,
    primaryCTA: {
      text: "Start Your Journey",
      href: "/services",
      icon: ArrowRight
    },
    secondaryCTA: {
      text: "Watch Virtual Tour",
      href: "#",
      icon: Play
    },
    backgroundTheme: 'desert',
    textPosition: 'center',
    floatingElements: [
      { icon: Mountain, position: "top-20 left-10", color: "text-orange-600", delay: "0s", duration: "3s" },
      { icon: TreePine, position: "top-32 right-20", color: "text-green-600", delay: "1s", duration: "4s" },
      { icon: Sunrise, position: "bottom-40 left-20", color: "text-yellow-600", delay: "2s", duration: "5s" }
    ]
  },
  // Poster Slide 2 - Desert Safari Experience
  {
    id: 2,
    type: 'poster',
    title: "Desert Safari",
    subtitle: "Adventure Awaits",
    description: "Embark on thrilling camel safaris across golden sand dunes and witness breathtaking desert sunsets.",
    badge: "🐪 Camel Safari Experience",
    badgeIcon: Mountain,
    primaryCTA: {
      text: "Book Safari",
      href: "/services",
      icon: Mountain
    },
    secondaryCTA: {
      text: "View Gallery",
      href: "/gallery",
      icon: Camera
    },
    backgroundTheme: 'adventure',
    posterImage: "/images/hero/Camel_Safari_Desert_Adventure.jpg",
    overlayOpacity: 0.3,
    textPosition: 'left',
    floatingElements: [
      { icon: Mountain, position: "top-20 right-20", color: "text-orange-400", delay: "0s", duration: "4s" },
      { icon: Tent, position: "bottom-32 right-16", color: "text-amber-400", delay: "1.5s", duration: "3s" }
    ]
  },
  // Poster Slide 3 - Cultural Heritage
  {
    id: 3,
    type: 'poster',
    title: "Rajasthani",
    subtitle: "Cultural Heritage",
    description: "Witness traditional Ghoomar dance, folk music, and authentic cultural performances in our heritage village.",
    badge: "🎭 Cultural Experience",
    badgeIcon: Heart,
    primaryCTA: {
      text: "Explore Culture",
      href: "/services",
      icon: Heart
    },
    secondaryCTA: {
      text: "Book Show",
      href: "/contact",
      icon: Music
    },
    backgroundTheme: 'cultural',
    posterImage: "/images/hero/cultral_heritage.png",
    overlayOpacity: 0.3,
    textPosition: 'right',
    floatingElements: [
      { icon: Music, position: "top-16 left-16", color: "text-purple-400", delay: "0s", duration: "4s" },
      { icon: Heart, position: "bottom-28 left-20", color: "text-pink-400", delay: "1.5s", duration: "3.5s" }
    ]
  },
  // Poster Slide 4 - Organic Farm
  {
    id: 4,
    type: 'poster',
    title: "Organic Farm",
    subtitle: "Pure & Natural",
    description: "Experience sustainable farming practices and taste 100% organic products grown in the heart of Thar Desert.",
    badge: "🌱 Organic Farming",
    badgeIcon: Leaf,
    primaryCTA: {
      text: "Shop Products",
      href: "/products",
      icon: Leaf
    },
    secondaryCTA: {
      text: "Farm Tour",
      href: "/services",
      icon: TreePine
    },
    backgroundTheme: 'organic',
    posterImage: "/images/hero/image (9).png",
    overlayOpacity: 0.3,
    textPosition: 'center',
    floatingElements: [
      { icon: Leaf, position: "top-24 left-12", color: "text-green-400", delay: "0s", duration: "3s" },
      { icon: TreePine, position: "bottom-36 right-16", color: "text-emerald-400", delay: "2s", duration: "3.5s" }
    ]
  },
  // Poster Slide 5 - Heritage Accommodation
  {
    id: 5,
    type: 'poster',
    title: "Heritage Stay",
    subtitle: "Mud House Experience",
    description: "Stay in traditional mud houses built with natural materials, offering authentic desert living with modern comfort.",
    badge: "🏡 Heritage Accommodation",
    badgeIcon: Tent,
    primaryCTA: {
      text: "Book Stay",
      href: "/properties",
      icon: Tent
    },
    secondaryCTA: {
      text: "View Rooms",
      href: "/properties",
      icon: Camera
    },
    backgroundTheme: 'heritage',
    posterImage: "/images/hero/Rajasthani_Heritage_Stay_Mud_Houses.jpg",
    overlayOpacity: 0.3,
    textPosition: 'left',
    floatingElements: [
      { icon: Tent, position: "top-20 right-24", color: "text-amber-400", delay: "0s", duration: "3.5s" },
      { icon: Star, position: "bottom-32 right-12", color: "text-yellow-400", delay: "1s", duration: "4s" }
    ]
  },
  // Poster Slide 6 - Village Life
  {
    id: 6,
    type: 'poster',
    title: "Village Life",
    subtitle: "Global Wellness",
    description: "Connect with local communities and experience authentic rural life that bridges traditional wisdom with modern wellness.",
    badge: "🌍 Community Experience",
    badgeIcon: Globe,
    primaryCTA: {
      text: "Our Mission",
      href: "/about",
      icon: Globe
    },
    secondaryCTA: {
      text: "Contact Us",
      href: "/contact",
      icon: ArrowRight
    },
    backgroundTheme: 'heritage',
    posterImage: "/images/hero/Community_Experience_Village_Life_No_Text.jpg",
    overlayOpacity: 0.3,
    textPosition: 'right',
    floatingElements: [
      { icon: Globe, position: "top-16 left-24", color: "text-blue-400", delay: "0s", duration: "3.5s" },
      { icon: Users, position: "bottom-40 left-12", color: "text-purple-400", delay: "2s", duration: "3s" }
    ]
  }
];

export function EnhancedHero() {
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  // Cursor particle effects
  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
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

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSlide, isTransitioning]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Background theme classes
  const getBackgroundTheme = (theme: string) => {
    switch (theme) {
      case 'desert':
        return 'from-amber-900 via-orange-800 to-red-900';
      case 'cultural':
        return 'from-purple-900 via-pink-800 to-red-900';
      case 'organic':
        return 'from-green-900 via-emerald-800 to-teal-900';
      case 'adventure':
        return 'from-orange-900 via-red-800 to-pink-900';
      case 'heritage':
        return 'from-blue-900 via-indigo-800 to-purple-900';
      default:
        return 'from-amber-900 via-orange-800 to-red-900';
    }
  };

  // Poster gradient backgrounds
  const getPosterGradient = (theme: string, slideId: number) => {
    switch (slideId) {
      case 2: // Desert Safari
        return 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600';
      case 3: // Cultural Heritage
        return 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500';
      case 4: // Organic Farm
        return 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600';
      case 5: // Heritage Stay
        return 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600';
      case 6: // Village Life
        return 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600';
      default:
        return 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600';
    }
  };

  // Poster pattern overlays for visual interest
  const getPosterPattern = (slideId: number) => {
    switch (slideId) {
      case 2: // Desert Safari - Sand dune pattern
        return 'bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_50%)] bg-[length:100px_50px]';
      case 3: // Cultural Heritage - Geometric pattern
        return 'bg-[linear-gradient(45deg,_rgba(255,255,255,0.1)_25%,_transparent_25%,_transparent_75%,_rgba(255,255,255,0.1)_75%)] bg-[length:40px_40px]';
      case 4: // Organic Farm - Leaf pattern
        return 'bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_0%,_transparent_50%)] bg-[length:60px_60px]';
      case 5: // Heritage Stay - Brick pattern
        return 'bg-[linear-gradient(90deg,_rgba(255,255,255,0.1)_50%,_transparent_50%)] bg-[length:80px_40px]';
      case 6: // Village Life - Dot pattern
        return 'bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_2px,_transparent_2px)] bg-[length:30px_30px]';
      default:
        return '';
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Fixed 16:9 Aspect Ratio Container */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>

        {/* Carousel Container */}
        <div
          className="absolute inset-0 flex carousel-slide-transform"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >

          {heroSlides.map((slide, index) => (
            <div key={slide.id} className="relative w-full flex-shrink-0 flex items-center justify-center">

              {/* Dynamic Background */}
              <div className="absolute inset-0 w-full h-full">
                {slide.type === 'poster' ? (
                  // Poster Background - Image or CSS Generated
                  <>
                    {slide.posterImage && (slide.id === 2 || slide.id === 3 || slide.id === 4 || slide.id === 5 || slide.id === 6) ? (
                      // Use actual image for slide 2 (Desert Safari), slide 3 (Cultural Heritage), slide 4 (Organic Farm), slide 5 (Heritage Stay) and slide 6 (Village Life)
                      <Image
                        src={slide.posterImage}
                        alt={`${slide.title} ${slide.subtitle}`}
                        fill
                        className="object-cover"
                        priority={index === currentSlide}
                      />
                    ) : (
                      // CSS Generated background for other poster slides
                      <>
                        {/* Main Poster Gradient Background */}
                        <div className={`absolute inset-0 ${getPosterGradient(slide.backgroundTheme, slide.id)}`}></div>

                        {/* Poster Pattern Overlay */}
                        <div className={`absolute inset-0 ${getPosterPattern(slide.id)}`}></div>
                      </>
                    )}

                    {/* Text Readability Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundTheme(slide.backgroundTheme)} ${slide.overlayOpacity === 0.3 ? 'poster-overlay-light' :
                      slide.overlayOpacity === 0.4 ? 'poster-overlay-medium' :
                        slide.overlayOpacity === 0.5 ? 'poster-overlay-dark' :
                          'poster-overlay-medium'
                      }`}></div>
                  </>
                ) : (
                  // SVG Generated Background for content slides
                  <>
                    <div
                      className="absolute inset-0 hero-bg"
                      style={{
                        backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                          <svg viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <linearGradient id="skyGradient${index}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#FDB462;stop-opacity:1" />
                              </linearGradient>
                              <linearGradient id="sandGradient${index}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#F4E4BC;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#E6D3A3;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#D2B48C;stop-opacity:1" />
                              </linearGradient>
                            </defs>
                            
                            <!-- Sky -->
                            <rect width="1200" height="337" fill="url(#skyGradient${index})"/>
                            
                            <!-- Desert Dunes Background -->
                            <path d="M0,253 Q300,211 600,253 T1200,253 L1200,675 L0,675 Z" fill="url(#sandGradient${index})" opacity="0.8"/>
                            <path d="M0,295 Q400,253 800,295 T1200,295 L1200,675 L0,675 Z" fill="url(#sandGradient${index})" opacity="0.6"/>
                            <path d="M0,337 Q200,295 400,337 T800,337 T1200,337 L1200,675 L0,675 Z" fill="url(#sandGradient${index})" opacity="0.4"/>
                            
                            <!-- Sun -->
                            <circle cx="1000" cy="101" r="50" fill="#FFD700" opacity="0.9"/>
                            <circle cx="1000" cy="101" r="59" fill="#FFD700" opacity="0.6"/>
                            <circle cx="1000" cy="101" r="67" fill="#FFD700" opacity="0.3"/>
                          </svg>
                        `)}')`
                      }}
                    />
                    {/* Dynamic Gradient Overlay for content slides */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundTheme(slide.backgroundTheme)} opacity-60`}></div>
                  </>
                )}
              </div>

              {/* Animated Desert Sun - Hidden for slide 2, 3, 4, 5 and 6 */}
              {slide.id !== 2 && slide.id !== 3 && slide.id !== 4 && slide.id !== 5 && slide.id !== 6 && <div className="desert-sun"></div>}

              {/* Dynamic Floating Elements - Hidden for slide 2, 3, 4, 5 and 6 */}
              {slide.id !== 2 && slide.id !== 3 && slide.id !== 4 && slide.id !== 5 && slide.id !== 6 && (
                <div className="absolute inset-0 pointer-events-none">
                  {slide.floatingElements.map((element, elemIndex) => {
                    const IconComponent = element.icon;
                    const delayClass = element.delay === '0s' ? 'floating-delay-0' :
                      element.delay === '1s' ? 'floating-delay-1' :
                        element.delay === '1.5s' ? 'floating-delay-1-5' :
                          element.delay === '2s' ? 'floating-delay-2' :
                            element.delay === '2.5s' ? 'floating-delay-2-5' : 'floating-delay-0';

                    const durationClass = element.duration === '3s' ? 'floating-duration-3' :
                      element.duration === '3.5s' ? 'floating-duration-3-5' :
                        element.duration === '4s' ? 'floating-duration-4' :
                          element.duration === '4.5s' ? 'floating-duration-4-5' :
                            element.duration === '5s' ? 'floating-duration-5' : 'floating-duration-4';

                    return (
                      <div
                        key={elemIndex}
                        className={`absolute ${element.position} opacity-20 animate-bounce ${delayClass} ${durationClass}`}
                      >
                        <IconComponent className={`h-[clamp(1.5rem,4vw,4rem)] w-[clamp(1.5rem,4vw,4rem)] ${element.color}`} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Desert Particles - Hidden for slide 2, 3, 4, 5 and 6 */}
              {slide.id !== 2 && slide.id !== 3 && slide.id !== 4 && slide.id !== 5 && slide.id !== 6 && (
                <div className="desert-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="particle"></div>
                  ))}
                </div>
              )}

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
                  }}
                >
                  <div className="w-1 h-1 bg-yellow-400 rounded-full shadow-lg" />
                </div>
              ))}

              {/* Main Content - Mobile-First Compact Design */}
              <div className="w-full h-full relative z-10 flex items-center justify-center px-2 sm:px-4 lg:px-8">
                <div className={`w-full max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto ${slide.textPosition === 'left' ? 'text-left' :
                  slide.textPosition === 'right' ? 'text-right' :
                    'text-center'
                  }`}>

                  {/* Compact Badge for Mobile */}
                  <div className="mb-2 sm:mb-3 lg:mb-4">
                    <Badge className={`inline-flex items-center ${slide.type === 'poster' ? 'bg-black/70 text-white border-white/40' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      } text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-accent rounded-full shadow-md backdrop-blur-sm`}>
                      {slide.badge}
                    </Badge>
                  </div>

                  {/* Compact Mobile Title */}
                  <h1 className={`font-bold leading-tight mb-2 sm:mb-3 lg:mb-4 ${slide.type === 'poster' ? 'text-white drop-shadow-2xl' : 'text-gray-900'
                    }`}>
                    <span className="block text-lg sm:text-2xl lg:text-4xl xl:text-5xl">
                      {slide.title}
                    </span>
                    <span className={`block text-xl sm:text-3xl lg:text-5xl xl:text-6xl mt-0.5 sm:mt-1 ${slide.type === 'poster'
                      ? 'text-white drop-shadow-2xl'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-red-600'
                      }`}>
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Compact Mobile Description */}
                  <div className={`mb-3 sm:mb-4 lg:mb-6 ${slide.textPosition === 'center' ? 'max-w-xs sm:max-w-lg lg:max-w-3xl mx-auto' :
                    slide.textPosition === 'left' ? 'max-w-xs sm:max-w-lg' :
                      'max-w-xs sm:max-w-lg ml-auto'
                    }`}>
                    <p className={`text-xs sm:text-sm lg:text-base leading-relaxed backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 shadow-md ${slide.type === 'poster'
                      ? 'text-white bg-black/60'
                      : 'text-gray-800 bg-white/80'
                      }`}>
                      {slide.description}
                    </p>
                  </div>

                  {/* Compact Mobile Buttons - Horizontal Row */}
                  <div className={`hero-cta-container flex flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8 ${slide.textPosition === 'center' ? 'justify-center' :
                    slide.textPosition === 'right' ? 'justify-end' : 'justify-start'
                    }`}>
                    <Button
                      size="sm"
                      className="hero-cta-button flex-1 sm:flex-none sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-full shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Link href={slide.primaryCTA.href} className="flex items-center justify-center w-full">
                        <slide.primaryCTA.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 sm:mr-2" />
                        <span className="hidden sm:inline">{slide.primaryCTA.text}</span>
                        <span className="sm:hidden text-xs font-semibold ml-1">
                          {slide.primaryCTA.text.split(' ')[0]}
                        </span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`hero-cta-button flex-1 sm:flex-none sm:w-auto border-2 px-3 sm:px-6 lg:px-8 py-2 sm:py-3 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-full shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-300 ${slide.type === 'poster'
                        ? 'border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/20'
                        : 'border-orange-500 text-orange-700 hover:bg-orange-50 backdrop-blur-sm bg-white/80'
                        }`}
                    >
                      <Link href={slide.secondaryCTA.href} className="flex items-center justify-center w-full">
                        <slide.secondaryCTA.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 sm:mr-2" />
                        <span className="hidden sm:inline">{slide.secondaryCTA.text}</span>
                        <span className="sm:hidden text-xs font-semibold ml-1">
                          {slide.secondaryCTA.text.split(' ')[0]}
                        </span>
                      </Link>
                    </Button>
                  </div>

                  {/* Compact Mobile Stats Grid - Only on first slide */}
                  {slide.id === 1 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-xs sm:max-w-lg lg:max-w-3xl mx-auto">
                      {stats.map((stat, statIndex) => {
                        const IconComponent = stat.icon;
                        return (
                          <div key={statIndex} className="text-center group">
                            <div className="bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3 lg:p-4 shadow-md border border-yellow-200 transform group-hover:scale-105 transition-all duration-300 hover:shadow-lg">
                              <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600 mx-auto mb-1 sm:mb-2 group-hover:animate-bounce" />
                              <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">{stat.number}</div>
                              <div className="text-xs sm:text-sm text-gray-700 font-body font-medium">{stat.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Sand Dune Waves at Bottom - Hidden for slide 2, 3, 4, 5 and 6 */}
              {slide.id !== 2 && slide.id !== 3 && slide.id !== 4 && slide.id !== 5 && slide.id !== 6 && (
                <div className="sand-waves">
                  <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                      className="shape-fill sand-wave-1"
                      fill="#F59E0B"
                      fillOpacity="0.8"></path>
                  </svg>
                  <svg data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 } as React.CSSProperties}>
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                      className="shape-fill sand-wave-2"
                      fill="#D97706"
                      fillOpacity="0.6"></path>
                  </svg>
                  <svg data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 } as React.CSSProperties}>
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                      className="shape-fill sand-wave-3"
                      fill="#B45309"
                      fillOpacity="0.4"></path>
                  </svg>
                </div>
              )}

              {/* Camel Silhouette - Hidden for slide 2, 3, 4, 5 and 6 */}
              {slide.id !== 2 && slide.id !== 3 && slide.id !== 4 && slide.id !== 5 && slide.id !== 6 && (
                <div className="camel-silhouette">
                  <svg width="60" height="40" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[90px] sm:h-[60px] lg:w-[120px] lg:h-[80px]">
                    <path d="M10 60 Q15 45 25 50 Q35 55 45 50 Q55 45 65 50 Q75 55 85 50 Q95 45 105 50 L110 60 Q105 65 95 65 Q85 65 75 65 Q65 65 55 65 Q45 65 35 65 Q25 65 15 65 Q10 65 10 60 Z"
                      fill="currentColor" className="text-orange-900" opacity="0.6" />
                    <circle cx="20" cy="45" r="8" fill="currentColor" className="text-orange-900" opacity="0.6" />
                    <path d="M20 35 Q22 25 25 30 Q28 35 25 40" fill="currentColor" className="text-orange-900" opacity="0.6" />
                    <rect x="15" y="50" width="4" height="15" fill="currentColor" className="text-orange-900" opacity="0.6" />
                    <rect x="25" y="50" width="4" height="15" fill="currentColor" className="text-orange-900" opacity="0.6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compact Mobile Carousel Controls */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-20">
          {/* Compact Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={isTransitioning}
            className="ml-1 sm:ml-2 lg:ml-4 pointer-events-auto bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/50 text-white rounded-full h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12 shadow-md"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
          </Button>

          {/* Compact Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={isTransitioning}
            className="mr-1 sm:mr-2 lg:mr-4 pointer-events-auto bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/50 text-white rounded-full h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12 shadow-md"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
          </Button>
        </div>

        {/* Compact Mobile Slide Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white shadow-md scale-125'
                : 'bg-white/60 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Compact Mobile Auto-play Control */}
        <div className="absolute top-1 sm:top-2 lg:top-4 right-1 sm:right-2 lg:right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAutoPlay}
            className="bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/50 text-white rounded-full h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 shadow-md"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            type="button"
          >
            {isAutoPlaying ? (
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            ) : (
              <Play className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default EnhancedHero;
