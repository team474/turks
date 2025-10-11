"use client";

import {
  Cart,
  CartItem,
  Product,
  ProductVariant
} from 'lib/shopify/types';
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic
} from 'react';


type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

// (Removed unused helper that duplicated reducer logic)

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        metafields: product.metafields,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      
      // Find the item to update
      const itemToUpdate = currentCart.lines.find(item => item.merchandise.id === merchandiseId);
      
      if (!itemToUpdate) return currentCart;
      
      // Calculate new quantity based on update type
      let newQuantity = itemToUpdate.quantity;
      if (updateType === 'plus') {
        newQuantity++;
      } else if (updateType === 'minus') {
        newQuantity = Math.max(0, newQuantity - 1);
      } else if (updateType === 'delete') {
        newQuantity = 0;
      }
      
      // If quantity is 0, remove the item
      if (newQuantity <= 0) {
        const updatedLines = currentCart.lines.filter(item => item.merchandise.id !== merchandiseId);
        return {
          ...currentCart,
          lines: updatedLines,
          ...updateCartTotals(updatedLines)
        };
      }
      
      // Calculate new total amount for the item
      const singleItemAmount = Number(itemToUpdate.cost.totalAmount.amount) / itemToUpdate.quantity;
      const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount.toString());
      
      // Update the item
      const updatedItem: CartItem = {
        ...itemToUpdate,
        quantity: newQuantity,
        cost: {
          ...itemToUpdate.cost,
          totalAmount: {
            ...itemToUpdate.cost.totalAmount,
            amount: newTotalAmount
          }
        }
      };
      
      // Update the lines with the updated item
      const updatedLines = currentCart.lines.map(item => 
        item.merchandise.id === merchandiseId ? updatedItem : item
      );
      
      return {
        ...currentCart,
        lines: updatedLines,
        ...updateCartTotals(updatedLines)
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const initialCart = use(context.cartPromise) as Cart | undefined;
  const [optimisticCart, updateOptimisticCart] = useOptimistic<Cart, CartAction>(
    initialCart || createEmptyCart(),
    cartReducer
  );

  const updateCartItem = React.useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      updateOptimisticCart({
        type: 'UPDATE_ITEM',
        payload: { merchandiseId, updateType }
      });
    },
    [updateOptimisticCart]
  );

  const addCartItem = React.useCallback(
    (variant: ProductVariant, product: Product) => {
      updateOptimisticCart({ type: 'ADD_ITEM', payload: { variant, product } });
    },
    [updateOptimisticCart]
  );

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem
    }),
    [optimisticCart, updateCartItem, addCartItem]
  );
}
