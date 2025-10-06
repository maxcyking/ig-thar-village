"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, Twitter, MessageCircle, Users, Navigation, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getSettings, createContactForm, type SiteSettings } from "@/lib/database";

export default function ContactPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const settingsData = await getSettings();
            setSettings(settingsData);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await createContactForm({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || undefined,
                message: formData.message.trim(),
                status: 'new'
            });

            setSubmitted(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            alert("Sorry, there was an error sending your message. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Default fallback data
    const contactInfo = {
        address: settings?.address || "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035, India",
        phone: settings?.phone || "8302676869",
        email: settings?.email || "info@igtharvillage.com",
        socialMedia: settings?.socialMedia || {
            facebook: "https://www.facebook.com/IGTharVillage",
            twitter: "https://twitter.com/IgTharVillage",
            instagram: "https://instagram.com/igtharvillage",
            youtube: "https://youtube.com/@IgTharVillage",
            whatsappChannel: "https://whatsapp.com/channel/0029VaBeUbeK0IBr0zHvNX3Q",
            whatsappGroup: "https://chat.whatsapp.com/G0zWTztE6559NkVZbXLEex",
            googleMaps: "https://share.google/K6JChsw8ylbZbn8qf",
            googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.878913341951!2d71.5730178!3d26.1680727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3946bd7cad02130b%3A0x4a930e2515c99858!2sIG%20THAR%20VILLAGE!5e0!3m2!1sen!2sin!4v1759722154642!5m2!1sen!2sin"
        }
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
                                                    {contactInfo.address}
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
                                                    +91 {contactInfo.phone}<br />
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
                                                    {contactInfo.email}<br />
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
                                                {contactInfo.socialMedia.facebook && (
                                                    <Link href={contactInfo.socialMedia.facebook} target="_blank" className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                        <Facebook className="h-4 w-4 mr-2" />
                                                        Facebook
                                                    </Link>
                                                )}
                                                {contactInfo.socialMedia.instagram && (
                                                    <Link href={contactInfo.socialMedia.instagram} target="_blank" className="flex items-center justify-center p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                                                        <Instagram className="h-4 w-4 mr-2" />
                                                        Instagram
                                                    </Link>
                                                )}
                                                {contactInfo.socialMedia.youtube && (
                                                    <Link href={contactInfo.socialMedia.youtube} target="_blank" className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                        <Youtube className="h-4 w-4 mr-2" />
                                                        YouTube
                                                    </Link>
                                                )}
                                                {contactInfo.socialMedia.twitter && (
                                                    <Link href={contactInfo.socialMedia.twitter} target="_blank" className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                        <Twitter className="h-4 w-4 mr-2" />
                                                        Twitter
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            {/* WhatsApp Options */}
                                            <div className="space-y-2">
                                                {contactInfo.socialMedia.whatsappChannel && (
                                                    <Link href={contactInfo.socialMedia.whatsappChannel} target="_blank" className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full">
                                                        <MessageCircle className="h-4 w-4 mr-2" />
                                                        WhatsApp Channel
                                                    </Link>
                                                )}
                                                {contactInfo.socialMedia.whatsappGroup && (
                                                    <Link href={contactInfo.socialMedia.whatsappGroup} target="_blank" className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        WhatsApp Group
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            {/* Location */}
                                            {contactInfo.socialMedia.googleMaps && (
                                                <Link href={contactInfo.socialMedia.googleMaps} target="_blank" className="flex items-center justify-center p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors w-full">
                                                    <Navigation className="h-4 w-4 mr-2" />
                                                    View on Google Maps
                                                </Link>
                                            )}
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
                                    {submitted ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                                            <p className="text-gray-600 mb-6">
                                                Thank you for your inquiry! We'll get back to you within 2-4 hours.
                                            </p>
                                            <Button 
                                                onClick={() => setSubmitted(false)}
                                                variant="outline"
                                                className="rounded-lg"
                                            >
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
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
                                                        disabled={submitting}
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
                                                        disabled={submitting}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="+91 8302676869"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange("phone", e.target.value)}
                                                    className="rounded-lg"
                                                    disabled={submitting}
                                                />
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
                                                    disabled={submitting}
                                                />
                                            </div>

                                            <Button 
                                                type="submit" 
                                                size="lg" 
                                                className="w-full rounded-lg"
                                                disabled={submitting}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-5 w-5 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps Section */}
            {contactInfo.socialMedia.googleMapsEmbed && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Find Us on the Map
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Located in the heart of Thar Desert, Rajasthan. Easy to reach with detailed directions provided.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <iframe 
                                    src={contactInfo.socialMedia.googleMapsEmbed}
                                    width="100%" 
                                    height="450" 
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                    title="IG Thar Village Location"
                                />
                            </div>
                            
                            <div className="text-center mt-6">
                                {contactInfo.socialMedia.googleMaps && (
                                    <Link 
                                        href={contactInfo.socialMedia.googleMaps} 
                                        target="_blank"
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Navigation className="h-5 w-5" />
                                        Open in Google Maps
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

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