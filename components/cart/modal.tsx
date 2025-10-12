"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import type React from "react";

type CSSVarProperties = React.CSSProperties & { [key: `--${string}`]: string };

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart?.id) {
      createCartAndSetCookie();
    }
  }, [cart?.id]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  // Listen for cart updates and open the cart when items are added
  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
    };

    const handleCartUpdated = (event: Event) => {
      // Force a re-render when cart is updated
      setIsOpen(true);
      
      // Log the cart update for debugging
      console.log('Cart updated:', cart);
      
      // If we have cart data in the event, we could use it to update the UI
      if (event instanceof CustomEvent && event.detail) {
        console.log('Cart update details:', event.detail);
      }
    };

    window.addEventListener('open-cart', handleOpenCart);
    window.addEventListener('cart-updated', handleCartUpdated as EventListener);
    
    return () => {
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('cart-updated', handleCartUpdated as EventListener);
    };
  }, [cart]); // Add cart to dependencies to ensure we have the latest state

  // Log cart changes for debugging
  useEffect(() => {
    console.log('Cart state updated:', {
      totalItems: cart?.totalQuantity,
      items: cart?.lines?.map(item => ({
        id: item.merchandise.id,
        name: item.merchandise.product.title,
        quantity: item.quantity,
        price: item.cost.totalAmount.amount
      }))
    });
  }, [cart]);

  // Manage mount-time entrance animation for cart items
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
  }, [isOpen]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[12px]" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l-2 p-6 backdrop-blur-xl md:w-[clamp(260px,38vw,420px)] [will-change:transform] bg-[var(--cart-bg)] text-[var(--cart-dark)] font-medium"
              style={({ ['--cart-accent']: '#1D431D', ['--cart-dark']: '#1D431D', ['--cart-mid']: '#2E5A2E', ['--cart-bg']: '#C8D4AA', ['--cart-cta-bg']: '#6EAE3F', ['--cart-cta-bg-hover']: '#5A9B33', borderLeftColor: 'var(--cart-dark)' } as CSSVarProperties)}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-[var(--cart-dark,#1D431D)]">My Cart</p>
                <CloseCart onClick={closeCart} />
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16 text-[var(--cart-dark,#1D431D)]" />
                  <p className="mt-6 text-center text-2xl font-medium text-[var(--cart-dark,#1D431D)]">
                    Your cart is empty.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );
                        const itemColor = item.merchandise.product.metafields?.find((mf) => mf.key === 'case_color')?.value as string | undefined;

                        return (
                          <li
                            key={i}
                            className={clsx(
                              "flex w-full flex-col border-b transition-all duration-500 ease-out border-[color:var(--cart-dark,#1D431D)]/20",
                              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                            )}
                            style={{ transitionDelay: `${i * 40}ms` }}
                          >
                            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                              <div className="absolute z-40 -ml-1 -mt-2">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="flex flex-row">
                                <div
                                  className="relative h-20 w-20 overflow-hidden rounded-md border border-[#1D431D]"
                                  style={{ backgroundColor: itemColor || 'var(--cart-bg)' }}
                                >
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={80}
                                    height={80}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-2 flex flex-row space-x-4 transition-colors hover:text-[var(--cart-accent,#1D431D)] text-[var(--cart-dark,#1D431D)]"
                                >
                                  <div className="flex flex-1 flex-col text-base">
                                    <span className="leading-tight text-[var(--cart-dark,#1D431D)]">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-sm text-[var(--cart-dark,#1D431D)]/80">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-[color:var(--cart-dark,#1D431D)]/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-black/5">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-sm">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="py-4 text-sm text-[var(--cart-dark,#1D431D)]">
                    <div className="mb-3 flex items-center justify-between border-b border-[color:var(--cart-dark,#1D431D)]/20 pb-1">
                      <p className="text-[var(--cart-dark,#1D431D)]">Taxes</p>
                      <Price
                        className="text-right text-base text-[var(--cart-dark,#1D431D)]"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-[color:var(--cart-dark,#1D431D)]/20 pb-1 pt-1">
                      <p className="text-[var(--cart-dark,#1D431D)]">Shipping</p>
                      <p className="text-right text-[var(--cart-dark,#1D431D)]/80">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-[color:var(--cart-dark,#1D431D)]/20 pb-1 pt-1">
                      <p className="text-[var(--cart-dark,#1D431D)]">Total</p>
                      <Price
                        className="text-right text-base text-[var(--cart-dark,#1D431D)]"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={clsx("ml-auto -mt-1 text-[var(--cart-dark,#1D431D)] text-4xl font-bold leading-none", className)}
      aria-label="Close cart"
      onClick={onClick}
    >
      <span aria-hidden>×</span>
    </button>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full border border-[color:var(--cart-dark,#1D431D)] bg-[var(--cart-cta-bg,#C2E5A1)] hover:bg-[var(--cart-cta-bg-hover,#B4D889)] p-3 text-center text-sm font-medium text-[color:var(--cart-dark,#1D431D)] transition-colors"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-[#1D431D]" /> : "Proceed to Checkout"}
    </button>
  );
}
