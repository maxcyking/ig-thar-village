"use client";

import { useState, useEffect } from "react";
import { LaunchCeremony } from "./launch-ceremony";
import { getSettings, type SiteSettings } from "@/lib/database";

interface LaunchWrapperProps {
  children: React.ReactNode;
}

export function LaunchWrapper({ children }: LaunchWrapperProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLaunch, setShowLaunch] = useState(false);

  useEffect(() => {
    checkLaunchStatus();
  }, []);

  const checkLaunchStatus = async () => {
    try {
      const settingsData = await getSettings();
      setSettings(settingsData);
      
      // Show launch ceremony if:
      // 1. No settings exist (first time) OR
      // 2. Settings exist but isLaunched is false
      const shouldShowLaunch = !settingsData || !settingsData.isLaunched;
      setShowLaunch(shouldShowLaunch);
    } catch (error) {
      console.error("Error checking launch status:", error);
      // If there's an error, don't show launch ceremony
      setShowLaunch(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchComplete = () => {
    setShowLaunch(false);
    // Optionally refresh settings
    checkLaunchStatus();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a1 1 0 001 1h3v-7h6v7h3a1 1 0 001-1V7l-7-5z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">IG Thar Village</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show launch ceremony if needed
  if (showLaunch) {
    return <LaunchCeremony onLaunchComplete={handleLaunchComplete} />;
  }

  // Show normal website
  return <>{children}</>;
}
