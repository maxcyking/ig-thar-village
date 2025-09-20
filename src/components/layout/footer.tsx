"use client";

import Link from "next/link";
import Image from "next/image";
import { Mountain, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/settings-context";

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {settings?.logo ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <Image
                    src={settings.logo}
                    alt={settings.siteName}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Mountain className="h-7 w-7 text-white" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold">
                  {settings?.siteName ? 
                    (settings.siteName.length > 20 ? "IG Thar Village" : settings.siteName)
                    : "IG Thar Village"
                  }
                </span>
                <p className="text-xs text-gray-400">
                  {settings?.tagline || "Authentic Desert Experience"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experience authentic Thar Desert culture, traditional hospitality, and organic farming practices in the heart of West Rajasthan.
            </p>
            <div className="flex space-x-3">
              <Link href="https://www.facebook.com/IGTharVillage" target="_blank">
                <Button size="icon" variant="outline" className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white rounded-lg">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://instagram.com/igtharvillage" target="_blank">
                <Button size="icon" variant="outline" className="border-gray-600 text-gray-300 hover:bg-pink-600 hover:border-pink-600 hover:text-white rounded-lg">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://youtube.com/@IgTharVillage" target="_blank">
                <Button size="icon" variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white rounded-lg">
                  <Youtube className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://twitter.com/IgTharVillage" target="_blank">
                <Button size="icon" variant="outline" className="border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white rounded-lg">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">About Us</Link>
              <Link href="/services" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">Services</Link>
              <Link href="/products" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">Products</Link>
              <Link href="/gallery" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">Gallery</Link>
              <Link href="/awards" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">Awards</Link>
              <Link href="/media" className="block text-sm text-gray-300 hover:text-green-400 transition-colors">Media</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">🏡 Farm Stay Experience</p>
              <p className="text-sm text-gray-300">🏜️ Desert Safari Adventures</p>
              <p className="text-sm text-gray-300">🐪 Camel Safari Tours</p>
              <p className="text-sm text-gray-300">🎭 Cultural Programs</p>
              <p className="text-sm text-gray-300">🌾 Organic Products</p>
              <p className="text-sm text-gray-300">🏛️ Heritage Tours</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Location</p>
                  <p className="text-sm text-gray-300">
                    {settings?.address || "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Phone</p>
                  <p className="text-sm text-gray-300">
                    +91 {settings?.phone || "8302676869"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Email</p>
                  <p className="text-sm text-gray-300">
                    {settings?.email || "info@igtharvillage.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 IG Thar Village. All rights reserved. Established by Dr. Devaram Pawar & Dhapu.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-green-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}