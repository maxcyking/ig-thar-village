"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "firebase/auth";
import { onAuthStateChangedWithRole, UserProfile } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if this is the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChangedWithRole((user, profile, isAdmin) => {
      setUser(user);
      setProfile(profile);
      setIsAdmin(isAdmin);
      setLoading(false);
      
      if (!user) {
        router.push("/admin/login");
      } else if (!isAdmin) {
        setAccessDenied(true);
        // Redirect to login after showing error
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      } else {
        setAccessDenied(false);
      }
    });

    return () => unsubscribe();
  }, [router, isLoginPage]);

  // If this is the login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Access Denied</strong><br />
              You don't have admin privileges to access this area. 
              Redirecting to login page...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} profile={profile} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}