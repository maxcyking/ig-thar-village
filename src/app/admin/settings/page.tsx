"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Save,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Rocket,
  Image as ImageIcon,
  FileImage,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { getSettings, createSettings, updateSettings, type SiteSettings } from "@/lib/database";
import { useSettings } from "@/contexts/settings-context";
import { uploadImage } from "@/lib/storage";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    siteName: "",
    tagline: "",
    logo: "",
    favicon: "",
    address: "",
    phone: "",
    email: "",
    isLaunched: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsData = await getSettings();
      if (settingsData) {
        setSettings(settingsData);
        setFormData({
          siteName: settingsData.siteName,
          tagline: settingsData.tagline,
          logo: settingsData.logo || "",
          favicon: settingsData.favicon || "",
          address: settingsData.address,
          phone: settingsData.phone,
          email: settingsData.email,
          isLaunched: settingsData.isLaunched,
        });
      } else {
        // Set default values
        setFormData({
          siteName: "IG Thar Village Global Herbs Pure Food & Agro Tourism Group",
          tagline: "Village Life, Global Wellness",
          logo: "",
          favicon: "",
          address: "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035",
          phone: "8302676869",
          email: "info@igtharvillage.com",
          isLaunched: false,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      setLogoUploading(true);
    } else {
      setFaviconUploading(true);
    }

    try {
      const imageUrl = await uploadImage(file, `settings/${type}`);
      handleInputChange(type, imageUrl);
      setMessage({ type: 'success', text: `${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully. Don't forget to save your settings!` });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setMessage({ type: 'error', text: `Failed to upload ${type}` });
    } finally {
      if (type === 'logo') {
        setLogoUploading(false);
      } else {
        setFaviconUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (settings) {
        // Update existing settings
        await updateSettings(settings.id, formData);
        setMessage({ type: 'success', text: 'Settings updated successfully! Logo and branding changes are now visible across the website.' });
      } else {
        // Create new settings
        await createSettings(formData);
        setMessage({ type: 'success', text: 'Settings created successfully! Logo and branding changes are now visible across the website.' });
      }
      
      // Refresh local settings
      await fetchSettings();
      
      // Refresh global settings context (navbar, footer, etc.)
      await refreshSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600">Manage your website configuration and launch status</p>
          </div>
        </div>
        
        {formData.isLaunched && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Rocket className="h-3 w-3 mr-1" />
            Website Launched
          </Badge>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Configure your website's basic details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Enter tagline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Branding Assets
            </CardTitle>
            <CardDescription>
              Upload your logo and favicon for website branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {formData.logo && (
                  <div className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={formData.logo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'logo');
                    }}
                    className="hidden"
                    id="logo-upload"
                    aria-label="Upload logo image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={logoUploading}
                    className="w-full"
                  >
                    {logoUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Favicon Upload */}
            <div className="space-y-4">
              <Label>Favicon</Label>
              <div className="flex items-center gap-4">
                {formData.favicon && (
                  <div className="relative w-8 h-8 border border-gray-200 rounded overflow-hidden">
                    <Image
                      src={formData.favicon}
                      alt="Favicon"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'favicon');
                    }}
                    className="hidden"
                    id="favicon-upload"
                    aria-label="Upload favicon image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('favicon-upload')?.click()}
                    disabled={faviconUploading}
                    className="w-full"
                  >
                    {faviconUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileImage className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Recommended: 32x32 pixels, ICO or PNG format
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Launch Status
          </CardTitle>
          <CardDescription>
            Current website launch status and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                formData.isLaunched ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <p className="font-medium">
                  {formData.isLaunched ? 'Website is Live' : 'Website Not Launched'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.isLaunched 
                    ? 'Your website is accessible to the public'
                    : 'Launch ceremony page will be shown to visitors'
                  }
                </p>
              </div>
            </div>
            
            {settings?.launchedAt && (
              <div className="text-right">
                <p className="text-sm font-medium">Launched on</p>
                <p className="text-xs text-gray-600">
                  {new Date(settings.launchedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>

          {!formData.isLaunched && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Launch Ceremony Ready</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Visitors will see a special launch ceremony page where an honourable guest 
                    can officially launch your website with a celebration animation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How to Use These Settings
          </CardTitle>
          <CardDescription>
            Important information about how these settings affect your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Logo & Branding</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Logo appears in the website header and footer (48x48px display)</li>
                <li>• Favicon shows in browser tabs and bookmarks</li>
                <li>• Recommended logo size: 200x200 pixels or larger (square format)</li>
                <li>• Favicon should be 32x32 pixels, ICO or PNG format</li>
                <li>• Changes appear immediately after saving settings</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Contact Information</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Address displays in footer and contact page</li>
                <li>• Phone number shows throughout the website</li>
                <li>• Email is used for contact forms and communications</li>
                <li>• Changes take effect immediately after saving</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Current Website Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>Company:</strong> IG Thar Village Global Herbs Pure Food & Agro Tourism Group<br />
                  <strong>Address:</strong> Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035<br />
                  <strong>Phone:</strong> 8302676869<br />
                  <strong>Business:</strong> Pure Food, Rural & Agro Tourism<br />
                  <strong>Tagline:</strong> "Village Life, Global Wellness"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="px-8"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
