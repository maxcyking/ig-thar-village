"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Filter, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllMediaItems, deleteMediaItem, updateMediaItem, type MediaItem } from "@/lib/database";
import { deleteImage } from "@/lib/storage";
import SimpleMediaForm from "@/components/admin/simple-media-form";

const mediaTypes = [
  { value: "all", label: "All Types" },
  { value: "gallery", label: "Gallery Images" },
  { value: "media", label: "Media Images" },
];

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredMediaItems, setFilteredMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      const items = await getAllMediaItems();
      setMediaItems(items);
      setFilteredMediaItems(items);
    } catch (error) {
      console.error("Error loading media items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediaItems();
  }, []);

  useEffect(() => {
    let filtered = mediaItems;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    setFilteredMediaItems(filtered);
  }, [mediaItems, selectedType]);

  const handleToggleVisibility = async (media: MediaItem) => {
    try {
      await updateMediaItem(media.id, { visible: !media.visible });
      await loadMediaItems();
    } catch (error) {
      console.error("Error updating media visibility:", error);
    }
  };

  const handleDeleteMedia = async (media: MediaItem) => {
    if (confirm(`Are you sure you want to delete this ${media.type} image?`)) {
      try {
        // Delete image from storage
        if (media.imageUrl) {
          await deleteImage(media.imageUrl);
        }
        // Delete from database
        await deleteMediaItem(media.id);
        await loadMediaItems();
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  };

  const handleMediaAdded = () => {
    setShowAddForm(false);
    loadMediaItems();
  };

  const handleMediaUpdated = () => {
    setEditingMedia(null);
    loadMediaItems();
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
          <h1 className="text-3xl font-bold text-foreground">Media Management</h1>
          <p className="text-muted-foreground">Upload and manage images for gallery and media pages</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <SimpleMediaForm onMediaAdded={handleMediaAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{mediaItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Gallery Images</p>
                <p className="text-2xl font-bold">{mediaItems.filter(item => item.type === 'gallery').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Media Images</p>
                <p className="text-2xl font-bold">{mediaItems.filter(item => item.type === 'media').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMediaItems.map((media) => (
          <Card key={media.id} className="overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              {media.imageUrl ? (
                <img
                  src={media.imageUrl}
                  alt={`${media.type} image`}
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
                    onClick={() => setEditingMedia(media)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleVisibility(media)}
                  >
                    {media.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMedia(media)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs capitalize">
                  {media.type}
                </Badge>
                <div className="flex gap-1">
                  {!media.visible && (
                    <Badge variant="outline" className="text-xs">Hidden</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMediaItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedType !== "all" 
              ? `No ${selectedType} images found. Upload some images to get started.`
              : "Start building your media library by uploading your first image."
            }
          </p>
          {selectedType === "all" && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload First Image
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          {editingMedia && (
            <SimpleMediaForm 
              media={editingMedia} 
              onMediaAdded={handleMediaUpdated} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
