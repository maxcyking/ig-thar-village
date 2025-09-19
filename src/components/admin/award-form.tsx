"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { createAward, updateAward, type Award } from "@/lib/database";
import { uploadImage } from "@/lib/storage";

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
  });
  
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string>(award?.certificateUrl || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCertificateSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (allow images for certificate photos)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, certificate: "Please select an image file (JPEG, PNG, WebP) or PDF" }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, certificate: "File size should be less than 10MB" }));
      return;
    }

    setSelectedCertificateFile(file);
    
    // Create preview for images only
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCertificatePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCertificatePreview(""); // Clear preview for PDFs
    }
    
    // Clear any existing errors
    if (errors.certificate) {
      setErrors(prev => ({ ...prev, certificate: "" }));
    }
  };

  const removeCertificate = () => {
    setSelectedCertificateFile(null);
    setCertificatePreview(award?.certificateUrl || "");
    if (certificateInputRef.current) {
      certificateInputRef.current.value = "";
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
      let certificateUrl = award?.certificateUrl || "";

      // Upload new certificate if selected
      if (selectedCertificateFile) {
        // Upload new certificate
        const fileName = `${Date.now()}_${selectedCertificateFile.name}`;
        certificateUrl = await uploadImage(selectedCertificateFile, `awards/images/${fileName}`);
      }

      // Build award data without undefined values
      const awardData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        organization: formData.organization.trim(),
        year: formData.year.trim(),
        category: formData.category as any,
        featured: formData.featured,
        visible: formData.visible,
      };

      // Only add URLs if they exist
      if (certificateUrl) {
        awardData.certificateUrl = certificateUrl;
      }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className={errors.category ? "border-destructive" : ""}>
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
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
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
          rows={4}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Certificate Upload */}
      <div className="space-y-2">
        <Label>Certificate Image</Label>
        <div className="space-y-4">
          {!certificatePreview && !selectedCertificateFile ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => certificateInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload Certificate</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your certificate image or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP, and PDF files up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                {selectedCertificateFile?.type === 'application/pdf' || (certificatePreview && certificatePreview.includes('pdf')) ? (
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
                onClick={removeCertificate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <input
            ref={certificateInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleCertificateSelect}
            className="hidden"
            aria-label="Upload certificate file"
            title="Upload certificate file"
          />
          
          {errors.certificate && (
            <p className="text-sm text-destructive">{errors.certificate}</p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked: boolean) => handleInputChange("featured", checked)}
          />
          <Label htmlFor="featured">Featured Award</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="visible"
            checked={formData.visible}
            onCheckedChange={(checked: boolean) => handleInputChange("visible", checked)}
          />
          <Label htmlFor="visible">Visible to Public</Label>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {award ? "Update Award" : "Add Award"}
        </Button>
      </div>
    </form>
  );
}