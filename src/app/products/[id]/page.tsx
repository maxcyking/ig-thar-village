"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Star, 
  Leaf, 
  Package, 
  Truck, 
  Shield, 
  Heart,
  Share2,
  Minus,
  Plus,
  ArrowLeft,
  Award,
  Clock,
  MapPin,
  Zap
} from "lucide-react";
import { getProduct, type Product } from "@/lib/database";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { SocialShare } from "@/components/ui/social-share";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const productData = await getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      addItem(product, quantity);
      // Show success feedback (you can add a toast here)
      console.log(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setIsBuying(true);
    try {
      // Add to cart first
      addItem(product, quantity);
      // Redirect to checkout with buy now flag
      router.push(`/checkout?buyNow=true&productId=${product.id}&quantity=${quantity}`);
    } catch (error) {
      console.error("Error during buy now:", error);
    } finally {
      setIsBuying(false);
    }
  };

  const renderRichText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<s>$1</s>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      .replace(/^> (.+)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>')
      .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 list-decimal">$2</li>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/products')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Products
          </Button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 border">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1} of ${product.name}`}
                      title={`View image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                  {product.organic && (
                    <Badge className="bg-green-600 text-white">
                      <Leaf className="h-3 w-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="bg-orange-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.shortDescription}</p>
                
                {/* Rating placeholder */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (product.rating || 4) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount || 12} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <span className="text-gray-600">per {product.unit}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {product.weight && (
                  <p className="text-sm text-gray-600 mt-1">
                    Pack size: {product.weight}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${
                  product.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    product.inStock ? 'bg-green-600' : 'bg-red-600'
                  }`} />
                  <span className="font-medium">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {product.inStock && product.stock && (
                  <span className="text-sm text-gray-500">
                    {product.stock} units available
                  </span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                        disabled={quantity >= (product.stock || 99)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Primary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        size="lg"
                      >
                        {isAddingToCart ? (
                          "Adding..."
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleBuyNow}
                        disabled={isBuying}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {isBuying ? (
                          "Processing..."
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={handleWishlistToggle}
                        className={`flex-1 ${
                          isInWishlist(product.id) 
                            ? 'border-red-500 text-red-500 bg-red-50' 
                            : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <Heart 
                          className={`h-5 w-5 mr-2 ${
                            isInWishlist(product.id) ? 'fill-current' : ''
                          }`} 
                        />
                        {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                      </Button>
                      
                      <SocialShare
                        url={typeof window !== 'undefined' ? window.location.href : ''}
                        title={product.name}
                        description={product.shortDescription}
                        image={product.images?.[0] || ''}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Fresh Product</span>
                </div>
              </div>

              {/* Additional Info */}
              {(product.origin || product.shelfLife) && (
                <div className="border-t pt-4 space-y-2">
                  {product.origin && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Origin: </span>
                      <span className="font-medium">{product.origin}</span>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Shelf Life: </span>
                      <span className="font-medium">{product.shelfLife}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    {product.detailedDescription ? (
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: renderRichText(product.detailedDescription) 
                        }}
                      />
                    ) : (
                      <p className="text-gray-600">{product.description}</p>
                    )}
                    
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Benefits:</h4>
                        <ul className="space-y-2">
                          {product.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ingredients" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                    {product.ingredients && product.ingredients.length > 0 ? (
                      <div className="space-y-2">
                        {product.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Ingredient information not available.</p>
                    )}
                    
                    {product.certifications && product.certifications.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Certifications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="nutrition" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Nutritional Information</h3>
                    {product.nutritionalInfo ? (
                      <div className="whitespace-pre-line text-gray-600">
                        {product.nutritionalInfo}
                      </div>
                    ) : (
                      <p className="text-gray-600">Nutritional information not available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="storage" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Storage Instructions</h3>
                    {product.storageInstructions ? (
                      <p className="text-gray-600">{product.storageInstructions}</p>
                    ) : (
                      <p className="text-gray-600">Storage instructions not available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
