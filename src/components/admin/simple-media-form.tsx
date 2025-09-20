"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createMediaItem, updateMediaItem, type MediaItem } from "@/lib/database";
import { uploadImage, deleteImage } from "@/lib/storage";

interface SimpleMediaFormProps {
  media?: MediaItem;
  onMediaAdded: () => void;
}

export default function SimpleMediaForm({ media, onMediaAdded }: SimpleMediaFormProps) {
  const [formData, setFormData] = useState({
    type: media?.type || 'gallery' as 'gallery' | 'media',
    visible: media?.visible !== undefined ? media.visible : true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(media?.imageUrl || "");
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
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: "" }));
        }
      } else {
        setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(media?.imageUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!imagePreview && !selectedFile) {
      newErrors.image = "Please select an image";
    }

    if (!formData.type) {
      newErrors.type = "Please select a media type";
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
      let imageUrl = media?.imageUrl || "";

      // Upload new image if selected
      if (selectedFile) {
        if (media?.imageUrl) {
          try {
            await deleteImage(media.imageUrl);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }
        
        imageUrl = await uploadImage(selectedFile, `media/${formData.type}`);
      }

      const mediaData = {
        imageUrl,
        type: formData.type,
        visible: formData.visible,
      };

      if (media) {
        // Update existing media
        await updateMediaItem(media.id, mediaData);
      } else {
        // Create new media
        await createMediaItem(mediaData);
      }

      onMediaAdded();
    } catch (error) {
      console.error("Error saving media:", error);
      setErrors({ submit: "Failed to save media. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Image</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload an image or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image}</p>
        )}
      </div>

      {/* Media Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Media Type</Label>
        <Select value={formData.type} onValueChange={(value: 'gallery' | 'media') => handleInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gallery">Gallery - Shows in Gallery page</SelectItem>
            <SelectItem value="media">Media - Shows in Media page</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type}</p>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="visible"
          checked={formData.visible}
          onCheckedChange={(checked) => handleInputChange('visible', checked)}
        />
        <Label htmlFor="visible" className="text-sm font-medium">
          Make this image visible to users
        </Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {media ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {media ? "Update Media" : "Upload Media"}
            </>
          )}
        </Button>
      </div>

      {errors.submit && (
        <p className="text-sm text-destructive text-center">{errors.submit}</p>
      )}
    </form>
  );
}
