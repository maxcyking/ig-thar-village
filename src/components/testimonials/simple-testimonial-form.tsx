"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Star, Send, CheckCircle, AlertCircle, User } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { createTestimonial } from '@/lib/testimonials';
import AuthModal from '@/components/auth/auth-modal';

interface SimpleTestimonialFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function SimpleTestimonialForm({ onSuccess, className = '' }: SimpleTestimonialFormProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [experience, setExperience] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form first
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!experience.trim()) {
      setError('Please share your experience');
      return;
    }

    // Check authentication only when submitting
    if (!user) {
      setAuthModalTab('login'); // Default to login
      setShowAuthModal(true);
      return;
    }

    // If user is authenticated, proceed with submission
    await submitTestimonial();
  };

  const submitTestimonial = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await createTestimonial({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        rating,
        title: `${rating} Star Experience`, // Auto-generate simple title
        message: experience.trim(),
        experience: 'General Experience', // Add required field
        status: 'pending',
        featured: false,
        visible: true
      });

      setSubmitted(true);
      setExperience('');
      setRating(0);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setError('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    setError('');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful authentication, submit the testimonial
    setTimeout(() => {
      submitTestimonial();
    }, 100);
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
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <User className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You can fill out your review now. We'll ask you to sign in when you're ready to submit.
                <span className="block mt-1 text-xs text-amber-700">
                  New to IG Thar Village? You can create an account during submission.
                </span>
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
            {/* Star Rating */}
            <div className="space-y-3">
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
                    title={`Rate ${value} star${value !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${value <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {rating} star{rating !== 1 ? 's' : ''} -
                    {rating === 5 && ' Excellent!'}
                    {rating === 4 && ' Very Good!'}
                    {rating === 3 && ' Good!'}
                    {rating === 2 && ' Fair'}
                    {rating === 1 && ' Poor'}
                  </Badge>
                </div>
              )}
            </div>

            {/* Experience Textarea */}
            <div className="space-y-3">
              <Label htmlFor="experience" className="text-base font-medium">
                Your Experience *
              </Label>
              <Textarea
                id="experience"
                placeholder="Share your authentic experience at IG Thar Village. What made your visit special? How was the hospitality, food, activities, and overall experience?"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                rows={6}
                disabled={loading}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Share what made your experience memorable
                </p>
                <p className="text-xs text-gray-500">
                  {experience.length}/1000 characters
                </p>
              </div>
            </div>

            {user && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Posting as:</strong> {user.displayName || user.email?.split('@')[0] || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your testimonial will be reviewed before being published
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Share Your Experience
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
        defaultTab={authModalTab === 'login' ? 'signin' : 'signup'}
      />
    </>
  );
}