import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export type CurrencyType = "base" | "BDT" | "USD";

// Currency symbols mapping
export const currencySymbols: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  INR: "₹",
  SGD: "S$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  MYR: "RM",
  THB: "฿",
  JPY: "¥",
  CNY: "¥",
  AUD: "A$",
  CAD: "C$",
};

interface ReportCurrencySelectorProps {
  value: CurrencyType;
  onChange: (value: CurrencyType) => void;
  baseCurrencyCode?: string; // e.g., "INR", "SGD", "BDT"
  className?: string;
  // When true, only show BDT and USD options (for multi-branch selection)
  restrictToCommonCurrencies?: boolean;
}

// Helper function to get currency label suffix for column headers
export const getCurrencyLabel = (currency: CurrencyType, baseCurrencyCode?: string): string => {
  switch (currency) {
    case "BDT":
      return "(in ৳)";
    case "USD":
      return "(in $)";
    case "base":
      if (baseCurrencyCode) {
        const symbol = currencySymbols[baseCurrencyCode] || baseCurrencyCode;
        return `(in ${symbol})`;
      }
      return "";
    default:
      return "";
  }
};

// Exchange rates to BDT (base rates for conversion)
const exchangeRatesToBDT: Record<string, number> = {
  BDT: 1,
  USD: 110.50,
  INR: 1.33,
  SGD: 81.25,
  EUR: 119.80,
  GBP: 139.50,
  AED: 30.10,
  MYR: 24.75,
  THB: 3.15,
  JPY: 0.74,
  CNY: 15.25,
  AUD: 71.50,
  CAD: 81.00,
};

// Convert amount based on currency selection
export const convertAmount = (
  amount: number,
  currency: CurrencyType,
  baseCurrencyCode: string
): number => {
  if (currency === 'base') {
    return amount;
  }

  // Convert from base currency to BDT first
  const fromRate = exchangeRatesToBDT[baseCurrencyCode] || 1;
  const amountInBDT = amount * fromRate;

  if (currency === 'BDT') {
    return amountInBDT;
  }

  if (currency === 'USD') {
    return amountInBDT / exchangeRatesToBDT.USD;
  }

  return amount;
};

// Helper function to format amount with currency symbol and conversion
export const formatAmount = (
  amount: number,
  currency: CurrencyType,
  baseCurrencyCode?: string
): string => {
  const convertedAmount = baseCurrencyCode 
    ? convertAmount(amount, currency, baseCurrencyCode)
    : amount;
  
  const formatted = convertedAmount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  switch (currency) {
    case "USD":
      return `$${formatted}`;
    case "BDT":
      return `৳${formatted}`;
    case "base":
      if (baseCurrencyCode) {
        const symbol = currencySymbols[baseCurrencyCode] || "";
        return symbol ? `${symbol}${formatted}` : formatted;
      }
      return formatted;
    default:
      return formatted;
  }
};

const ReportCurrencySelector = ({
  value,
  onChange,
  baseCurrencyCode = "BDT",
  className = "",
  restrictToCommonCurrencies = false,
}: ReportCurrencySelectorProps) => {
  // Currency selector UI hidden per requirement; component renders nothing.
  // Props retained so calling pages continue to compile and pass values.
  void value; void onChange; void baseCurrencyCode; void className; void restrictToCommonCurrencies;
  return null;
};

export default ReportCurrencySelector;
