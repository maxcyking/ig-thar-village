"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  FileText,
  User
} from "lucide-react";

// Mock blog data
const mockBlogs = [
  {
    id: "1",
    title: "Traditional Desert Farming: Sustainable Practices in Thar",
    slug: "traditional-desert-farming-sustainable-practices",
    excerpt: "Discover how traditional farming methods in the Thar Desert promote sustainability and preserve ancient agricultural wisdom.",
    content: "Full blog content here...",
    status: "published",
    author: "Dr. Devaram Pawar",
    publishedAt: new Date("2024-01-15"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
    tags: ["farming", "sustainability", "tradition"],
    featuredImage: null,
    readTime: 8
  },
  {
    id: "2",
    title: "The Cultural Heritage of Rajasthani Desert Life",
    slug: "cultural-heritage-rajasthani-desert-life",
    excerpt: "Explore the rich cultural traditions, customs, and lifestyle of the people living in Rajasthan's desert regions.",
    content: "Full blog content here...",
    status: "draft",
    author: "Dhapu",
    publishedAt: null,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    tags: ["culture", "heritage", "rajasthan"],
    featuredImage: null,
    readTime: 6
  },
  {
    id: "3",
    title: "Organic Products from the Desert: Nature's Hidden Treasures",
    slug: "organic-products-desert-nature-treasures",
    excerpt: "Learn about the unique organic products that thrive in desert conditions and their incredible health benefits.",
    content: "Full blog content here...",
    status: "published",
    author: "Dr. Devaram Pawar",
    publishedAt: new Date("2024-01-08"),
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-08"),
    tags: ["organic", "products", "health"],
    featuredImage: null,
    readTime: 5
  }
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statuses = ["All", "Published", "Draft", "Scheduled"];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || 
                         blog.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.id !== blogId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content and articles
          </p>
        </div>
        <Button className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {blogs.filter(b => b.status === "published").length}
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {blogs.filter(b => b.status === "draft").length}
            </div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {blogs.reduce((acc, blog) => acc + (blog.readTime || 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Read Time (min)</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {blogs.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="rounded-lg"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="rounded-lg hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-primary line-clamp-1">
                      {blog.title}
                    </h3>
                    <Badge variant={getStatusColor(blog.status)} className="capitalize">
                      {blog.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {blog.publishedAt 
                          ? blog.publishedAt.toLocaleDateString()
                          : blog.createdAt.toLocaleDateString()
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="rounded-lg text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <Card className="rounded-lg">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No blog posts found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedStatus !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first blog post"
              }
            </p>
            {!searchTerm && selectedStatus === "All" && (
              <Button className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}