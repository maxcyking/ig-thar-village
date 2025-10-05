"use client";

import React, { useState, useEffect } from "react";
import { Product, getProducts } from "@/lib/database";
import { useCart } from "@/contexts/cart-context";
import {
    Star,
    Clock,
    Leaf,
    ArrowRight,
    Package,
    ShoppingCart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FeaturedProductsSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getProducts();
                // Get only featured products or first 6 products
                const featuredProducts = allProducts.filter(product => product.featured).slice(0, 6);
                if (featuredProducts.length < 6) {
                    // If not enough featured products, fill with regular products
                    const regularProducts = allProducts.filter(product => !product.featured).slice(0, 6 - featuredProducts.length);
                    setProducts([...featuredProducts, ...regularProducts]);
                } else {
                    setProducts(featuredProducts);
                }
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
            <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex-shrink-0 w-40 sm:w-48 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="w-full h-32 sm:h-36 bg-gray-200"></div>
                                <div className="p-3">
                                    <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
                                    <div className="h-8 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
                        <p className="text-gray-600">Products will be added soon. Check back later!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            100% Organic Products
                        </h2>
                        <p className="text-sm text-gray-600">Fresh from our desert farm</p>
                    </div>
                    <Link
                        href="/products"
                        className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
                    >
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                {/* Horizontal Scrollable Products */}
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {products.map((product) => {
                        // Calculate discount if there's an original price (meaning current price is discounted)
                        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                        const discount = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
                        const displayPrice = product.price;

                        const handleAddToCart = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Adding product to cart:', product);
                            addItem(product, 1);
                        };

                        return (
                            <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">

                                {/* Clickable Product Card - Navigate to Product Details */}
                                <Link href={`/products/${product.id}`} className="block">
                                    {/* Product Image */}
                                    <div className="relative cursor-pointer">
                                        <div className="w-full h-32 sm:h-36 bg-gray-100 flex items-center justify-center">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Discount Badge */}
                                        {hasDiscount && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                                {discount}% OFF
                                            </div>
                                        )}

                                        {/* Organic Badge */}
                                        {product.organic && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info - Also clickable */}
                                    <div className="p-3 cursor-pointer">
                                        {/* Weight */}
                                        <div className="text-xs text-gray-500 mb-1">{product.weight || product.unit}</div>

                                        {/* Product Name */}
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                            {product.name}
                                        </h3>

                                        {/* Rating - Using a default rating since it's not in the database */}
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                                        </div>

                                        {/* Delivery Time - Default since not in database */}
                                        <div className="flex items-center text-xs text-green-600 mb-3">
                                            <Clock className="h-3 w-3 mr-1" />
                                            2-3 days
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-sm font-bold text-gray-900">₹{displayPrice.toLocaleString()}</span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-gray-500 line-through ml-1">₹{product.originalPrice!.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Add to Cart Button - Separate from Link */}
                                <div className="px-3 pb-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className={`w-full text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center ${product.inStock
                                            ? 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                                            : 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart className="h-3 w-3 mr-1" />
                                        {product.inStock ? 'ADD' : 'OUT OF STOCK'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}