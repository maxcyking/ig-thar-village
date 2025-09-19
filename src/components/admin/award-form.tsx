"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Image as ImageIcon, Loader2, Calendar } from "lucide-react";
import { createAward, updateAward, type Award } from "@/lib/database";
import { uploadImage, deleteImage } from "@/lib/storage";

const categories = [
  { value: "sustainability", label: "Sustainability" },
  { value: "tourism", label: "Tourism" },
  { value: "hospitality", label: "Hospitality" },
  { value: "culture", label: "Culture" },
  { value: "community", label: "Community" },
  { value: "agriculture", label: "Agriculture" },
  { value: "innovation", label: "Innovation" },
  { value: "other", label: "Other" },
];

interface AwardFormProps {
  award?: Award;
  onAwardAdded: () => void;
}

export default function AwardForm({ award, onAwardAdded }: AwardFormProps) {
  const [formData, setFormData] = useState({
    title: award?.title || "",
    description: award?.description || "",
    organization: award?.organization || "",
    year: award?.year || new Date().getFullYear().toString(),
    category: award?.category || "",
    featured: award?.featured || false,
    visible: award?.visible !== undefined ? award.visible : true,
    certificateNumber: award?.certificateNumber || "",
    testimonial: award?.testimonial || "",
    testimonialAuthor: award?.testimonialAuthor || "",
    testimonialPosition: award?.testimonialPosition || "",
    awardDate: award?.awardDate ? award.awardDate.toISOString().split('T')[0] : "",
  });
  
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(award?.imageUrl || "");
  const [certificatePreview, setCertificatePreview] = useState<string>(award?.certificateUrl || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'certificate') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validDocTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: "Please select an image file (JPEG, PNG, or WebP)" }));
      return;
    }
    
    if (type === 'certificate' && !validDocTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: "Please select a PDF or image file" }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: "File size should be less than 10MB" }));
      return;
    }

    if (type === 'image') {
      setSelectedImageFile(file);
    } else {
      setSelectedCertificateFile(file);
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'image') {
        setImagePreview(result);
      } else {
        setCertificatePreview(result);
      }
    };
    reader.readAsDataURL(file);
    
    if (errors[type]) {
      setErrors(prev => ({ ...prev, [type]: "" }));
    }
  };

  const removeFile = (type: 'image' | 'certificate') => {
    if (type === 'image') {
      setSelectedImageFile(null);
      setImagePreview(award?.imageUrl || "");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } else {
      setSelectedCertificateFile(null);
      setCertificatePreview(award?.certificateUrl || "");
      if (certificateInputRef.current) {
        certificateInputRef.current.value = "";
      }
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

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.year.trim()) {
      newErrors.year = "Year is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
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
      let imageUrl = award?.imageUrl || "";
      let certificateUrl = award?.certificateUrl || "";

      // Upload new image if selected
      if (selectedImageFile) {
        // Delete old image if editing
        if (award?.imageUrl) {
          try {
            await deleteImage(award.imageUrl);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }

        // Upload new image
        const fileName = `${Date.now()}_${selectedImageFile.name}`;
        imageUrl = await uploadImage(selectedImageFile, `awards/images/${fileName}`);
      }

      // Upload new certificate if selected
      if (selectedCertificateFile) {
        // Delete old certificate if editing
        if (award?.certificateUrl) {
          try {
            await deleteImage(award.certificateUrl);
          } catch (error) {
            console.warn("Could not delete old certificate:", error);
          }
        }

        // Upload new certificate
        const fileName = `${Date.now()}_${selectedCertificateFile.name}`;
        certificateUrl = await uploadImage(selectedCertificateFile, `awards/certificates/${fileName}`);
      }

      const awardData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        organization: formData.organization.trim(),
        year: formData.year.trim(),
        category: formData.category as any,
        featured: formData.featured,
        visible: formData.visible,
        imageUrl,
        certificateUrl,
        certificateNumber: formData.certificateNumber.trim() || undefined,
        testimonial: formData.testimonial.trim() || undefined,
        testimonialAuthor: formData.testimonialAuthor.trim() || undefined,
        testimonialPosition: formData.testimonialPosition.trim() || undefined,
        awardDate: formData.awardDate ? new Date(formData.awardDate) : undefined,
      };

      if (award) {
        // Update existing award
        await updateAward(award.id, awardData);
      } else {
        // Create new award
        await createAward(awardData);
      }

      onAwardAdded();
    } catch (error) {
      console.error("Error saving award:", error);
      setErrors({ submit: "Failed to save award. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Award Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter award title..."
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization *</Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={(e) => handleInputChange("organization", e.target.value)}
            placeholder="Awarding organization..."
            className={errors.organization ? "border-destructive" : ""}
          />
          {errors.organization && (
            <p className="text-sm text-destructive">{errors.organization}</p>
          )}
        </div>
      </div>

      {/* Year and Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            placeholder="2024"
            className={errors.year ? "border-destructive" : ""}
          />
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year}</p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="awardDate">Award Date</Label>
          <Input
            id="awardDate"
            type="date"
            value={formData.awardDate}
            onChange={(e) => handleInputChange("awardDate", e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe the award and its significance..."
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Certificate Number */}
      <div className="space-y-2">
        <Label htmlFor="certificateNumber">Certificate Number</Label>
        <Input
          id="certificateNumber"
          value={formData.certificateNumber}
          onChange={(e) => handleInputChange("certificateNumber", e.target.value)}
          placeholder="Certificate or reference number..."
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Award Image</Label>
        <div className="space-y-4">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload award image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Award preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeFile('image')}
              >
                <X className="h-4 w-4" />
              </Button>
              {!award && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Change Image
                </Button>
              )}
            </div>
          )}
          
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'image')}
            className="hidden"
            aria-label="Upload award image"
            title="Upload award image"
          />
          
          {errors.image && (
            <p className="text-sm text-destructive">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Certificate Upload */}
      <div className="space-y-2">
        <Label>Certificate File</Label>
        <div className="space-y-4">
          {!certificatePreview ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => certificateInputRef.current?.click()}
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload certificate
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                {selectedCertificateFile?.type === 'application/pdf' || certificatePreview.includes('pdf') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-red-600 mb-2" />
                      <p className="text-sm font-medium">PDF Certificate</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCertificateFile?.name || 'Certificate file'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={certificatePreview}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeFile('certificate')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => certificateInputRef.current?.click()}
              >
                Change File
              </Button>
            </div>
          )}
          
          <input
            ref={certificateInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => handleFileSelect(e, 'certificate')}
            className="hidden"
            aria-label="Upload certificate file"
            title="Upload certificate file"
          />
          
          {errors.certificate && (
            <p className="text-sm text-destructive">{errors.certificate}</p>
          )}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="space-y-4">
        <Label>Testimonial (Optional)</Label>
        <div className="space-y-4">
          <Textarea
            value={formData.testimonial}
            onChange={(e) => handleInputChange("testimonial", e.target.value)}
            placeholder="Quote or testimonial about the award..."
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={formData.testimonialAuthor}
              onChange={(e) => handleInputChange("testimonialAuthor", e.target.value)}
              placeholder="Testimonial author name..."
            />
            <Input
              value={formData.testimonialPosition}
              onChange={(e) => handleInputChange("testimonialPosition", e.target.value)}
              placeholder="Author position/title..."
            />
          </div>
        </div>
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
            Featured Award
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
          {award ? "Update Award" : "Add Award"}
        </Button>
      </div>
    </form>
  );
}
