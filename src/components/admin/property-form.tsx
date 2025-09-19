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

interface PropertyFormProps {
  property?: any;
  onSave: (propertyData: any) => void;
  onCancel: () => void;
}

const categories = [
  { value: "farm-stay", label: "Farm Stay" },
  { value: "desert-camp", label: "Desert Camp" },
  { value: "heritage-room", label: "Heritage Room" },
  { value: "luxury-tent", label: "Luxury Tent" }
];

const commonAmenities = [
  "WiFi", "Air Conditioning", "Heating", "Private Bathroom", "Hot Water",
  "Room Service", "Laundry", "Parking", "Restaurant", "Swimming Pool",
  "Spa", "Gym", "Garden View", "Desert View", "Balcony", "Terrace",
  "Kitchen", "Refrigerator", "TV", "Safe", "Complimentary Breakfast"
];

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    pricePerNight: "",
    maxGuests: "",
    shortDescription: "",
    description: "",
    amenities: [] as string[],
    customAmenity: "",
    featured: false,
    available: true,
    images: [] as File[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        category: property.category || "",
        location: property.location || "",
        pricePerNight: property.pricePerNight?.toString() || "",
        maxGuests: property.maxGuests?.toString() || "",
        shortDescription: property.shortDescription || "",
        description: property.description || "",
        amenities: property.amenities || [],
        customAmenity: "",
        featured: property.featured || false,
        available: property.available !== false,
        images: []
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addCustomAmenity = () => {
    if (formData.customAmenity.trim() && !formData.amenities.includes(formData.customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, prev.customAmenity.trim()],
        customAmenity: ""
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
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

    const propertyData = {
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
      maxGuests: parseInt(formData.maxGuests)
    };

    onSave(propertyData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Desert Heritage Villa"
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

      {/* Location and Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Jaisalmer, Rajasthan"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerNight">Price per Night (₹) *</Label>
          <Input
            id="pricePerNight"
            type="number"
            placeholder="0"
            value={formData.pricePerNight}
            onChange={(e) => handleInputChange("pricePerNight", e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxGuests">Max Guests *</Label>
          <Input
            id="maxGuests"
            type="number"
            placeholder="0"
            value={formData.maxGuests}
            onChange={(e) => handleInputChange("maxGuests", e.target.value)}
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
            placeholder="Detailed description of the property..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
            rows={4}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>

        {/* Custom Amenity */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom amenity"
            value={formData.customAmenity}
            onChange={(e) => handleInputChange("customAmenity", e.target.value)}
            className="rounded-lg"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustomAmenity}
            className="rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Amenities */}
        {formData.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  className="ml-1 text-green-600 hover:text-green-800"
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
        <Label>Property Images</Label>
        <Card className="rounded-lg">
          <CardContent className="p-6">
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload property images
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
                aria-label="Upload property images"
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
          <Label htmlFor="featured">Featured Property</Label>
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
          {property ? "Update Property" : "Add Property"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}