"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Image, 
  Users, 
  MessageSquare,
  Settings,
  BarChart3,
  Home,
  MapPin,
  Award
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    href: "/admin/properties",
    icon: Home,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: MapPin,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    name: "Awards",
    href: "/admin/awards",
    icon: Award,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Users,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-border h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}