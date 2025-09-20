"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettings } from "@/lib/database";
import { auth, db } from "@/lib/firebase";

export function FirebaseTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setResult("Testing Firebase connection...\n");

    try {
      // Test 1: Firebase initialization
      setResult(prev => prev + "✅ Firebase initialized\n");
      
      // Test 2: Auth domain
      setResult(prev => prev + `📍 Auth Domain: ${auth.app.options.authDomain}\n`);
      
      // Test 3: Project ID
      setResult(prev => prev + `🏗️ Project ID: ${auth.app.options.projectId}\n`);
      
      // Test 4: Current URL
      setResult(prev => prev + `🌐 Current URL: ${window.location.origin}\n`);
      
      // Test 5: Try to read settings
      const settings = await getSettings();
      setResult(prev => prev + `⚙️ Settings read: ${settings ? "Success" : "No settings found"}\n`);
      
      setResult(prev => prev + "✅ All tests passed! Firebase is working correctly.\n");
      
    } catch (error: any) {
      setResult(prev => prev + `❌ Error: ${error.message}\n`);
      setResult(prev => prev + `📝 Error Code: ${error.code || 'No code'}\n`);
      
      if (error.message.includes('Missing or insufficient permissions')) {
        setResult(prev => prev + "\n🔧 Solution: Add your domain to Firebase Auth authorized domains\n");
        setResult(prev => prev + "1. Go to Firebase Console → Authentication → Settings → Authorized domains\n");
        setResult(prev => prev + `2. Add: ${window.location.hostname}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔥 Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testFirebaseConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Firebase Connection"}
        </Button>
        
        {result && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
