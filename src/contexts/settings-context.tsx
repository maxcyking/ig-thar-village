"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSettings, type SiteSettings } from "@/lib/database";

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const settingsData = await getSettings();
      if (settingsData) {
        setSettings(settingsData);
      } else {
        // Set default settings if none exist
        setSettings({
          id: '',
          siteName: "IG Thar Village Global Herbs Pure Food & Agro Tourism Group",
          tagline: "Village Life, Global Wellness",
          logo: "",
          favicon: "",
          address: "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035",
          phone: "8302676869",
          email: "info@igtharvillage.com",
          isLaunched: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Set default settings on error
      setSettings({
        id: '',
        siteName: "IG Thar Village Global Herbs Pure Food & Agro Tourism Group",
        tagline: "Village Life, Global Wellness",
        logo: "",
        favicon: "",
        address: "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035",
        phone: "8302676869",
        email: "info@igtharvillage.com",
        isLaunched: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    setLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
