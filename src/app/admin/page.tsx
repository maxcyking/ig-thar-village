"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  FileText, 
  Image, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Star
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "8",
    description: "Organic products listed",
    icon: Package,
    trend: "+2 this month"
  },
  {
    title: "Blog Posts",
    value: "12",
    description: "Published articles",
    icon: FileText,
    trend: "+3 this month"
  },
  {
    title: "Media Items",
    value: "45",
    description: "Photos and videos",
    icon: Image,
    trend: "+8 this week"
  },
  {
    title: "Bookings",
    value: "23",
    description: "This month",
    icon: Users,
    trend: "+15% from last month"
  },
  {
    title: "Messages",
    value: "7",
    description: "Unread inquiries",
    icon: MessageSquare,
    trend: "2 urgent"
  },
  {
    title: "Revenue",
    value: "₹1,25,000",
    description: "This month",
    icon: TrendingUp,
    trend: "+22% from last month"
  }
];

const recentBookings = [
  {
    id: 1,
    guest: "Rajesh Kumar",
    service: "Desert Explorer Package",
    date: "Dec 15-17, 2024",
    status: "confirmed",
    amount: "₹8,500"
  },
  {
    id: 2,
    guest: "Priya Sharma",
    service: "Farm Stay Experience",
    date: "Dec 20-22, 2024",
    status: "pending",
    amount: "₹5,000"
  },
  {
    id: 3,
    guest: "Amit Patel",
    service: "Cultural Heritage Package",
    date: "Dec 25-26, 2024",
    status: "confirmed",
    amount: "₹5,500"
  }
];

const recentMessages = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    subject: "Inquiry about Camel Safari",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@email.com",
    subject: "Organic Products Order",
    time: "5 hours ago",
    unread: true
  },
  {
    id: 3,
    name: "Lisa Wilson",
    email: "lisa@email.com",
    subject: "Group Booking Request",
    time: "1 day ago",
    unread: false
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at IG Thar Village.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Bookings</span>
            </CardTitle>
            <CardDescription>
              Latest service bookings and reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.guest}</p>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.amount}</p>
                    <Badge 
                      variant={booking.status === "confirmed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Messages</span>
            </CardTitle>
            <CardDescription>
              Latest customer inquiries and messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{message.name}</p>
                      {message.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="text-sm">{message.subject}</p>
                    <p className="text-xs text-muted-foreground">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Add Product</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Write Blog</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors">
              <Image className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Upload Media</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">View Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}