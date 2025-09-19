"use client";

import { useState, useEffect } from "react";
import { Plus, Award as AwardIcon, Search, Filter, Eye, EyeOff, Edit, Trash2, Trophy, Medal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllAwards, deleteAward, updateAward, type Award } from "@/lib/database";
import { deleteImage } from "@/lib/storage";
import AwardForm from "@/components/admin/award-form";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "sustainability", label: "Sustainability" },
  { value: "tourism", label: "Tourism" },
  { value: "hospitality", label: "Hospitality" },
  { value: "culture", label: "Culture" },
  { value: "community", label: "Community" },
  { value: "agriculture", label: "Agriculture" },
  { value: "innovation", label: "Innovation" },
  { value: "other", label: "Other" },
];

const categoryIcons = {
  sustainability: Star,
  tourism: Trophy,
  hospitality: Medal,
  culture: AwardIcon,
  community: AwardIcon,
  agriculture: Star,
  innovation: Trophy,
  other: Medal
};

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [filteredAwards, setFilteredAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const loadAwards = async () => {
    try {
      setLoading(true);
      const allAwards = await getAllAwards();
      setAwards(allAwards);
      setFilteredAwards(allAwards);
    } catch (error) {
      console.error("Error loading awards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  useEffect(() => {
    let filtered = awards;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (award) =>
          award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          award.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          award.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((award) => award.category === selectedCategory);
    }

    setFilteredAwards(filtered);
  }, [awards, searchTerm, selectedCategory]);

  const handleToggleVisibility = async (award: Award) => {
    try {
      await updateAward(award.id, { visible: !award.visible });
      await loadAwards();
    } catch (error) {
      console.error("Error updating award visibility:", error);
    }
  };

  const handleToggleFeatured = async (award: Award) => {
    try {
      await updateAward(award.id, { featured: !award.featured });
      await loadAwards();
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  const handleDeleteAward = async (award: Award) => {
    if (confirm(`Are you sure you want to delete "${award.title}"?`)) {
      try {
        // Delete images from storage
        if (award.imageUrl) {
          await deleteImage(award.imageUrl);
        }
        if (award.certificateUrl) {
          await deleteImage(award.certificateUrl);
        }
        // Delete from database
        await deleteAward(award.id);
        await loadAwards();
      } catch (error) {
        console.error("Error deleting award:", error);
      }
    }
  };

  const handleAwardAdded = () => {
    setShowAddForm(false);
    loadAwards();
  };

  const handleAwardUpdated = () => {
    setEditingAward(null);
    loadAwards();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading awards...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Awards Management</h1>
          <p className="text-muted-foreground">Manage your awards, certificates, and recognitions</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Award
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Award</DialogTitle>
            </DialogHeader>
            <AwardForm onAwardAdded={handleAwardAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Awards</p>
                <p className="text-2xl font-bold">{awards.length}</p>
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
                <p className="text-2xl font-bold">{awards.filter(award => award.visible).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{awards.filter(award => award.featured).length}</p>
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
                <p className="text-2xl font-bold">{new Set(awards.map(award => award.category)).size}</p>
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
                  placeholder="Search awards..."
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

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.map((award) => {
          const IconComponent = categoryIcons[award.category as keyof typeof categoryIcons] || Medal;
          return (
            <Card key={award.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50">
                {award.imageUrl ? (
                  <img
                    src={award.imageUrl}
                    alt={award.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-yellow-600" />
                  </div>
                )}
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingAward(award)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleVisibility(award)}
                    >
                      {award.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAward(award)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg line-clamp-2">{award.title}</h3>
                    <div className="flex gap-1 ml-2">
                      {award.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                      {!award.visible && (
                        <Badge variant="outline" className="text-xs">Hidden</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{award.organization}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{award.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {award.category.replace("-", " ")}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {award.year}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(award)}
                      className="text-xs h-6 px-2"
                    >
                      {award.featured ? "Unfeature" : "Feature"}
                    </Button>
                  </div>
                  
                  {award.certificateUrl && (
                    <div className="pt-2">
                      <Badge variant="outline" className="text-xs">
                        <Medal className="h-3 w-3 mr-1" />
                        Certificate Available
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAwards.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No awards found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "No awards match your current filters."
              : "Start showcasing your achievements by adding your first award."
            }
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Award
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingAward} onOpenChange={() => setEditingAward(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Award</DialogTitle>
          </DialogHeader>
          {editingAward && (
            <AwardForm 
              award={editingAward} 
              onAwardAdded={handleAwardUpdated} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
