"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Product, getProducts, getAllProducts } from "@/lib/database";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  Leaf,
  Award,
  Package
} from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" },
    { value: "vegetables", label: "Vegetables" },
    { value: "spices", label: "Spices" },
    { value: "handicrafts", label: "Handicrafts" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [inStockProducts, allProductsData] = await Promise.all([
          getProducts(),
          getAllProducts()
        ]);
        setProducts(inStockProducts);
        setAllProducts(allProductsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayProducts = showOutOfStock ? allProducts : products;
  const outOfStockCount = allProducts.length - products.length;
  
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesOrganic = !showOnlyOrganic || product.organic;
    const matchesFeatured = !showOnlyFeatured || product.featured;
    
    return matchesSearch && matchesCategory && matchesOrganic && matchesFeatured;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Organic Desert Products
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Discover authentic, organic products from the heart of the Thar Desert. 
              Sustainably sourced and traditionally crafted.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Leaf className="h-4 w-4" />
                100% Organic
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                Locally Sourced
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Package className="h-4 w-4" />
                Fresh & Natural
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {!loading && allProducts.length > 0 && (
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{allProducts.length}</div>
                <div className="text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-gray-600">In Stock</div>
              </div>
              {outOfStockCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                  <div className="text-gray-600">Out of Stock</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {allProducts.filter(p => p.organic).length}
                </div>
                <div className="text-gray-600">Organic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {allProducts.filter(p => p.featured).length}
                </div>
                <div className="text-gray-600">Featured</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded-lg"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyOrganic}
                  onChange={(e) => setShowOnlyOrganic(e.target.checked)}
                  className="rounded"
                />
                Organic Only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyFeatured}
                  onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                  className="rounded"
                />
                Featured Only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                  className="rounded"
                />
                Show Out of Stock
                {outOfStockCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{outOfStockCount}
                  </Badge>
                )}
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {allProducts.length === 0 
                  ? "No products available"
                  : products.length === 0 && !showOutOfStock
                  ? "All products are currently out of stock"
                  : "No products found"
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {allProducts.length === 0 
                  ? "We're working on adding amazing organic products from the desert."
                  : products.length === 0 && !showOutOfStock
                  ? "Check back soon or enable 'Show Out of Stock' to see all products."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {products.length === 0 && outOfStockCount > 0 && !showOutOfStock && (
                <Button
                  variant="outline"
                  onClick={() => setShowOutOfStock(true)}
                  className="mt-2"
                >
                  Show {outOfStockCount} Out of Stock Products
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 rounded-lg">
                  <div className="relative h-48">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Package className="h-12 w-12 text-green-600" />
                      </div>
                    )}
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
                    <div className="absolute top-2 right-2">
                      <Badge 
                        className={`text-xs ${product.inStock ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs capitalize">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500">per {product.unit}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {product.weight && (
                      <p className="text-xs text-gray-500 mb-2">Weight: {product.weight}</p>
                    )}

                    <Button 
                      className="w-full rounded-lg bg-green-600 hover:bg-green-700"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}