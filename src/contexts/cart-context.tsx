"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/lib/database';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { id: product.id, product, quantity }];
      }

      const total = newItems.reduce((sum, item) => {
        if (!item || !item.product || typeof item.product.price !== 'number') {
          console.warn('Invalid cart item:', item);
          return sum;
        }
        return sum + (item.product.price * item.quantity);
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.productId);
      const total = newItems.reduce((sum, item) => {
        if (!item || !item.product || typeof item.product.price !== 'number') {
          console.warn('Invalid cart item:', item);
          return sum;
        }
        return sum + (item.product.price * item.quantity);
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => {
        if (!item || !item.product || typeof item.product.price !== 'number') {
          console.warn('Invalid cart item:', item);
          return sum;
        }
        return sum + (item.product.price * item.quantity);
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cleanupInvalidItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Clean up invalid items before loading
        const validItems = (cartData.items || []).filter((item: any) =>
          item &&
          item.product &&
          item.product.id &&
          typeof item.product.price === 'number' &&
          item.quantity > 0
        );

        const total = validItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
        const itemCount = validItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

        dispatch({ type: 'LOAD_CART', payload: { items: validItems, total, itemCount } });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear invalid cart data
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product, quantity = 1) => {
    if (!product || !product.id || typeof product.price !== 'number') {
      console.error('Invalid product passed to addItem:', product);
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cleanupInvalidItems = () => {
    const validItems = state.items.filter(item =>
      item &&
      item.product &&
      item.product.id &&
      typeof item.product.price === 'number' &&
      item.quantity > 0
    );

    if (validItems.length !== state.items.length) {
      console.log('Cleaning up invalid cart items');
      const total = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);
      dispatch({ type: 'LOAD_CART', payload: { items: validItems, total, itemCount } });
    }
  };

  // Cleanup invalid items on mount
  useEffect(() => {
    if (state.items.length > 0) {
      cleanupInvalidItems();
    }
  }, []); // Only run once on mount

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, cleanupInvalidItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
