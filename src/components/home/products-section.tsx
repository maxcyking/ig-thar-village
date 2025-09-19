"use client";

import { useState, useEffect } from "react";
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
        const featuredProducts = await getProducts(true);
        setProducts(featuredProducts);
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => {
                const CategoryIcon = categoryIcons[product.category] || Package;
                
                return (
                  <Card key={product.id} className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg bg-white hover:border-gray-200">
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <CategoryIcon className="h-16 w-16 text-orange-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Organic Badge */}
                      {product.organic && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-600 text-white font-accent rounded-md">
                            <Leaf className="h-3 w-3 mr-1" />
                            100% Organic
                          </Badge>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-orange-600 text-white font-accent rounded-md">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Price Overlay */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-2">
                          <div className="price-text text-gray-900">₹{product.price.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 font-body">per {product.unit}</div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="card-title text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-accent rounded-md border-gray-200">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </Badge>
                            {product.weight && (
                              <Badge variant="outline" className="text-xs font-accent rounded-md border-gray-200">
                                {product.weight}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="body-text text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-body ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        {product.organic && (
                          <div className="flex items-center text-green-600 text-xs">
                            <Leaf className="h-3 w-3 mr-1" />
                            <span className="font-body">Certified Organic</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md cta-button">
                          <Link href={`/products/${product.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          asChild 
                          variant="outline" 
                          className="px-4 rounded-md border-gray-200 hover:border-gray-300"
                          disabled={!product.inStock}
                        >
                          <Link href={`/contact?product=${product.id}`}>
                            <ShoppingCart className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* View All Products Button */}
            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl px-8">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}