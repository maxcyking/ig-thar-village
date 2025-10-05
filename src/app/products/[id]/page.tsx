"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, getProductById } from "@/lib/database";
import { 
  ArrowLeft,
  Star, 
  Leaf, 
  Package,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Award,
  Clock,
  Milk,
  Wheat,
  Carrot,
  Sparkles
} from "lucide-react";

const categoryIcons: { [key: string]: any } = {
  'dairy': Milk,
  'grains': Wheat,
  'vegetables': Carrot,
  'spices': Sparkles,
  'handicrafts': Package,
  'other': Package,
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        const productData = await getProductById(params.id as string);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[product.category] || Package;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <CategoryIcon className="h-24 w-24 text-orange-600" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Share product"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.organic && (
              <Badge className="bg-green-600 text-white font-accent rounded-md">
                <Leaf className="h-3 w-3 mr-1" />
                100% Organic
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-orange-600 text-white font-accent rounded-md">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-accent rounded-md">
              <CategoryIcon className="h-3 w-3 mr-1" />
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Info */}
            <div className="mb-8">
              <h1 className="section-title text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-body ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {product.weight && (
                  <Badge variant="outline" className="font-accent rounded-md border-gray-200">
                    {product.weight}
                  </Badge>
                )}
                {product.organic && (
                  <div className="flex items-center text-green-600 text-sm">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="font-body">Certified Organic</span>
                  </div>
                )}
              </div>

              {product.shortDescription && (
                <p className="body-text text-gray-700 text-lg leading-relaxed mb-6">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Product Features */}
            <Card className="mb-8 border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="card-title">Product Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">100% Natural</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Grown without any chemical pesticides or fertilizers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Quality Assured</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Rigorous quality checks ensure premium standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Fresh Delivery</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Direct from farm to your doorstep
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Harvest Fresh</h4>
                      <p className="text-sm text-gray-600 font-body">
                        Harvested at peak ripeness for maximum nutrition
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="card-title">About This Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="body-text text-gray-700 space-y-4">
                  <p>
                    Our {product.name} is carefully cultivated in the fertile lands of Thar Desert region, 
                    where traditional farming methods meet modern organic practices. Each product is 
                    handpicked at the perfect time to ensure maximum freshness and nutritional value.
                  </p>
                  <p>
                    We follow sustainable farming practices that not only produce superior quality products 
                    but also protect the environment for future generations. Our commitment to organic 
                    farming means no harmful chemicals ever touch your food.
                  </p>
                  <p>
                    From our farm to your table, we maintain the highest standards of quality and freshness. 
                    Experience the authentic taste of traditional Rajasthani agriculture with every bite.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Sidebar */}
          <div>
            <Card className="sticky top-8 border border-gray-100 shadow-sm rounded-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="price-text text-gray-900">₹{product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 font-body">per {product.unit}</div>
                  </div>
                  {!product.inStock && (
                    <Badge className="bg-red-100 text-red-800 font-accent rounded-md">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      disabled={!product.inStock}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-3 py-2 text-center border-0 focus:ring-0"
                      min="1"
                      disabled={!product.inStock}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      disabled={!product.inStock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 font-body">
                  Total: ₹{(product.price * quantity).toLocaleString()}
                </div>
                
                <div className="space-y-3">
                  <Button 
                    asChild 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-md cta-button"
                    disabled={!product.inStock}
                  >
                    <Link href={`/contact?product=${product.id}&quantity=${quantity}&type=order`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.inStock ? 'Order Now' : 'Out of Stock'}
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full rounded-md cta-button border-gray-200 hover:border-gray-300"
                  >
                    <Link href={`/contact?product=${product.id}&type=inquiry`}>
                      Contact for Bulk Orders
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600 font-body space-y-2">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Free delivery on orders above ₹500
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Quality guarantee
                    </div>
                    <div className="flex items-center">
                      <Leaf className="h-4 w-4 mr-2" />
                      100% organic certified
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}