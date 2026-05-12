import { CurrencyType } from '@/components/ReportCurrencySelector';

// Exchange rates to BDT (base rates for conversion)
// These would typically come from an API in a real application
export const exchangeRatesToBDT: Record<string, number> = {
  BDT: 1,
  USD: 110.50,  // 1 USD = 110.50 BDT
  INR: 1.33,    // 1 INR = 1.33 BDT
  SGD: 81.25,   // 1 SGD = 81.25 BDT
  EUR: 119.80,  // 1 EUR = 119.80 BDT
  GBP: 139.50,  // 1 GBP = 139.50 BDT
  AED: 30.10,   // 1 AED = 30.10 BDT
  MYR: 24.75,   // 1 MYR = 24.75 BDT
  THB: 3.15,    // 1 THB = 3.15 BDT
  JPY: 0.74,    // 1 JPY = 0.74 BDT
  CNY: 15.25,   // 1 CNY = 15.25 BDT
  AUD: 71.50,   // 1 AUD = 71.50 BDT
  CAD: 81.00,   // 1 CAD = 81.00 BDT
};

// Convert amount from base currency to target currency
export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: CurrencyType,
  baseCurrencyCode: string
): number => {
  // If showing in base currency, return as is
  if (toCurrency === 'base') {
    return amount;
  }

  // First convert from base currency to BDT
  const fromRate = exchangeRatesToBDT[baseCurrencyCode] || 1;
  const amountInBDT = amount * fromRate;

  // Then convert from BDT to target currency
  if (toCurrency === 'BDT') {
    return amountInBDT;
  }

  if (toCurrency === 'USD') {
    return amountInBDT / exchangeRatesToBDT.USD;
  }

  return amount;
};

// Branch-specific multipliers for different data variations
export const branchMultipliers: Record<string, number> = {
  DHK: 1.0,     // Dhaka - base
  SGP: 1.45,    // Singapore - 45% higher
  KOL: 0.65,    // Kolkata - 35% lower
  CTG: 0.85,    // Chittagong - 15% lower
};

// Get multiplier for a branch, default to 1 if not found
export const getBranchMultiplier = (branchCode: string): number => {
  return branchMultipliers[branchCode] || 1.0;
};

// Aggregate data for "All Branches" view
export const aggregateAmounts = <T extends { branchCode: string }>(
  data: T[],
  amountFields: (keyof T)[],
  filterBranchCode: string
): T[] => {
  if (filterBranchCode !== 'all') {
    return data.filter(item => item.branchCode === filterBranchCode);
  }
  return data;
};

// Generate branch-specific data by applying multipliers
export const applyBranchMultiplier = (
  baseAmount: number,
  branchCode: string
): number => {
  const multiplier = getBranchMultiplier(branchCode);
  return baseAmount * multiplier;
};
