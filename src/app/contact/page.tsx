"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, Twitter, MessageCircle, Users, Navigation } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        guests: "",
        dates: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
        // You can integrate with Firebase or email service here
        alert("Thank you for your inquiry! We'll get back to you soon.");
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-600 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600 rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-5xl mx-auto text-center">
                        <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 px-6 py-3 text-lg font-medium rounded-full">
                            🌾 IG THAR VILLAGE 🐐
                        </Badge>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Connect With
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Desert Heritage</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
                            Thanks to your love, support & blessings, IG Agro & Goat Farm has now become 
                            <span className="font-semibold text-amber-700"> "IG THAR VILLAGE"</span>. 
                            Connect with us on social media and plan your authentic desert experience!
                        </p>
                        
                        <p className="text-lg text-gray-600 mb-8">
                            Ready to experience authentic desert culture? Get in touch with us to plan your perfect visit
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information & Form */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    We're here to help you plan an unforgettable desert experience.
                                    Contact us for bookings, inquiries, or custom packages.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Card className="rounded-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 rounded-lg p-3">
                                                <MapPin className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary mb-2">Location</h3>
                                                <p className="text-muted-foreground">
                                                    Village & Post - Jhak<br />
                                                    Tehsil - Batadu, District - Barmer<br />
                                                    Rajasthan - 344035, India
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 rounded-lg p-3">
                                                <Phone className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary mb-2">Phone</h3>
                                                <p className="text-muted-foreground">
                                                    +91 8302676869<br />
                                                    Available 24/7
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 rounded-lg p-3">
                                                <Mail className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary mb-2">Email</h3>
                                                <p className="text-muted-foreground">
                                                    info@igtharvillage.com<br />
                                                    bookings@igtharvillage.com
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 rounded-lg p-3">
                                                <Clock className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary mb-2">Operating Hours</h3>
                                                <p className="text-muted-foreground">
                                                    Daily: 6:00 AM - 10:00 PM<br />
                                                    Response time: Within 2-4 hours
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Social Media & Quick Connect */}
                                <Card className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-primary mb-4 flex items-center">
                                            <Users className="h-5 w-5 mr-2" />
                                            Connect With Us
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Social Media Links */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link href="https://www.facebook.com/IGTharVillage" target="_blank" className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                    <Facebook className="h-4 w-4 mr-2" />
                                                    Facebook
                                                </Link>
                                                <Link href="https://instagram.com/igtharvillage" target="_blank" className="flex items-center justify-center p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                                                    <Instagram className="h-4 w-4 mr-2" />
                                                    Instagram
                                                </Link>
                                                <Link href="https://youtube.com/@IgTharVillage" target="_blank" className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                    <Youtube className="h-4 w-4 mr-2" />
                                                    YouTube
                                                </Link>
                                                <Link href="https://twitter.com/IgTharVillage" target="_blank" className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                    <Twitter className="h-4 w-4 mr-2" />
                                                    Twitter
                                                </Link>
                                            </div>
                                            
                                            {/* WhatsApp Options */}
                                            <div className="space-y-2">
                                                <Link href="https://whatsapp.com/channel/0029VaBeUbeK0IBr0zHvNX3Q" target="_blank" className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full">
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    WhatsApp Channel
                                                </Link>
                                                <Link href="https://chat.whatsapp.com/G0zWTztE6559NkVZbXLEex" target="_blank" className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    WhatsApp Group
                                                </Link>
                                            </div>
                                            
                                            {/* Location */}
                                            <Link href="https://share.google/K6JChsw8ylbZbn8qf" target="_blank" className="flex items-center justify-center p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors w-full">
                                                <Navigation className="h-4 w-4 mr-2" />
                                                View on Google Maps
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <Card className="rounded-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Your full name"
                                                    value={formData.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                    required
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => handleChange("email", e.target.value)}
                                                    required
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="+91 8302676869"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange("phone", e.target.value)}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service">Service Interest</Label>
                                                <Select onValueChange={(value) => handleChange("service", value)}>
                                                    <SelectTrigger className="rounded-lg">
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="farm-stay">Farm Stay</SelectItem>
                                                        <SelectItem value="desert-safari">Desert Safari</SelectItem>
                                                        <SelectItem value="camel-safari">Camel Safari</SelectItem>
                                                        <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
                                                        <SelectItem value="products">Organic Products</SelectItem>
                                                        <SelectItem value="custom-package">Custom Package</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="guests">Number of Guests</Label>
                                                <Input
                                                    id="guests"
                                                    placeholder="e.g., 2 adults, 1 child"
                                                    value={formData.guests}
                                                    onChange={(e) => handleChange("guests", e.target.value)}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dates">Preferred Dates</Label>
                                                <Input
                                                    id="dates"
                                                    placeholder="e.g., Dec 15-17, 2024"
                                                    value={formData.dates}
                                                    onChange={(e) => handleChange("dates", e.target.value)}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your requirements, special requests, or any questions you have..."
                                                value={formData.message}
                                                onChange={(e) => handleChange("message", e.target.value)}
                                                required
                                                rows={5}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full rounded-lg">
                                            <Send className="h-5 w-5 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 agricultural-green">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto">
                            Quick answers to common questions about our services and experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                            <CardHeader>
                                <CardTitle className="text-white">What's included in the farm stay?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/90">
                                    Farm stay includes traditional mud house accommodation, all meals with organic food,
                                    cultural experiences, and access to farm activities. Bedding and basic amenities are provided.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                            <CardHeader>
                                <CardTitle className="text-white">How do I reach IG Thar Village?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/90">
                                    We provide detailed directions upon booking. We can also arrange pickup services
                                    from nearby towns. The location is accessible by road with some desert terrain.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                            <CardHeader>
                                <CardTitle className="text-white">What should I bring for the desert experience?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/90">
                                    Bring comfortable clothing, sun protection, personal toiletries, and any medications.
                                    We provide traditional attire for cultural experiences if requested.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
                            <CardHeader>
                                <CardTitle className="text-white">Can you accommodate dietary restrictions?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/90">
                                    Yes, we can accommodate vegetarian, vegan, and other dietary requirements.
                                    Please inform us about any restrictions when booking so we can prepare accordingly.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}