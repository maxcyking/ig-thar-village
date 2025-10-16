"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mountain,
  Leaf,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [resetEmail, setResetEmail] = useState("");
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await signIn(loginData.email, loginData.password);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => router.push("/profile"), 1000);
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "Login failed. Please check your credentials." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setIsSubmitting(false);
      return;
    }

    if (signupData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp(signupData.email, signupData.password, signupData.fullName);
      setMessage({ type: "success", text: "Account created successfully! Redirecting..." });
      setTimeout(() => router.push("/profile"), 1000);
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "Signup failed. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setMessage({ type: "", text: "" });

    try {
      await signInWithGoogle();
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => router.push("/profile"), 1000);
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "Google sign in failed. Please try again." 
      });
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await resetPassword(resetEmail);
      setMessage({ 
        type: "success", 
        text: "Password reset email sent! Check your inbox." 
      });
      setResetEmail("");
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to send reset email." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-600 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-600 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600 rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-8 w-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900">IG Thar Village</h1>
          </div>
          <p className="text-gray-600">Welcome to authentic desert experiences</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-gray-600">
                {activeTab === "login" 
                  ? "Sign in to your account to continue" 
                  : "Join us for authentic desert experiences"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Message Display */}
                {message.text && (
                  <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTab("reset")}
                        className="text-sm text-amber-600 hover:text-amber-700"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <Button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSigningIn}
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                    >
                      {isGoogleSigningIn ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <Button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSigningIn}
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                    >
                      {isGoogleSigningIn ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Password Reset Tab */}
                <TabsContent value="reset">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                      <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
                    </div>

                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Email"}
                      </Button>

                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("login")}
                      >
                        Back to Login
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Features */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-center text-sm text-gray-600 mb-4">Join thousands of travelers who trust us</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                      <Mountain className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-xs text-gray-600">Authentic Experiences</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">100% Organic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-2">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-xs text-gray-600">Warm Hospitality</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}