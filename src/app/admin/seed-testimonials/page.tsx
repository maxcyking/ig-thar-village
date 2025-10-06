"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Database, Loader2 } from "lucide-react";
import { seedTestimonialsData } from '@/lib/seed-testimonials';

export default function SeedTestimonialsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await seedTestimonialsData();
      setSuccess(true);
    } catch (err) {
      console.error('Error seeding testimonials:', err);
      setError('Failed to seed testimonials. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Testimonials Data
          </CardTitle>
          <CardDescription>
            This will create sample testimonials in your database for testing and demonstration purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Successfully seeded testimonials data! You can now view them in the testimonials section.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">This will create:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 8 sample testimonials from different users</li>
              <li>• Mix of 4 and 5-star ratings</li>
              <li>• Various experience types (Farm Stay, Desert Safari, etc.)</li>
              <li>• Featured and non-featured testimonials</li>
              <li>• All testimonials will be pre-approved</li>
            </ul>
          </div>

          <Button 
            onClick={handleSeedData}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Seed Testimonials Data
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500">
            Note: This is safe to run multiple times, but it will create duplicate entries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}