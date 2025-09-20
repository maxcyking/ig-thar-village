"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket,
  Mountain,
  TreePine,
  Sparkles,
  Star,
  Globe,
  Users,
  Heart,
  PartyPopper,
  Trophy,
  Leaf,
  Sunrise
} from "lucide-react";
import { launchWebsite } from "@/lib/database";
import confetti from 'canvas-confetti';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LaunchCeremonyProps {
  onLaunchComplete: () => void;
}

export function LaunchCeremony({ onLaunchComplete }: LaunchCeremonyProps) {
  const [stage, setStage] = useState<'welcome' | 'countdown' | 'launching' | 'celebration'>('welcome');
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleLaunch = async () => {
    setLoading(true);
    setStage('countdown');

    // Countdown animation
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setStage('launching');
          
          // Start launching process
          setTimeout(async () => {
            try {
              await launchWebsite();
              setStage('celebration');
              triggerConfetti();
              
              // Auto redirect after celebration
              setTimeout(() => {
                onLaunchComplete();
              }, 8000);
            } catch (error) {
              console.error("Launch error:", error);
              setLoading(false);
              setStage('welcome');
            }
          }, 2000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (stage === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 flex items-center justify-center min-h-screen overflow-y-auto">
        {/* Lottie Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <DotLottieReact
            src="https://lottie.host/86557f6d-76a1-482f-ba75-24448a299cf4/Eip6Z81nqK.lottie"
            loop
            autoplay
            className="w-full h-full max-w-lg max-h-lg"
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Mountain className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to the 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Digital Journey</span>
              </CardTitle>
              
              <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                <strong>IG Thar Village Global Herbs</strong><br />
                Pure Food & Agro Tourism Group
              </p>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-6">
                <p className="text-xl font-bold text-amber-800 mb-2">
                  "Village Life, Global Wellness"
                </p>
                <p className="text-gray-700">
                  From the heart of Thar Desert, Rajasthan
                </p>
              </div>

              {/* Launch Button moved here - right after tagline */}
              <div className="text-center mb-6">
                <Button 
                  onClick={handleLaunch}
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                      Preparing Launch...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      🚀 Launch Website 🚀
                    </>
                  )}
                </Button>
                
                <p className="text-gray-600 mt-2 text-sm">
                  Click to officially launch our digital presence
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <Leaf className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 text-sm">Organic Farming</h3>
                  <p className="text-xs text-green-600">Pure & Natural Products</p>
                </div>
                
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Mountain className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-amber-800 text-sm">Desert Tourism</h3>
                  <p className="text-xs text-amber-600">Authentic Experiences</p>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 text-sm">Community</h3>
                  <p className="text-xs text-blue-600">525+ Farmers Empowered</p>
                </div>
              </div>

              {/* Launch Message */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Trophy className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-purple-900">Official Launch Ceremony</h2>
                </div>
                <p className="text-purple-700 text-base mb-4 leading-relaxed">
                  You are about to witness the digital launch of our mission to bridge traditional wisdom 
                  with modern innovation. Together, we're creating a sustainable future for rural communities 
                  while preserving the rich heritage of the Thar Desert.
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <Star className="h-4 w-4" />
                  <span className="font-medium text-sm">Ready to begin this incredible journey?</span>
                  <Star className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Globe className="h-32 w-32 text-white mx-auto animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">
            {countdown}
          </h1>
          
          <p className="text-2xl text-blue-200 animate-bounce">
            Launching in {countdown}...
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 bg-white rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.3}s` } as React.CSSProperties}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'launching') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Rocket className="h-32 w-32 text-white mx-auto animate-bounce" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🚀 LAUNCHING 🚀
          </h1>
          
          <p className="text-xl text-green-200 mb-8">
            Initializing digital journey...
          </p>
          
          <div className="flex justify-center">
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'celebration') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8 relative">
            <PartyPopper className="h-32 w-32 text-white mx-auto animate-bounce" />
            <div className="absolute -top-4 -left-4">
              <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
            </div>
            <div className="absolute -top-4 -right-4">
              <Star className="h-10 w-10 text-pink-300 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-pulse">
            🎉 CONGRATULATIONS! 🎉
          </h1>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome to the Digital Era!
            </h2>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              <strong>IG Thar Village</strong> has officially launched its digital journey! 
              From the ancient sands of Thar Desert to the global digital landscape, 
              we're now ready to share our mission with the world.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <Heart className="h-8 w-8 text-pink-300 mx-auto mb-2" />
                <p className="text-white font-semibold">Village Life</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Globe className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                <p className="text-white font-semibold">Global Wellness</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <TreePine className="h-8 w-8 text-green-300 mx-auto mb-2" />
                <p className="text-white font-semibold">Sustainable Future</p>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-white/80 animate-pulse">
            Redirecting to website in a moment...
          </p>
          
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 bg-white rounded-full animate-bounce`}
                  style={{ animationDelay: `${i * 0.2}s` } as React.CSSProperties}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
