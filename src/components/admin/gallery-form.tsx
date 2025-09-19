"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createGalleryImage, updateGalleryImage, type GalleryImage } from "@/lib/database";
import { uploadImage, deleteImage } from "@/lib/storage";

const categories = [
  { value: "accommodation", label: "Accommodation" },
  { value: "activities", label: "Activities" },
  { value: "food", label: "Food" },
  { value: "culture", label: "Culture" },
  { value: "agriculture", label: "Agriculture" },
  { value: "heritage", label: "Heritage" },
  { value: "nature", label: "Nature" },
  { value: "spirituality", label: "Spirituality" },
];

interface GalleryFormProps {
  image?: GalleryImage;
  onImageAdded: () => void;
}

export default function GalleryForm({ image, onImageAdded }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    title: image?.title || "",
    description: image?.description || "",
    category: image?.category || "",
    featured: image?.featured || false,
    visible: image?.visible !== undefined ? image.visible : true,
    altText: image?.altText || "",
    tags: image?.tags?.join(", ") || "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(image?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please select an image file" }));
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 10MB" }));
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(image?.imageUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!image && !selectedFile) {
      newErrors.image = "Please select an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let imageUrl = image?.imageUrl || "";

      // Upload new image if selected
      if (selectedFile) {
        // Delete old image if editing
        if (image?.imageUrl) {
          try {
            await deleteImage(image.imageUrl);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }

        // Upload new image
        const fileName = `${Date.now()}_${selectedFile.name}`;
        imageUrl = await uploadImage(selectedFile, `gallery/${fileName}`);
      }

      const galleryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as any,
        featured: formData.featured,
        visible: formData.visible,
        imageUrl,
        altText: formData.altText.trim() || formData.title.trim(),
        tags: formData.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      if (image) {
        // Update existing image
        await updateGalleryImage(image.id, galleryData);
      } else {
        // Create new image
        await createGalleryImage(galleryData);
      }

      onImageAdded();
    } catch (error) {
      console.error("Error saving image:", error);
      setErrors({ submit: "Failed to save image. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="space-y-4">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              {!image && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </Button>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload gallery image"
            title="Upload gallery image"
          />
          
          {errors.image && (
            <p className="text-sm text-destructive">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter image title..."
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe the image..."
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger className={errors.category ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      {/* Alt Text */}
      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Input
          id="altText"
          value={formData.altText}
          onChange={(e) => handleInputChange("altText", e.target.value)}
          placeholder="Alternative text for accessibility..."
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to use the title as alt text
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          placeholder="Enter tags separated by commas..."
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas (e.g., desert, sunset, landscape)
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange("featured", checked)}
          />
          <Label htmlFor="featured" className="text-sm font-medium">
            Featured Image
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="visible"
            checked={formData.visible}
            onCheckedChange={(checked) => handleInputChange("visible", checked)}
          />
          <Label htmlFor="visible" className="text-sm font-medium">
            Visible on website
          </Label>
        </div>
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {image ? "Update Image" : "Add Image"}
        </Button>
      </div>
    </form>
  );
}
