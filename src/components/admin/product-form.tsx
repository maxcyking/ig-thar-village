"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

const categories = [
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "vegetables", label: "Vegetables" },
  { value: "spices", label: "Spices" },
  { value: "handicrafts", label: "Handicrafts" },
  { value: "other", label: "Other" }
];
const units = ["kg", "liter", "piece", "gram", "dozen"];

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "kg",
    stock: "",
    description: "",
    weight: "",
    nutritionalInfo: "",
    organic: false,
    featured: false,
    image: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        unit: product.unit || "kg",
        stock: "0", // We don't track stock in the new structure
        description: product.description || "",
        weight: product.weight || "",
        nutritionalInfo: product.nutritionalInfo || "",
        organic: product.organic || false,
        featured: product.featured || false,
        image: null
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Fresh Goat Milk"
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

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
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
          <Label htmlFor="unit">Unit *</Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
            <SelectTrigger className="rounded-lg">
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

        <div className="space-y-2">
          <Label htmlFor="weight">Weight/Quantity</Label>
          <Input
            id="weight"
            placeholder="e.g., 500g, 1kg, 250ml"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your product..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          rows={3}
          className="rounded-lg"
        />
      </div>

      {/* Nutritional Information */}
      <div className="space-y-2">
        <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
        <Textarea
          id="nutritionalInfo"
          placeholder="Nutritional facts, health benefits, etc..."
          value={formData.nutritionalInfo}
          onChange={(e) => handleInputChange("nutritionalInfo", e.target.value)}
          rows={3}
          className="rounded-lg"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        <Card className="rounded-lg">
          <CardContent className="p-6">
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload product image"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <div className="flex gap-6">
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

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="submit" className="flex-1 rounded-lg">
          {product ? "Update Product" : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}