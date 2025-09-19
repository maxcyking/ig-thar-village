"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Service, getServices, createService, updateService, deleteService } from "@/lib/database";
import { uploadMultipleImages } from "@/lib/storage";
import { ServiceForm } from "@/components/admin/service-form";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  Users,
  Star,
  MoreHorizontal,
  Mountain,
  Heart,
  Tent,
  TreePine,
  Camera
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

const categoryIcons: { [key: string]: any } = {
  'safari': Mountain,
  'cultural': Heart,
  'adventure': Tent,
  'spiritual': TreePine,
  'educational': Camera,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const allServices = await getServices();
      setServices(allServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (serviceData: any) => {
    setSaving(true);
    try {
      let imageUrls: string[] = [];
      
      if (serviceData.images && serviceData.images.length > 0) {
        imageUrls = await uploadMultipleImages(serviceData.images, 'services');
      }

      // Remove any File objects and create clean service data
      const { images: originalImages, ...cleanServiceData } = serviceData;

      const serviceToSave = {
        ...cleanServiceData,
        images: imageUrls
      };

      if (editingService) {
        await updateService(editingService.id, serviceToSave);
      } else {
        await createService(serviceToSave);
      }

      await fetchServices();
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        await fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service. Please try again.");
      }
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "safari", label: "Safari" },
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Adventure" },
    { value: "spiritual", label: "Spiritual" },
    { value: "educational", label: "Educational" }
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
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage your tour packages and experiences</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mountain className="h-6 w-6 text-blue-600" />
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
                  {services.filter(s => s.available).length}
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
                  {services.filter(s => s.featured).length}
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
                <p className="text-2xl font-bold text-purple-600">
                  ₹{Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mountain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all" 
                ? "No services match your search criteria." 
                : "Get started by adding your first service."}
            </p>
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const CategoryIcon = categoryIcons[service.category] || Mountain;
            
            return (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  {service.images && service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <CategoryIcon className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {service.featured && (
                      <Badge className="bg-orange-600 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={`text-xs ${service.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {service.available ? 'Available' : 'Unavailable'}
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
                          <DialogTitle>Service Actions</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Service
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Service
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-1">{service.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                        </Badge>
                        <div className="flex items-center text-gray-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      Up to {service.maxParticipants} people
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₹{service.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">per person</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {service.shortDescription}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditService(service)}
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
            );
          })}
        </div>
      )}

      {/* Service Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={editingService}
            onSave={handleSaveService}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}