"use client";

import { useApp } from "@/context/AppContext";

interface FormattedPriceProps {
  price: number;
  isVariable?: boolean;
  className?: string;
}

export default function FormattedPrice({ price, isVariable = false, className = "" }: FormattedPriceProps) {
  const { formatPrice } = useApp();

  return (
    <span className={className}>
      {isVariable ? `Starting from ${formatPrice(price)}` : formatPrice(price)}
    </span>
  );
}
