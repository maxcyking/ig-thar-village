"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu, Mountain, Phone } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Awards", href: "/awards" },
  { name: "Gallery", href: "/gallery" },
  { name: "Media", href: "/media" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Mountain className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">IG Thar Village</span>
              <p className="text-xs text-gray-600 hidden sm:block">Authentic Desert Experience</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50 rounded-lg">
              <Link href="/contact">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
              <Link href="/services">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Main navigation menu for IG Thar Village website</SheetDescription>
                </VisuallyHidden>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <Button asChild variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 rounded-lg">
                    <Link href="/contact">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    <Link href="/services">Book Experience</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}