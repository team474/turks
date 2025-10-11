"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: unknown,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    // Ensure a cart exists before adding
    let cart = await getCart();
    if (!cart) {
      await createCartAndSetCookie();
      cart = await getCart();
    }

    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: unknown, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    // Ensure a cart exists
    let cart = await getCart();
    if (!cart) {
      await createCartAndSetCookie();
      cart = await getCart();
      if (!cart) {
        return "Error fetching cart";
      }
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  if (cart?.checkoutUrl) {
    redirect(cart.checkoutUrl);
  }
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  if (cart?.id) {
    (await cookies()).set('cartId', cart.id);
  }
}
