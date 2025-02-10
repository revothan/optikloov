
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | null | undefined) => {
  const number = price ?? 0;
  const formattedNumber = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(Math.abs(number))
    .replace("IDR", "Rp")
    .trim();
  
  return number < 0 ? `-${formattedNumber}` : formattedNumber;
};
