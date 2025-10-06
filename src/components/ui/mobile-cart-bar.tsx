"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileCartBar() {
  const { state } = useCart();
  const pathname = usePathname();

  // Don't show if cart is empty
  if (state.itemCount === 0) {
    return null;
  }

  // Check if we're on a product detail page
  const isProductPage = pathname?.includes('/products/') && pathname.split('/').length === 3;

  return (
    <div className={`fixed left-0 right-0 text-white z-50 lg:hidden transition-all duration-300 ${
      isProductPage 
        ? 'bottom-32 mx-4 p-3 bg-green-600/95 backdrop-blur-sm rounded-xl shadow-2xl border border-green-400/50' // Floating above product bottom nav
        : 'bottom-0 p-4 bg-green-600 shadow-lg'     // Full width at bottom for other pages
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`bg-white/20 rounded-full ${isProductPage ? 'p-1.5' : 'p-2'}`}>
            <ShoppingCart className={`${isProductPage ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isProductPage ? 'text-base' : 'text-lg'}`}>
                {state.itemCount} item{state.itemCount !== 1 ? 's' : ''}
              </span>
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <span className={`font-bold ${isProductPage ? 'text-base' : 'text-lg'}`}>
                ₹{state.total.toLocaleString()}
              </span>
            </div>
            {!isProductPage && (
              <div className="text-xs text-white/80">
                {state.items.length} product{state.items.length !== 1 ? 's' : ''} in cart
              </div>
            )}
          </div>
        </div>
        
        <Button 
          asChild
          className={`bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg shadow-md transition-all duration-200 ${
            isProductPage ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'
          }`}
        >
          <Link href="/cart">
            Checkout
          </Link>
        </Button>
      </div>
      
      {/* Floating indicator for product pages */}
      {isProductPage && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      )}
    </div>
  );
}