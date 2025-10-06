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
import { Badge } from "@/components/ui/badge";

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
    originalPrice: "",
    unit: "kg",
    stock: "1",
    description: "",
    shortDescription: "",
    weight: "",
    nutritionalInfo: "",
    ingredients: [] as string[],
    benefits: [] as string[],
    storageInstructions: "",
    shelfLife: "",
    natural: false,
    featured: false,
    inStock: true,
    images: [] as File[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        unit: product.unit || "kg",
        stock: product.inStock ? "1" : "0",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        weight: product.weight || "",
        nutritionalInfo: product.nutritionalInfo || "",
        ingredients: product.ingredients || [],
        benefits: product.benefits || [],
        storageInstructions: product.storageInstructions || "",
        shelfLife: product.shelfLife || "",
        natural: product.natural || false,
        featured: product.featured || false,
        inStock: product.inStock || false,
        images: []
      });
      
      // Set existing image previews
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      } else {
        setImagePreviews([]);
      }
    } else {
      // Reset form for new product
      setImagePreviews([]);
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      // Keep existing images if no new images are uploaded
      existingImages: product?.images || []
    };

    onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                className="rounded-lg"
              />
              <p className="text-xs text-gray-500">For showing discounts</p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Status</Label>
              <Select value={formData.stock} onValueChange={(value) => handleInputChange("stock", value)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">In Stock</SelectItem>
                  <SelectItem value="0">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Descriptions</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                placeholder="Brief product description for listings..."
                value={formData.shortDescription}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                rows={2}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed product description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
                rows={4}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          
          {/* Ingredients */}
          <div className="space-y-4 mb-6">
            <div>
              <Label>Ingredients</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add ingredient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  className="flex-1"
                />
                <Button type="button" onClick={addIngredient} variant="outline">
                  Add
                </Button>
              </div>
              {formData.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div>
              <Label>Health Benefits</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add health benefit"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  className="flex-1"
                />
                <Button type="button" onClick={addBenefit} variant="outline">
                  Add
                </Button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
              <Textarea
                id="nutritionalInfo"
                placeholder="Nutritional facts, calories, vitamins, etc..."
                value={formData.nutritionalInfo}
                onChange={(e) => handleInputChange("nutritionalInfo", e.target.value)}
                rows={3}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageInstructions">Storage Instructions</Label>
              <Textarea
                id="storageInstructions"
                placeholder="How to store the product..."
                value={formData.storageInstructions}
                onChange={(e) => handleInputChange("storageInstructions", e.target.value)}
                rows={3}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input
                id="shelfLife"
                placeholder="e.g., 6 months, 1 year"
                value={formData.shelfLife}
                onChange={(e) => handleInputChange("shelfLife", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Images Upload */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Images</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload Product Images</p>
              <p className="text-sm text-gray-500 mb-4">
                Select multiple images to showcase your product from different angles
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="images-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('images-upload')?.click()}
              >
                Choose Images
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG up to 5MB each • Maximum 10 images
              </p>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Selected Images ({imagePreviews.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={preview}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-blue-600 text-white text-xs">
                            Main Image
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  💡 The first image will be used as the main product image
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Settings</h3>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked: boolean) => {
                  handleInputChange("inStock", checked);
                  handleInputChange("stock", checked ? "1" : "0");
                }}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="natural"
                checked={formData.natural}
                onCheckedChange={(checked: boolean) => handleInputChange("natural", checked)}
              />
              <Label htmlFor="natural">Natural Product</Label>
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

      {/* Form Actions */}
      <div className="flex space-x-4 pt-6">
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg">
          {product ? "Update Product" : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}