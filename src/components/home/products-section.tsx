"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, getProducts } from "@/lib/database";
import { 
  ShoppingCart, 
  Star, 
  Leaf, 
  Package,
  ArrowRight,
  Milk,
  Wheat,
  Carrot,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryIcons: { [key: string]: any } = {
  'dairy': Milk,
  'grains': Wheat,
  'vegetables': Carrot,
  'spices': Sparkles,
  'handicrafts': Package,
  'other': Package,
};

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get more products for horizontal scroll (not just featured)
        const allProducts = await getProducts();
        setProducts(allProducts.slice(0, 8)); // Show up to 8 products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          {/* Horizontal scroll loading skeleton */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 w-max">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex-none w-80 animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 font-accent rounded-md">
            Our Products
          </Badge>
          <h2 className="section-title text-gray-900 mb-6">
            Fresh Organic Products
          </h2>
          <p className="body-text text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our range of 100% organic products, grown with love in the heart of Thar Desert. 
            From fresh dairy to traditional grains, taste the purity of nature.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-6">Products will be added soon. Check back later!</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us for Orders</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Enhanced Horizontal Scrollable Products */}
            <div className="relative">
              {/* Scroll Hint */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 px-4 py-2 rounded-full">
                    🌟 Scroll to explore more products
                  </Badge>
                </div>
                <div className="hidden md:flex items-center text-sm text-gray-600">
                  <span className="mr-2">Swipe →</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="overflow-x-auto scrollbar-hide pb-4">
                <div className="flex gap-6 w-max">
                  {products.map((product) => {
                    const CategoryIcon = categoryIcons[product.category] || Package;
                    
                    return (
                      <Card key={product.id} className="flex-none w-80 group overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white hover:border-orange-300 hover:-translate-y-2">
                        <div className="relative overflow-hidden">
                          <div className="aspect-[4/3] relative">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                                <CategoryIcon className="h-20 w-20 text-orange-600" />
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced Badges */}
                          {product.organic && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                                <Leaf className="h-3 w-3 mr-1" />
                                100% Organic
                              </Badge>
                            </div>
                          )}
                          
                          {product.featured && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          )}

                          {/* Enhanced Price Overlay */}
                          <div className="absolute bottom-4 right-4">
                            <div className="bg-white/95 backdrop-blur-lg rounded-xl px-4 py-2 shadow-xl border border-white/50">
                              <div className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
                              <div className="text-xs text-gray-500 font-medium">per {product.unit}</div>
                            </div>
                          </div>

                          {/* Category Icon Overlay */}
                          <div className="absolute bottom-4 left-4">
                            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                              <CategoryIcon className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                                {product.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs font-medium rounded-full border-orange-200 text-orange-700">
                                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                </Badge>
                                {product.weight && (
                                  <Badge variant="outline" className="text-xs font-medium rounded-full border-gray-300">
                                    {product.weight}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                            {product.shortDescription}
                          </p>

                          {/* Enhanced Stock Status */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                              <span className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            {product.organic && (
                              <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                                <Leaf className="h-3 w-3 mr-1" />
                                <span className="font-medium">Certified</span>
                              </div>
                            )}
                          </div>

                          {/* Enhanced Action Buttons */}
                          <div className="flex gap-3">
                            <Button asChild className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                              <Link href={`/products/${product.id}`}>
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              asChild 
                              variant="outline" 
                              className="px-4 rounded-xl border-2 border-orange-300 hover:border-orange-500 hover:bg-orange-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                              disabled={!product.inStock}
                            >
                              <Link href={`/contact?product=${product.id}`}>
                                <ShoppingCart className="h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {/* View All Products Card at the end */}
                  <Card className="flex-none w-80 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 border-2 border-orange-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <Package className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Explore All Products</h3>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        Discover our complete range of 100% organic desert products and traditional items.
                      </p>
                      <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl px-6 py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <Link href="/products">
                          View All Products
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Scroll horizontally to see more products</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' } as React.CSSProperties}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' } as React.CSSProperties}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}