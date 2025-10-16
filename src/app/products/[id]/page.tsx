"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product, getProductById } from "@/lib/database";
import { useCart } from "@/contexts/cart-context";
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
  Sparkles,
  Plus,
  Minus,
  Check,
  Info,
  MapPin,
  Phone,
  Mail,
  Zap,
  ThumbsUp,
  Users,
  Calendar
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
  const { state, addItem, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');

  // Get current cart quantity for this product
  const cartItem = product ? state.items.find(item => item.id === product.id) : null;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

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

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
    }
  };

  const handleQuantityChange = (change: number) => {
    if (product) {
      const newQuantity = Math.max(0, cartQuantity + change);
      updateQuantity(product.id, newQuantity);
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-orange-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Gallery - Left Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              {/* Main Image */}
              <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100 border shadow-lg">
                {product.images && product.images.length > 0 ? (
                  <>
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-300"
                      priority
                    />

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${isFavorite
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-white/90 hover:bg-white'
                          }`}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white text-white' : 'text-gray-600'}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        aria-label="Share product"
                      >
                        <Share2 className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.natural && (
                        <Badge className="bg-green-600 text-white shadow-lg">
                          <Leaf className="h-3 w-3 mr-1" />
                          Natural
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-orange-600 text-white shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details - Middle (Full width on mobile) */}
          <div className="lg:col-span-4 col-span-1">
            <div className="space-y-6">
              {/* Product Title & Basic Info */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.2 • 156 reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {product.category}
                  </Badge>
                  {product.weight && (
                    <Badge variant="outline">{product.weight}</Badge>
                  )}
                </div>

                {product.shortDescription && (
                  <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
                )}
              </div>

              {/* Key Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Farm Fresh</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>No Chemicals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>

              {/* Product Attributes */}
              {(product.nutritionalInfo || product.ingredients || product.benefits) && (
                <div className="space-y-4">
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.benefits && product.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Health Benefits</h4>
                      <ul className="space-y-1">
                        {product.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <ThumbsUp className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Quality guarantee & easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>Delivered within 5-7 business days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Panel - Right Side (Hidden on Mobile) */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">per {product.unit} • {product.weight}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-green-600 font-medium">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                        ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                      </div>
                    )}
                  </div>

                  {/* Add to Cart / Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    {cartQuantity === 0 ? (
                      <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center border border-green-300 rounded-lg w-fit bg-green-50">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={!product.inStock}
                            className="p-2 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4 text-green-600" />
                          </button>
                          <div className="w-16 px-3 py-2 text-center">
                            <span className="font-semibold text-green-700">{cartQuantity}</span>
                          </div>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={!product.inStock}
                            className="p-2 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4 text-green-600" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: ₹{(product.price * cartQuantity).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!product.inStock}
                    >
                      <Link href={`/contact?product=${product.id}&quantity=${cartQuantity || 1}&type=order`}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.inStock ? 'Order Now' : 'Out of Stock'}
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <Link href={`/contact?product=${product.id}&type=inquiry`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Contact for Bulk Orders
                      </Link>
                    </Button>
                  </div>

                  {/* Seller Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">IG Thar Village</div>
                        <div className="text-sm text-gray-600">Natural Farm</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>Barmer, Rajasthan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>525+ farmers trained</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3" />
                        <span>Certified natural producer</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'nutrition', label: 'Nutrition Info' },
                { id: 'reviews', label: 'Reviews (156)' },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our {product.name} is carefully cultivated in the fertile lands of Thar Desert region,
                  where traditional farming methods meet modern natural practices. Each product is
                  handpicked at the perfect time to ensure maximum freshness and nutritional value.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We follow sustainable farming practices that not only produce superior quality products
                  but also protect the environment for future generations. Our commitment to natural
                  farming means no harmful chemicals ever touch your food.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  From our farm to your table, we maintain the highest standards of quality and freshness.
                  Experience the authentic taste of traditional Rajasthani agriculture with every bite.
                </p>
              </div>
            )}

            {selectedTab === 'nutrition' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Nutritional Information</h3>
                  {product.nutritionalInfo ? (
                    <p className="text-gray-700">{product.nutritionalInfo}</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Energy</span>
                        <span>150 kcal</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Protein</span>
                        <span>8g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Carbohydrates</span>
                        <span>25g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Fat</span>
                        <span>2g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Fiber</span>
                        <span>5g</span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Storage Instructions</h3>
                  <p className="text-gray-700">
                    {product.storageInstructions || "Store in a cool, dry place away from direct sunlight. Once opened, consume within the recommended time frame for best quality."}
                  </p>
                  {product.shelfLife && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Shelf Life</h4>
                      <p className="text-gray-700">{product.shelfLife}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">4.2</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">156 reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : 3}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {rating === 5 ? 94 : rating === 4 ? 39 : rating === 3 ? 16 : rating === 2 ? 5 : 2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  {[
                    { name: "Rajesh Kumar", rating: 5, date: "2 days ago", comment: "Excellent quality! Fresh and natural as promised. Will definitely order again." },
                    { name: "Priya Sharma", rating: 4, date: "1 week ago", comment: "Good product, fast delivery. Packaging could be better but overall satisfied." },
                    { name: "Amit Singh", rating: 5, date: "2 weeks ago", comment: "Best natural products I've tried. Authentic taste and great quality." }
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{review.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Free Shipping</div>
                        <div className="text-sm text-gray-600">On orders above ₹500</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Delivery Time</div>
                        <div className="text-sm text-gray-600">5-7 business days</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Secure Packaging</div>
                        <div className="text-sm text-gray-600">Temperature controlled delivery</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Returns & Refunds</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">7-Day Return Policy</div>
                        <div className="text-sm text-gray-600">Easy returns for quality issues</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Quick Refunds</div>
                        <div className="text-sm text-gray-600">Processed within 3-5 business days</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Customer Support</div>
                        <div className="text-sm text-gray-600">Available 24/7 for assistance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar - Blinkit Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
        <div className="px-4 py-3">
          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-600">per {product.unit} • {product.weight}</div>
              {cartQuantity > 0 && (
                <div className="text-sm font-medium text-green-600 mt-1">
                  Total: ₹{(product.price * cartQuantity).toLocaleString()}
                </div>
              )}
            </div>

            {/* Add/Quantity Selector - Blinkit Style */}
            {cartQuantity === 0 ? (
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center border-2 border-green-500 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={!product.inStock}
                  className="p-2 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-green-600 font-bold" />
                </button>
                <div className="px-4 py-2 min-w-[50px] text-center">
                  <span className="text-lg font-bold text-green-700">{cartQuantity}</span>
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={!product.inStock}
                  className="p-2 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-green-600 font-bold" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-3">
            <Button
              asChild
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!product.inStock}
            >
              <Link href={`/contact?product=${product.id}&quantity=${cartQuantity || 1}&type=order`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock ? 'Order Now' : 'Out of Stock'}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            >
              <Link href={`/contact?product=${product.id}&type=inquiry`}>
                <Phone className="mr-2 h-4 w-4" />
                Bulk Order
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind mobile nav */}
      <div className="h-32 lg:hidden"></div>
    </div>
  );
}