"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Plus } from "lucide-react";

interface ServiceFormProps {
  service?: any;
  onSave: (serviceData: any) => void;
  onCancel: () => void;
}

const categories = [
  { value: "safari", label: "Safari" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
  { value: "spiritual", label: "Spiritual" },
  { value: "educational", label: "Educational" }
];

const durationOptions = [
  "2 hours", "3 hours", "4 hours", "Half day", "Full day",
  "2 days", "3 days", "1 week", "Custom"
];

const commonInclusions = [
  "Transportation", "Guide", "Meals", "Accommodation", "Entry Fees",
  "Equipment", "Insurance", "Photography", "Refreshments", "Certificates",
  "Souvenirs", "Pick-up & Drop-off", "Traditional Costume", "Cultural Performance"
];

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    duration: "",
    customDuration: "",
    price: "",
    maxParticipants: "",
    shortDescription: "",
    description: "",
    included: [] as string[],
    customInclusion: "",
    featured: false,
    available: true,
    images: [] as File[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        category: service.category || "",
        duration: service.duration || "",
        customDuration: "",
        price: service.price?.toString() || "",
        maxParticipants: service.maxParticipants?.toString() || "",
        shortDescription: service.shortDescription || "",
        description: service.description || "",
        included: service.included || [],
        customInclusion: "",
        featured: service.featured || false,
        available: service.available !== false,
        images: []
      });
    }
  }, [service]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInclusionToggle = (inclusion: string) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.includes(inclusion)
        ? prev.included.filter(i => i !== inclusion)
        : [...prev.included, inclusion]
    }));
  };

  const addCustomInclusion = () => {
    if (formData.customInclusion.trim() && !formData.included.includes(formData.customInclusion.trim())) {
      setFormData(prev => ({
        ...prev,
        included: [...prev.included, prev.customInclusion.trim()],
        customInclusion: ""
      }));
    }
  };

  const removeInclusion = (inclusion: string) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter(i => i !== inclusion)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      duration: formData.duration === "Custom" ? formData.customDuration : formData.duration,
      price: parseFloat(formData.price),
      maxParticipants: parseInt(formData.maxParticipants)
    };

    onSave(serviceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Service Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Desert Safari Adventure"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Duration and Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
          <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.duration === "Custom" && (
          <div className="space-y-2">
            <Label htmlFor="customDuration">Custom Duration *</Label>
            <Input
              id="customDuration"
              placeholder="e.g., 5 days 4 nights"
              value={formData.customDuration}
              onChange={(e) => handleInputChange("customDuration", e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="price">Price per Person (₹) *</Label>
          <Input
            id="price"
            type="number"
            placeholder="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxParticipants">Max Participants *</Label>
          <Input
            id="maxParticipants"
            type="number"
            placeholder="0"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
            required
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description *</Label>
          <Textarea
            id="shortDescription"
            placeholder="Brief description for listings..."
            value={formData.shortDescription}
            onChange={(e) => handleInputChange("shortDescription", e.target.value)}
            required
            rows={2}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description *</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the service..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
            rows={4}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* What's Included */}
      <div className="space-y-4">
        <Label>What's Included</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonInclusions.map((inclusion) => (
            <div key={inclusion} className="flex items-center space-x-2">
              <Checkbox
                id={inclusion}
                checked={formData.included.includes(inclusion)}
                onCheckedChange={() => handleInclusionToggle(inclusion)}
              />
              <Label htmlFor={inclusion} className="text-sm font-normal">
                {inclusion}
              </Label>
            </div>
          ))}
        </div>

        {/* Custom Inclusion */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom inclusion"
            value={formData.customInclusion}
            onChange={(e) => handleInputChange("customInclusion", e.target.value)}
            className="rounded-lg"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustomInclusion}
            className="rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Inclusions */}
        {formData.included.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.included.map((inclusion) => (
              <div
                key={inclusion}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {inclusion}
                <button
                  type="button"
                  onClick={() => removeInclusion(inclusion)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Service Images</Label>
        <Card className="rounded-lg">
          <CardContent className="p-6">
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload service images
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5MB each
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload service images"
              />
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
          />
          <Label htmlFor="featured">Featured Service</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) => handleInputChange("available", checked as boolean)}
          />
          <Label htmlFor="available">Available for Booking</Label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="submit" className="flex-1 rounded-lg">
          {service ? "Update Service" : "Add Service"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}