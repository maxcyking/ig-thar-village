"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft,
  Package,
  Star,
  Leaf
} from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";

export default function WishlistPage() {
  const router = useRouter();
  const { state: wishlistState, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleRemoveItem = async (productId: string) => {
    setRemoving(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemoving(null);
    }, 200);
  };

  const handleAddToCart = async (productId: string) => {
    const item = wishlistState.items.find(item => item.id === productId);
    if (item) {
      setAddingToCart(productId);
      try {
        addToCart(item, 1);
        // Optional: Remove from wishlist after adding to cart
        // removeItem(productId);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setTimeout(() => setAddingToCart(null), 500);
      }
    }
  };

  const addAllToCart = () => {
    wishlistState.items.forEach(item => {
      addToCart(item, 1);
    });
  };

  if (wishlistState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-6">
              Save items you love to your wishlist so you can easily find them later.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <Badge variant="secondary">
              {wishlistState.itemCount} item{wishlistState.itemCount !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addAllToCart}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add All to Cart
            </Button>
            <Button
              onClick={clearWishlist}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistState.items.map((product) => (
            <Card 
              key={product.id} 
              className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
                removing === product.id ? 'opacity-50 scale-95' : ''
              }`}
            >
              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 cursor-pointer">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Package className="h-12 w-12 text-green-600" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {product.organic && (
                      <Badge className="bg-green-600 text-white text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    {product.featured && (
                      <Badge className="bg-orange-600 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={`text-xs ${product.inStock ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-red-500 text-white text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  )}

                  {/* Remove from Wishlist */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveItem(product.id);
                    }}
                    className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Link>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/products/${product.id}`}>
                      <CardTitle className="text-lg text-gray-900 hover:text-green-600 transition-colors cursor-pointer line-clamp-2">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-right ml-2">
                    <div className="flex items-center gap-1">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      <div className="text-xl font-bold text-green-600">₹{product.price}</div>
                    </div>
                    <div className="text-xs text-gray-500">per {product.unit}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  {product.weight && (
                    <span>Size: {product.weight}</span>
                  )}
                  {product.stock && product.inStock && (
                    <span>{product.stock} available</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 rounded-lg bg-green-600 hover:bg-green-700"
                    disabled={!product.inStock || addingToCart === product.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {addingToCart === product.id ? 'Adding...' : 
                     product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveItem(product.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Button variant="outline" asChild size="lg">
            <Link href="/products">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
