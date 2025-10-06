"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Search, 
  Eye, 
  Trash2, 
  MessageSquare,
  Filter,
  Archive,
  Reply,
  CheckCircle,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { getAllContactForms, updateContactForm, deleteContactForm, type ContactForm } from "@/lib/database";
import { format } from "date-fns";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const contactData = await getAllContactForms();
      setContacts(contactData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: ContactForm['status']) => {
    try {
      await updateContactForm(contactId, { status: newStatus });
      await fetchContacts();
    } catch (error) {
      console.error("Error updating contact status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const handleDelete = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact form?")) {
      try {
        await deleteContactForm(contactId);
        await fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Error deleting contact. Please try again.");
      }
    }
  };

  const handleViewDetails = (contact: ContactForm) => {
    setSelectedContact(contact);
    setShowDetails(true);
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      handleStatusChange(contact.id, 'read');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContactForm['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ContactForm['status']) => {
    switch (status) {
      case 'new': return <Clock className="h-3 w-3" />;
      case 'read': return <Eye className="h-3 w-3" />;
      case 'replied': return <Reply className="h-3 w-3" />;
      case 'archived': return <Archive className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
    { value: "archived", label: "Archived" }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-24"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Contact Forms</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries and messages</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {contacts.filter(c => c.status === 'new').length} New
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {contacts.length} Total
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contacts.filter(c => c.status === 'read').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter(c => c.status === 'replied').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Forms List */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contact Forms Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" 
                ? "No contact forms match your search criteria." 
                : "No contact forms have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{contact.name}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        <span className="ml-1 capitalize">{contact.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(contact.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(contact)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact Actions</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleStatusChange(contact.id, 'read')}
                            disabled={contact.status === 'read'}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleStatusChange(contact.id, 'replied')}
                            disabled={contact.status === 'replied'}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Mark as Replied
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleStatusChange(contact.id, 'archived')}
                            disabled={contact.status === 'archived'}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={`${getStatusColor(selectedContact.status)} mt-1`}>
                    {getStatusIcon(selectedContact.status)}
                    <span className="ml-1 capitalize">{selectedContact.status}</span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted</label>
                  <p className="text-gray-900">
                    {format(selectedContact.createdAt, "MMMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleStatusChange(selectedContact.id, 'replied')}
                  disabled={selectedContact.status === 'replied'}
                  className="flex-1"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Mark as Replied
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusChange(selectedContact.id, 'archived')}
                  disabled={selectedContact.status === 'archived'}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}