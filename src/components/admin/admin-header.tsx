"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "firebase/auth";
import { signOut, UserProfile } from "@/lib/auth";
import { LogOut, User as UserIcon, Shield, Mountain } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user: User;
  profile?: UserProfile | null;
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IG Thar Village</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {profile?.name || user.email?.split('@')[0] || 'Admin'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {profile?.role || 'admin'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}