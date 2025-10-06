"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Star, Send, CheckCircle, AlertCircle, User, MapPin, Award } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { createTestimonial } from '@/lib/testimonials';
import AuthModal from '@/components/auth/auth-modal';

interface TestimonialFormProps {
  onSuccess?: () => void;
  className?: string;
}

const experienceOptions = [
  'Farm Stay Experience',
  'Desert Safari',
  'Cultural Heritage Package',
  'Farm Visit & Products',
  'Camel Safari',
  'Traditional Performances',
  'Natural Food Experience',
  'Mud House Stay',
  'Desert Adventure',
  'Spiritual Journey',
  'Educational Tour',
  'Photography Tour',
  'Other'
];

export default function TestimonialForm({ onSuccess, className = '' }: TestimonialFormProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    experience: '',
    userLocation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createTestimonial({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userLocation: formData.userLocation.trim() || undefined,
        rating,
        title: formData.title.trim(),
        message: formData.message.trim(),
        experience: formData.experience || undefined,
        status: 'pending',
        featured: false,
        visible: true
      });

      setSubmitted(true);
      setFormData({ title: '', message: '', experience: '', userLocation: '' });
      setRating(0);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setError('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    setError('');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  if (submitted) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your testimonial has been submitted and is pending review. 
            We appreciate you taking the time to share your experience!
          </p>
          <Badge variant="outline" className="mb-4">
            Review Status: Pending Approval
          </Badge>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mt-2"
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Share Your Experience
          </CardTitle>
          <CardDescription>
            Help others discover the magic of IG Thar Village by sharing your authentic experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Please sign in to share your testimonial and help other travelers discover our authentic desert experiences.
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-1 text-blue-600 underline"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign in here
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Rate Your Experience *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingClick(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                    disabled={loading}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        value <= (hoveredRating || rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 && (
                    <>
                      {rating} star{rating !== 1 ? 's' : ''} - 
                      {rating === 5 && ' Excellent!'}
                      {rating === 4 && ' Very Good!'}
                      {rating === 3 && ' Good!'}
                      {rating === 2 && ' Fair'}
                      {rating === 1 && ' Poor'}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Amazing desert experience!"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                disabled={loading || !user}
                maxLength={100}
              />
              <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Experience Type
              </Label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading || !user}
              >
                <option value="">Select your experience (optional)</option>
                {experienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Your Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Mumbai, India or New York, USA"
                value={formData.userLocation}
                onChange={(e) => handleChange('userLocation', e.target.value)}
                disabled={loading || !user}
                maxLength={50}
              />
              <p className="text-xs text-gray-500">Optional - helps other travelers relate to your experience</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Experience *</Label>
              <Textarea
                id="message"
                placeholder="Share your authentic experience at IG Thar Village. What made your visit special? How was the hospitality, food, activities, and overall experience?"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                required
                rows={5}
                disabled={loading || !user}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">{formData.message.length}/1000 characters</p>
            </div>

            {user && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Posting as:</strong> {user.displayName || user.email?.split('@')[0] || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Your testimonial will be reviewed before being published
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={loading || !user}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Submitting...
                </>
              ) : !user ? (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Sign In to Submit Review
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="signup"
      />
    </>
  );
}