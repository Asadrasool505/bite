/**
 * Shipping cost calculation utility based on corporate policy guidelines.
 * All shipments originate from Sialkot manufacturing district via DHL/FedEx.
 *
 * POLICY CRITERIA (Mukesh's official framework):
 * - If Cart Subtotal >= $250 ➔ Shipping is $0.00 ("FREE Worldwide Shipping")
 * - If Cart Subtotal < $250 ➔ Shipping is a Flat Rate of $35.00 worldwide
 */

export interface ShippingCartItem {
  category?: string;
  name: string;
  quantity: number;
  price?: number;
}

export function getShippingRate(subtotal: number): number {
  return subtotal >= 250 ? 0.00 : 35.00;
}

export function calculateCartShipping(items: ShippingCartItem[], subtotal?: number) {
  let computedSubtotal = subtotal;
  if (computedSubtotal === undefined) {
    computedSubtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalShipping = computedSubtotal >= 250 ? 0.00 : 35.00;

  return {
    shippingSubtotal: totalShipping,
    discount: 0,
    totalShipping,
    totalQuantity
  };
}
