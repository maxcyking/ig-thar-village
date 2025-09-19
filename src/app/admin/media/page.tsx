"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Search, Filter, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllGalleryImages, deleteGalleryImage, updateGalleryImage, type GalleryImage } from "@/lib/database";
import { deleteImage } from "@/lib/storage";
import GalleryForm from "@/components/admin/gallery-form";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "accommodation", label: "Accommodation" },
  { value: "activities", label: "Activities" },
  { value: "food", label: "Food" },
  { value: "culture", label: "Culture" },
  { value: "agriculture", label: "Agriculture" },
  { value: "heritage", label: "Heritage" },
  { value: "nature", label: "Nature" },
  { value: "spirituality", label: "Spirituality" },
];

export default function AdminMediaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await getAllGalleryImages();
      setImages(galleryImages);
      setFilteredImages(galleryImages);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    let filtered = images;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (image) =>
          image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((image) => image.category === selectedCategory);
    }

    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory]);

  const handleToggleVisibility = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id, { visible: !image.visible });
      await loadImages();
    } catch (error) {
      console.error("Error updating image visibility:", error);
    }
  };

  const handleToggleFeatured = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id, { featured: !image.featured });
      await loadImages();
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (confirm(`Are you sure you want to delete "${image.title}"?`)) {
      try {
        // Delete image from storage
        if (image.imageUrl) {
          await deleteImage(image.imageUrl);
        }
        // Delete from database
        await deleteGalleryImage(image.id);
        await loadImages();
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const handleImageAdded = () => {
    setShowAddForm(false);
    loadImages();
  };

  const handleImageUpdated = () => {
    setEditingImage(null);
    loadImages();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading gallery images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Gallery</h1>
          <p className="text-muted-foreground">Manage your gallery images and media content</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <GalleryForm onImageAdded={handleImageAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Visible</p>
                <p className="text-2xl font-bold">{images.filter(img => img.visible).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{images.filter(img => img.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{new Set(images.map(img => img.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
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
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              {image.imageUrl ? (
                <img
                  src={image.imageUrl}
                  alt={image.altText || image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingImage(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleVisibility(image)}
                  >
                    {image.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(image)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm line-clamp-1">{image.title}</h3>
                  <div className="flex gap-1">
                    {image.featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    {!image.visible && (
                      <Badge variant="outline" className="text-xs">Hidden</Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{image.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs capitalize">
                    {image.category.replace("-", " ")}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFeatured(image)}
                    className="text-xs h-6 px-2"
                  >
                    {image.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "No images match your current filters."
              : "Start building your gallery by adding your first image."
            }
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Image
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          {editingImage && (
            <GalleryForm 
              image={editingImage} 
              onImageAdded={handleImageUpdated} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
