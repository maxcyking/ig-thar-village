"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Upload, X, Plus, Minus, Loader2 } from "lucide-react";
import { createProduct, updateProduct, type Product } from "@/lib/database";
import { uploadMultipleImages } from "@/lib/storage";

const categories = [
  { value: "dairy", label: "Dairy Products" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "vegetables", label: "Vegetables" },
  { value: "spices", label: "Spices & Herbs" },
  { value: "handicrafts", label: "Handicrafts" },
  { value: "other", label: "Other Products" },
];

const units = ["kg", "liter", "piece", "gram", "dozen", "packet", "bottle"];

interface ProductFormProps {
  product?: Product;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export function EnhancedProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    unit: "kg",
    stock: "1",
    description: "",
    shortDescription: "",
    detailedDescription: "",
    weight: "",
    nutritionalInfo: "",
    storageInstructions: "",
    shelfLife: "",
    origin: "",
    organic: false,
    featured: false,
    inStock: true,
    ingredients: [] as string[],
    benefits: [] as string[],
    certifications: [] as string[],
    tags: [] as string[],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        unit: product.unit || "kg",
        stock: product.stock?.toString() || "1",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        detailedDescription: product.detailedDescription || "",
        weight: product.weight || "",
        nutritionalInfo: product.nutritionalInfo || "",
        storageInstructions: product.storageInstructions || "",
        shelfLife: product.shelfLife || "",
        origin: product.origin || "",
        organic: product.organic || false,
        featured: product.featured || false,
        inStock: product.inStock || false,
        ingredients: product.ingredients || [],
        benefits: product.benefits || [],
        certifications: product.certifications || [],
        tags: product.tags || [],
      });
      setImagePreviews(product.images || []);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: "Please select only image files" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: "Image size should be less than 5MB" }));
        return;
      }
      
      validFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === validFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setSelectedImages(prev => [...prev, ...validFiles]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear errors if files are valid
    if (validFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (index < selectedImages.length) {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addArrayItem = (field: 'ingredients' | 'benefits' | 'certifications' | 'tags', value: string) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        handleInputChange(field, [...currentArray, value.trim()]);
      }
    }
  };

  const removeArrayItem = (field: 'ingredients' | 'benefits' | 'certifications' | 'tags', index: number) => {
    const currentArray = formData[field] as string[];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const ArrayInput = ({ 
    field, 
    label, 
    placeholder 
  }: { 
    field: 'ingredients' | 'benefits' | 'certifications' | 'tags';
    label: string;
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const currentArray = formData[field] as string[];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem(field, inputValue);
                setInputValue("");
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem(field, inputValue);
              setInputValue("");
            }}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentArray.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeArrayItem(field, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      let imageUrls: string[] = [];
      
      // Upload new images if selected
      if (selectedImages.length > 0) {
        imageUrls = await uploadMultipleImages(selectedImages, 'products');
      }

      // Combine existing images with new ones
      const existingImages = product?.images || [];
      const allImages = [...existingImages, ...imageUrls];

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        unit: formData.unit,
        stock: parseInt(formData.stock),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        detailedDescription: formData.detailedDescription.trim(),
        weight: formData.weight.trim() || undefined,
        nutritionalInfo: formData.nutritionalInfo.trim() || undefined,
        storageInstructions: formData.storageInstructions.trim() || undefined,
        shelfLife: formData.shelfLife.trim() || undefined,
        origin: formData.origin.trim() || undefined,
        organic: formData.organic,
        featured: formData.featured,
        inStock: formData.inStock && parseInt(formData.stock) > 0,
        ingredients: formData.ingredients.length > 0 ? formData.ingredients : undefined,
        benefits: formData.benefits.length > 0 ? formData.benefits : undefined,
        certifications: formData.certifications.length > 0 ? formData.certifications : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        images: allImages,
      };

      // Filter out undefined values
      const cleanProductData = Object.fromEntries(
        Object.entries(productData).filter(([_, value]) => value !== undefined)
      );

      await onSave(cleanProductData);
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ submit: "Failed to save product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Organic Desert Honey"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="299.99"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                placeholder="399.99"
              />
              <p className="text-xs text-muted-foreground">For showing discounts</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight/Size</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="500g, 1L, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Product Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              placeholder="Brief product description (100-150 characters)"
              rows={2}
              className={errors.shortDescription ? "border-destructive" : ""}
            />
            {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Product description for listing page"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <RichTextEditor
            label="Detailed Description"
            value={formData.detailedDescription}
            onChange={(value) => handleInputChange("detailedDescription", value)}
            placeholder="Write a comprehensive product description with formatting..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ArrayInput
            field="ingredients"
            label="Ingredients"
            placeholder="Add ingredient"
          />

          <ArrayInput
            field="benefits"
            label="Benefits"
            placeholder="Add benefit"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
              <Textarea
                id="nutritionalInfo"
                value={formData.nutritionalInfo}
                onChange={(e) => handleInputChange("nutritionalInfo", e.target.value)}
                placeholder="Calories, proteins, vitamins, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageInstructions">Storage Instructions</Label>
              <Textarea
                id="storageInstructions"
                value={formData.storageInstructions}
                onChange={(e) => handleInputChange("storageInstructions", e.target.value)}
                placeholder="How to store the product"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input
                id="shelfLife"
                value={formData.shelfLife}
                onChange={(e) => handleInputChange("shelfLife", e.target.value)}
                placeholder="6 months, 1 year, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                placeholder="Thar Desert, Rajasthan"
              />
            </div>
          </div>

          <ArrayInput
            field="certifications"
            label="Certifications"
            placeholder="Add certification"
          />

          <ArrayInput
            field="tags"
            label="Tags"
            placeholder="Add tag"
          />
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload Product Images</p>
              <p className="text-sm text-muted-foreground">
                Click to select multiple images or drag and drop
              </p>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              aria-label="Upload product images"
              title="Upload product images"
            />

            {errors.images && (
              <p className="text-sm text-destructive">{errors.images}</p>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked: boolean) => handleInputChange("inStock", checked)}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="organic"
                checked={formData.organic}
                onCheckedChange={(checked: boolean) => handleInputChange("organic", checked)}
              />
              <Label htmlFor="organic">Organic Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked: boolean) => handleInputChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
