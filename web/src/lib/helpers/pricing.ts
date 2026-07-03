/**
 * Pricing utilities for the frontend
 * NOTE: These calculations must match the backend at:
 * api/libs/orders/src/lib/order.service.ts
 */

import {
  INDIAN_STATES,
  REMOTE_STATES,
  PRICING_THRESHOLDS,
  type IndianState,
} from "@/lib/constants/pricing";

// Re-export constants for backward compatibility
export { INDIAN_STATES, REMOTE_STATES, type IndianState };

// Destructure pricing thresholds for internal use
const {
  BASE_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  REMOTE_STATE_CHARGE,
  GST_RATE,
} = PRICING_THRESHOLDS;

/**
 * Calculate shipping cost based on subtotal and delivery state
 * @param subtotal - Cart subtotal amount
 * @param state - Delivery state name
 * @returns Shipping cost in INR
 */
export function calculateShipping(subtotal: number, state: string): number {
  // Free shipping if subtotal >= ₹250, otherwise ₹50 flat fee
  const baseShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING;

  // Add state-based shipping (higher for remote areas)
  const isRemoteState = REMOTE_STATES.includes(
    state as (typeof REMOTE_STATES)[number]
  );
  const remoteCharge = isRemoteState ? REMOTE_STATE_CHARGE : 0;

  // Formula: (0 or 50) + remote charge (150 for remote states)
  return baseShipping + remoteCharge;
}

/**
 * Calculate tax (GST) on subtotal
 * @param subtotal - Cart subtotal amount
 * @returns Tax amount in INR
 */
export function calculateTax(subtotal: number): number {
  // 18% GST for India
  return Math.round(subtotal * GST_RATE);
}

/**
 * Calculate total order price
 * @param subtotal - Cart subtotal amount
 * @param state - Delivery state name
 * @returns Object with all pricing breakdown
 */
export function calculateOrderTotal(
  subtotal: number,
  state: string
): {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  freeShippingEligible: boolean;
  isRemoteState: boolean;
} {
  const shippingCost = calculateShipping(subtotal, state);
  const taxAmount = calculateTax(subtotal);
  const totalPrice = subtotal + shippingCost + taxAmount;

  return {
    subtotal,
    shippingCost,
    taxAmount,
    totalPrice,
    freeShippingEligible: subtotal >= FREE_SHIPPING_THRESHOLD,
    isRemoteState: REMOTE_STATES.includes(
      state as (typeof REMOTE_STATES)[number]
    ),
  };
}

/**
 * Get shipping message for UI
 * @param subtotal - Cart subtotal
 * @returns Message about shipping status
 */
export function getShippingMessage(subtotal: number): string {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return "🎉 You qualify for free shipping!";
  }
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;
  return `Add ₹${amountNeeded} more for free shipping`;
}
