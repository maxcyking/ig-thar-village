"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Star, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Award,
  Clock,
  User,
  MessageSquare,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { 
  getAllTestimonials, 
  updateTestimonial, 
  deleteTestimonial, 
  getTestimonialStats,
  type Testimonial 
} from '@/lib/testimonials';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      const [testimonialsData, statsData] = await Promise.all([
        getAllTestimonials(),
        getTestimonialStats()
      ]);
      setTestimonials(testimonialsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateTestimonial(id, { 
        status,
        approvedBy: 'admin' // In a real app, use actual admin user ID
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await updateTestimonial(id, { featured });
      await fetchData();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    try {
      await updateTestimonial(id, { visible });
      await fetchData();
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const handleUpdateNotes = async (id: string) => {
    try {
      await updateTestimonial(id, { adminNotes: editingNotes });
      setSelectedTestimonial(null);
      setEditingNotes('');
      await fetchData();
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      try {
        await deleteTestimonial(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-1">Manage guest reviews and testimonials</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No testimonials have been submitted yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.userName}</h3>
                      <p className="text-sm text-gray-600">{testimonial.userEmail}</p>
                      {testimonial.userLocation && (
                        <p className="text-sm text-gray-500">{testimonial.userLocation}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(testimonial.status)}>
                      {testimonial.status}
                    </Badge>
                    {testimonial.featured && (
                      <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i + testimonial.rating} className="h-4 w-4 text-gray-300" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {testimonial.rating}/5 stars
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{testimonial.title}</h4>
                  <p className="text-gray-700 mb-2">{testimonial.message}</p>
                  
                  {testimonial.experience && (
                    <Badge variant="outline" className="text-xs">
                      {testimonial.experience}
                    </Badge>
                  )}
                </div>

                {testimonial.adminNotes && (
                  <Alert className="mb-4">
                    <AlertDescription>
                      <strong>Admin Notes:</strong> {testimonial.adminNotes}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Submitted: {testimonial.createdAt.toLocaleDateString()}
                    {testimonial.approvedAt && (
                      <span className="ml-4">
                        Approved: {testimonial.approvedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(testimonial.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(testimonial.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {testimonial.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(testimonial.id, !testimonial.featured)}
                      >
                        <Award className="h-4 w-4 mr-1" />
                        {testimonial.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVisible(testimonial.id, !testimonial.visible)}
                    >
                      {testimonial.visible ? (
                        <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-1" /> Show</>
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setEditingNotes(testimonial.adminNotes || '');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Admin Notes</DialogTitle>
                          <DialogDescription>
                            Add internal notes for this testimonial
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Add admin notes..."
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            rows={4}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedTestimonial(null);
                                setEditingNotes('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => selectedTestimonial && handleUpdateNotes(selectedTestimonial.id)}
                            >
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}