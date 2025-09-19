"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Property, getProperties, createProperty, updateProperty, deleteProperty } from "@/lib/database";
import { uploadMultipleImages } from "@/lib/storage";
import { PropertyForm } from "@/components/admin/property-form";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Users,
  Star,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const allProperties = await getProperties();
      setProperties(allProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async (propertyData: any) => {
    setSaving(true);
    try {
      let imageUrls: string[] = [];
      
      if (propertyData.images && propertyData.images.length > 0) {
        imageUrls = await uploadMultipleImages(propertyData.images, 'properties');
      }

      // Remove any File objects and create clean property data
      const { images: originalImages, ...cleanPropertyData } = propertyData;

      const propertyToSave = {
        ...cleanPropertyData,
        images: imageUrls
      };

      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyToSave);
      } else {
        await createProperty(propertyToSave);
      }

      await fetchProperties();
      setShowForm(false);
      setEditingProperty(null);
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        await fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error deleting property. Please try again.");
      }
    }
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || property.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "farm-stay", label: "Farm Stay" },
    { value: "desert-camp", label: "Desert Camp" },
    { value: "heritage-room", label: "Heritage Room" },
    { value: "luxury-tent", label: "Luxury Tent" }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">Manage your accommodation properties and bookings</p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.available).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-orange-600">
                  {properties.filter(p => p.featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{Math.round(properties.reduce((sum, p) => sum + p.pricePerNight, 0) / properties.length || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all" 
                ? "No properties match your search criteria." 
                : "Get started by adding your first property."}
            </p>
            <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-green-600" />
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {property.featured && (
                    <Badge className="bg-orange-600 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge className={`text-xs ${property.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {property.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-2 right-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Property Actions</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Property
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Property
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-1">{property.name}</CardTitle>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {property.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    Up to {property.maxGuests} guests
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹{property.pricePerNight.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">per night</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {property.shortDescription}
                </p>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Property Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Edit Property" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            onSave={handleSaveProperty}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}