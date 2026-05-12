import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Filter, Settings2, Plus, Eye, Pencil, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { VoucherDetailsDialog } from '@/components/VoucherDetailsDialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAccountingMode } from '@/contexts/AccountingModeContext';

interface VoucherItem {
  id: string;
  sl: number;
  voucherNumber: string;
  documentType: string;
  documentTypeName: string;
  documentDate: string;
  txnDate: string;
  entryDate: string;
  referenceNo: string;
  particular: string;
  amount: number;
  entryUser: string;
  dataType: 'Manual' | 'CSV';
  selected: boolean;
  branchCode: string;
  branchName: string;
  excludedFromTax: boolean;
  lines: { sl: number; accountNumber: string; accountName: string; scb: string; drAmount: number; crAmount: number; remarks: string; }[];
  narration: string;
  postingStatus: 'Posted' | 'Unposted';
  source: 'management' | 'tax' | 'revenue-accounting';
  raType?: string;
}

const mockVouchers: VoucherItem[] = [
  { id: '1', sl: 1, voucherNumber: 'BP-25-26-14001121', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '25 Nov 2025', txnDate: '25 Nov 2025', entryDate: '25 Nov 2025', referenceNo: 'S32605432', particular: 'Advance from B2B Customer (21101001)', amount: 3503.78, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21101001', accountName: 'Advance from B2B Customer', scb: '', drAmount: 3503.78, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 3503.78, remarks: '' }], narration: 'Payment to vendor', postingStatus: 'Unposted', source: 'management' },
  { id: '2', sl: 2, voucherNumber: 'BP-25-26-14001120', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '25 Nov 2025', txnDate: '25 Nov 2025', entryDate: '25 Nov 2025', referenceNo: 'S32605509', particular: 'Advance from B2B Customer (21101001)', amount: 130410.70, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: true, lines: [{ sl: 1, accountNumber: '21101001', accountName: 'Advance from B2B Customer', scb: '', drAmount: 130410.70, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 130410.70, remarks: '' }], narration: 'Customer payment', postingStatus: 'Unposted', source: 'management' },
  { id: '3', sl: 3, voucherNumber: 'BR-25-26-16044041', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: '2532851261392', particular: 'UCB Bank A/C: 0901101000002494 (11102012)', amount: 100000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 100000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 100000.00, remarks: '' }], narration: 'Bank receipt', postingStatus: 'Unposted', source: 'management' },
  { id: '4', sl: 4, voucherNumber: 'BR-25-26-16044040', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: '2532851269584', particular: 'UCB Bank A/C: 0901101000002494 (11102012)', amount: 59272.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 59272.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 59272.00, remarks: '' }], narration: 'Receipt entry', postingStatus: 'Unposted', source: 'management' },
  { id: '5', sl: 5, voucherNumber: 'BR-25-26-16044039', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: 'EB25112485067220', particular: 'UCB Bank A/C: 0901101000002494 (11102012)', amount: 121000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'KOL', branchName: 'Kolkata', excludedFromTax: true, lines: [{ sl: 1, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 121000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 121000.00, remarks: '' }], narration: 'Bank deposit', postingStatus: 'Unposted', source: 'management' },
  { id: '6', sl: 6, voucherNumber: 'BR-25-26-16044038', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: 'NPSB IN/MTBL/018043000 3079/7,370,040.11', particular: 'City Bank A/C: 1254009112001 (11102001)', amount: 4453.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'KOL', branchName: 'Kolkata', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 4453.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 4453.00, remarks: '' }], narration: 'NPSB transfer', postingStatus: 'Unposted', source: 'management' },
  { id: '7', sl: 7, voucherNumber: 'BR-25-26-16044037', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: 'CT/FT-CBLTA-253288783559-1254009112001', particular: 'City Bank A/C: 1254009112001 (11102001)', amount: 32300.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 32300.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 32300.00, remarks: '' }], narration: 'Fund transfer receipt', postingStatus: 'Unposted', source: 'management' },
  { id: '8', sl: 8, voucherNumber: 'BR-25-26-16044036', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '24 Nov 2025', txnDate: '24 Nov 2025', entryDate: '24 Nov 2025', referenceNo: 'CT/FT-CBLTA-253288784636-1781060000634', particular: 'City Bank A/C: 1254009112001 (11102001)', amount: 12256.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 12256.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 12256.00, remarks: '' }], narration: 'CBL transfer', postingStatus: 'Unposted', source: 'management' },
  // Posted vouchers (management)
  { id: 'p1', sl: 1, voucherNumber: 'BP-25-26-13000501', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '20 Nov 2025', txnDate: '20 Nov 2025', entryDate: '20 Nov 2025', referenceNo: 'REF-P-001', particular: 'Office Rent Payment (62101001)', amount: 250000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '62101001', accountName: 'Office Rent', scb: '', drAmount: 250000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 250000.00, remarks: '' }], narration: 'Monthly office rent', postingStatus: 'Posted', source: 'management' },
  { id: 'p2', sl: 2, voucherNumber: 'BR-25-26-15000312', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '18 Nov 2025', txnDate: '18 Nov 2025', entryDate: '18 Nov 2025', referenceNo: 'REF-P-002', particular: 'Sales Revenue Collection (41101001)', amount: 875000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 875000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 875000.00, remarks: '' }], narration: 'Weekly revenue collection', postingStatus: 'Posted', source: 'management' },
  { id: 'p3', sl: 3, voucherNumber: 'JV-25-26-12000101', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '15 Nov 2025', txnDate: '15 Nov 2025', entryDate: '15 Nov 2025', referenceNo: 'REF-P-003', particular: 'Salary Expense Provision (63101001)', amount: 1500000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63101001', accountName: 'Salary Expense', scb: '', drAmount: 1500000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21301001', accountName: 'Salary Payable', scb: '', drAmount: 0, crAmount: 1500000.00, remarks: '' }], narration: 'November salary provision', postingStatus: 'Posted', source: 'management' },
  { id: 'p4', sl: 4, voucherNumber: 'BP-25-26-13000499', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '12 Nov 2025', txnDate: '12 Nov 2025', entryDate: '12 Nov 2025', referenceNo: 'REF-P-004', particular: 'Fuel Purchase Payment (51201001)', amount: 3200000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '51201001', accountName: 'Fuel Expense', scb: '', drAmount: 3200000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 0, crAmount: 3200000.00, remarks: '' }], narration: 'Aviation fuel purchase', postingStatus: 'Posted', source: 'management' },
  // Tax accounting vouchers - unposted
  { id: 't1', sl: 1, voucherNumber: 'TX-BP-25-26-00001', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '26 Nov 2025', txnDate: '26 Nov 2025', entryDate: '26 Nov 2025', referenceNo: 'TAX-REF-001', particular: 'Tax Adjustment - VAT Payable (21201001)', amount: 45000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21201001', accountName: 'VAT Payable', scb: '', drAmount: 45000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 45000.00, remarks: '' }], narration: 'VAT payment adjustment', postingStatus: 'Unposted', source: 'tax' },
  { id: 't2', sl: 2, voucherNumber: 'TX-JV-25-26-00002', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '26 Nov 2025', txnDate: '26 Nov 2025', entryDate: '26 Nov 2025', referenceNo: 'TAX-REF-002', particular: 'Income Tax Provision (52101001)', amount: 78500.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '52101001', accountName: 'Income Tax Expense', scb: '', drAmount: 78500.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21202001', accountName: 'Income Tax Payable', scb: '', drAmount: 0, crAmount: 78500.00, remarks: '' }], narration: 'Income tax provision entry', postingStatus: 'Unposted', source: 'tax' },
  { id: 't3', sl: 3, voucherNumber: 'TX-BP-25-26-00003', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '27 Nov 2025', txnDate: '27 Nov 2025', entryDate: '27 Nov 2025', referenceNo: 'TAX-REF-003', particular: 'Withholding Tax Payment (52102001)', amount: 35200.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '52102001', accountName: 'Withholding Tax', scb: '', drAmount: 35200.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 35200.00, remarks: '' }], narration: 'TDS payment to NBR', postingStatus: 'Unposted', source: 'tax' },
  // Tax accounting vouchers - posted
  { id: 'tp1', sl: 1, voucherNumber: 'TX-JV-25-26-00010', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '10 Nov 2025', txnDate: '10 Nov 2025', entryDate: '10 Nov 2025', referenceNo: 'TAX-REF-010', particular: 'Deferred Tax Liability Adjustment (21203001)', amount: 125000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '52103001', accountName: 'Deferred Tax Expense', scb: '', drAmount: 125000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21203001', accountName: 'Deferred Tax Liability', scb: '', drAmount: 0, crAmount: 125000.00, remarks: '' }], narration: 'Deferred tax adjustment Q3', postingStatus: 'Posted', source: 'tax' },
  { id: 'tp2', sl: 2, voucherNumber: 'TX-BP-25-26-00011', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '05 Nov 2025', txnDate: '05 Nov 2025', entryDate: '05 Nov 2025', referenceNo: 'TAX-REF-011', particular: 'Advance Income Tax Payment (15201001)', amount: 500000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '15201001', accountName: 'Advance Income Tax', scb: '', drAmount: 500000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 500000.00, remarks: '' }], narration: 'AIT payment for Nov', postingStatus: 'Posted', source: 'tax' },
  // Revenue Accounting vouchers - unposted
  { id: 'ra1', sl: 1, voucherNumber: 'RAV-25-26-00001', documentType: 'JV', documentTypeName: 'Revenue Voucher (BSP-SALE)', documentDate: '26 Nov 2025', txnDate: '26 Nov 2025', entryDate: '26 Nov 2025', referenceNo: 'BSP-2025-W47', particular: 'BSP Sales Revenue Recognition', amount: 1250000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11201001', accountName: 'BSP Receivable', scb: '', drAmount: 1250000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Passenger Revenue', scb: '', drAmount: 0, crAmount: 1250000.00, remarks: '' }], narration: 'BSP weekly sales upload', postingStatus: 'Unposted', source: 'revenue-accounting', raType: 'BSP-SALE' },
  { id: 'ra2', sl: 2, voucherNumber: 'RAV-25-26-00002', documentType: 'JV', documentTypeName: 'Revenue Voucher (COUPON-LIFT)', documentDate: '26 Nov 2025', txnDate: '26 Nov 2025', entryDate: '26 Nov 2025', referenceNo: 'CL-2025-NOV-W4', particular: 'Coupon Lift - Revenue Recognized', amount: 875000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21401001', accountName: 'Unearned Revenue', scb: '', drAmount: 875000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Passenger Revenue', scb: '', drAmount: 0, crAmount: 875000.00, remarks: '' }], narration: 'Coupon lift revenue recognition', postingStatus: 'Unposted', source: 'revenue-accounting', raType: 'COUPON-LIFT' },
  { id: 'ra3', sl: 3, voucherNumber: 'RAV-25-26-00003', documentType: 'JV', documentTypeName: 'Revenue Voucher (REFUND)', documentDate: '25 Nov 2025', txnDate: '25 Nov 2025', entryDate: '25 Nov 2025', referenceNo: 'RFD-2025-1187', particular: 'Refund Adjustment Entry', amount: 42500.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'KOL', branchName: 'Kolkata', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '41201001', accountName: 'Refund Expense', scb: '', drAmount: 42500.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11201001', accountName: 'BSP Receivable', scb: '', drAmount: 0, crAmount: 42500.00, remarks: '' }], narration: 'Customer refund processing', postingStatus: 'Unposted', source: 'revenue-accounting', raType: 'REFUND' },
  // Revenue Accounting vouchers - posted
  { id: 'rap1', sl: 1, voucherNumber: 'RAV-25-26-00010', documentType: 'JV', documentTypeName: 'Revenue Voucher (BSP-SALE)', documentDate: '15 Nov 2025', txnDate: '15 Nov 2025', entryDate: '15 Nov 2025', referenceNo: 'BSP-2025-W46', particular: 'BSP Sales Revenue Recognition', amount: 1840000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11201001', accountName: 'BSP Receivable', scb: '', drAmount: 1840000.00, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Passenger Revenue', scb: '', drAmount: 0, crAmount: 1840000.00, remarks: '' }], narration: 'BSP W46 posted', postingStatus: 'Posted', source: 'revenue-accounting', raType: 'BSP-SALE' },
  // === Additional Unposted (Management) ===
  { id: 'u9', sl: 9, voucherNumber: 'JV-25-26-12000205', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '23 Nov 2025', txnDate: '23 Nov 2025', entryDate: '23 Nov 2025', referenceNo: 'JV-REF-205', particular: 'Prepaid Insurance Adjustment (14201001)', amount: 85000.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63501001', accountName: 'Insurance Expense', scb: '', drAmount: 85000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '14201001', accountName: 'Prepaid Insurance', scb: '', drAmount: 0, crAmount: 85000, remarks: '' }], narration: 'Monthly insurance amortization', postingStatus: 'Unposted', source: 'management' },
  { id: 'u10', sl: 10, voucherNumber: 'CP-25-26-17000088', documentType: 'CP', documentTypeName: 'Cash Payment (CP)', documentDate: '23 Nov 2025', txnDate: '23 Nov 2025', entryDate: '23 Nov 2025', referenceNo: 'CP-REF-088', particular: 'Office Stationery Purchase (62301001)', amount: 6750.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '62301001', accountName: 'Office Stationery', scb: '', drAmount: 6750, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11101001', accountName: 'Cash in Hand', scb: '', drAmount: 0, crAmount: 6750, remarks: '' }], narration: 'Stationery purchase', postingStatus: 'Unposted', source: 'management' },
  { id: 'u11', sl: 11, voucherNumber: 'CR-25-26-18000044', documentType: 'CR', documentTypeName: 'Cash Receipt (CR)', documentDate: '22 Nov 2025', txnDate: '22 Nov 2025', entryDate: '22 Nov 2025', referenceNo: 'CR-REF-044', particular: 'Cash Sales Collection (41101001)', amount: 24500.00, entryUser: 'Sumi Akter | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11101001', accountName: 'Cash in Hand', scb: '', drAmount: 24500, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41101001', accountName: 'Sales Revenue', scb: '', drAmount: 0, crAmount: 24500, remarks: '' }], narration: 'Counter cash sale', postingStatus: 'Unposted', source: 'management' },
  { id: 'u12', sl: 12, voucherNumber: 'BP-25-26-14001130', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '22 Nov 2025', txnDate: '22 Nov 2025', entryDate: '22 Nov 2025', referenceNo: 'INV-EL-2025-1145', particular: 'Electricity Bill - November (62402001)', amount: 142800.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '62402001', accountName: 'Electricity Expense', scb: '', drAmount: 142800, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 142800, remarks: '' }], narration: 'DESCO bill payment', postingStatus: 'Unposted', source: 'management' },
  { id: 'u13', sl: 13, voucherNumber: 'JV-25-26-12000206', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '21 Nov 2025', txnDate: '21 Nov 2025', entryDate: '21 Nov 2025', referenceNo: 'DEP-NOV-25', particular: 'Depreciation - Office Equipment (64101001)', amount: 56250.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '64101001', accountName: 'Depreciation Expense', scb: '', drAmount: 56250, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '13201001', accountName: 'Accumulated Depreciation', scb: '', drAmount: 0, crAmount: 56250, remarks: '' }], narration: 'Monthly depreciation Nov-25', postingStatus: 'Unposted', source: 'management' },
  { id: 'u14', sl: 14, voucherNumber: 'BR-25-26-16044055', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '21 Nov 2025', txnDate: '21 Nov 2025', entryDate: '21 Nov 2025', referenceNo: 'TRX-EBL-9988', particular: 'Customer Receipt - Travel House (11201005)', amount: 287400.00, entryUser: 'Sumi Akter | Foodi', dataType: 'CSV', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102003', accountName: 'EBL Bank A/C', scb: '', drAmount: 287400, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11201005', accountName: 'Travel House Receivable', scb: '', drAmount: 0, crAmount: 287400, remarks: '' }], narration: 'Receipt against Inv #4421', postingStatus: 'Unposted', source: 'management' },
  // === Additional Posted (Management) ===
  { id: 'p5', sl: 5, voucherNumber: 'BR-25-26-15000318', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '10 Nov 2025', txnDate: '10 Nov 2025', entryDate: '10 Nov 2025', referenceNo: 'REF-P-005', particular: 'Cargo Revenue Collection (41201001)', amount: 425000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 425000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41201001', accountName: 'Cargo Revenue', scb: '', drAmount: 0, crAmount: 425000, remarks: '' }], narration: 'Cargo receipts week 45', postingStatus: 'Posted', source: 'management' },
  { id: 'p6', sl: 6, voucherNumber: 'BP-25-26-13000510', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '08 Nov 2025', txnDate: '08 Nov 2025', entryDate: '08 Nov 2025', referenceNo: 'REF-P-006', particular: 'Internet & Connectivity (62403001)', amount: 38500.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '62403001', accountName: 'Internet Expense', scb: '', drAmount: 38500, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 38500, remarks: '' }], narration: 'Monthly ISP charges', postingStatus: 'Posted', source: 'management' },
  { id: 'p7', sl: 7, voucherNumber: 'JV-25-26-12000095', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '05 Nov 2025', txnDate: '05 Nov 2025', entryDate: '05 Nov 2025', referenceNo: 'REF-P-007', particular: 'Accrued Audit Fee (21302001)', amount: 175000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63601001', accountName: 'Audit Fee Expense', scb: '', drAmount: 175000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21302001', accountName: 'Accrued Audit Fee', scb: '', drAmount: 0, crAmount: 175000, remarks: '' }], narration: 'Q3 audit fee accrual', postingStatus: 'Posted', source: 'management' },
  { id: 'p8', sl: 8, voucherNumber: 'CP-25-26-17000060', documentType: 'CP', documentTypeName: 'Cash Payment (CP)', documentDate: '03 Nov 2025', txnDate: '03 Nov 2025', entryDate: '03 Nov 2025', referenceNo: 'REF-P-008', particular: 'Staff Refreshment (63801001)', amount: 12350.00, entryUser: 'Sumi Akter | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63801001', accountName: 'Staff Refreshment', scb: '', drAmount: 12350, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11101001', accountName: 'Cash in Hand', scb: '', drAmount: 0, crAmount: 12350, remarks: '' }], narration: 'Team meeting refreshment', postingStatus: 'Posted', source: 'management' },
  { id: 'p9', sl: 9, voucherNumber: 'BR-25-26-15000320', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '01 Nov 2025', txnDate: '01 Nov 2025', entryDate: '01 Nov 2025', referenceNo: 'REF-P-009', particular: 'Excess Baggage Revenue (41301001)', amount: 95400.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 95400, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41301001', accountName: 'Excess Baggage Revenue', scb: '', drAmount: 0, crAmount: 95400, remarks: '' }], narration: 'Excess baggage week 44', postingStatus: 'Posted', source: 'management' },
  // === Additional Tax Unposted ===
  { id: 't4', sl: 4, voucherNumber: 'TX-JV-25-26-00004', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '27 Nov 2025', txnDate: '27 Nov 2025', entryDate: '27 Nov 2025', referenceNo: 'TAX-REF-004', particular: 'VDS Deduction on Vendor Bill (21201005)', amount: 18750.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21302005', accountName: 'Vendor Payable', scb: '', drAmount: 18750, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21201005', accountName: 'VDS Payable', scb: '', drAmount: 0, crAmount: 18750, remarks: '' }], narration: 'VDS @ 7.5% on services', postingStatus: 'Unposted', source: 'tax' },
  { id: 't5', sl: 5, voucherNumber: 'TX-BP-25-26-00005', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '27 Nov 2025', txnDate: '27 Nov 2025', entryDate: '27 Nov 2025', referenceNo: 'TAX-REF-005', particular: 'Customs Duty Payment (52201001)', amount: 215000.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '52201001', accountName: 'Customs Duty', scb: '', drAmount: 215000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 215000, remarks: '' }], narration: 'Customs duty - spare parts import', postingStatus: 'Unposted', source: 'tax' },
  { id: 't6', sl: 6, voucherNumber: 'TX-JV-25-26-00006', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '28 Nov 2025', txnDate: '28 Nov 2025', entryDate: '28 Nov 2025', referenceNo: 'TAX-REF-006', particular: 'AIT Deduction on Salary (52102002)', amount: 92400.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21301001', accountName: 'Salary Payable', scb: '', drAmount: 92400, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '52102002', accountName: 'AIT on Salary', scb: '', drAmount: 0, crAmount: 92400, remarks: '' }], narration: 'TDS on November salary', postingStatus: 'Unposted', source: 'tax' },
  { id: 't7', sl: 7, voucherNumber: 'TX-JV-25-26-00007', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '28 Nov 2025', txnDate: '28 Nov 2025', entryDate: '28 Nov 2025', referenceNo: 'TAX-REF-007', particular: 'VAT on Rental Income (21201002)', amount: 27500.00, entryUser: 'Sumi Akter | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11201001', accountName: 'Rental Receivable', scb: '', drAmount: 27500, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21201002', accountName: 'VAT Output - Rent', scb: '', drAmount: 0, crAmount: 27500, remarks: '' }], narration: 'VAT @ 15% on rental', postingStatus: 'Unposted', source: 'tax' },
  { id: 't8', sl: 8, voucherNumber: 'TX-BP-25-26-00008', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '29 Nov 2025', txnDate: '29 Nov 2025', entryDate: '29 Nov 2025', referenceNo: 'TAX-REF-008', particular: 'Supplementary Duty Payment (52203001)', amount: 64800.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '52203001', accountName: 'Supplementary Duty', scb: '', drAmount: 64800, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 64800, remarks: '' }], narration: 'SD payment to NBR', postingStatus: 'Unposted', source: 'tax' },
  // === Extra Unposted (Management) ===
  { id: 'u15', sl: 15, voucherNumber: 'BP-25-26-14001140', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '20 Nov 2025', txnDate: '20 Nov 2025', entryDate: '20 Nov 2025', referenceNo: 'INV-WTR-2025-0921', particular: 'Water Bill Payment (62404001)', amount: 18250.00, entryUser: 'Sumi Akter | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '62404001', accountName: 'Water Expense', scb: '', drAmount: 18250, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 18250, remarks: '' }], narration: 'WASA bill November', postingStatus: 'Unposted', source: 'management' },
  { id: 'u16', sl: 16, voucherNumber: 'JV-25-26-12000210', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '20 Nov 2025', txnDate: '20 Nov 2025', entryDate: '20 Nov 2025', referenceNo: 'JV-REF-210', particular: 'Bank Charges Reclassification (63701001)', amount: 4520.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63701001', accountName: 'Bank Charges', scb: '', drAmount: 4520, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102003', accountName: 'EBL Bank A/C', scb: '', drAmount: 0, crAmount: 4520, remarks: '' }], narration: 'Bank charges adjustment', postingStatus: 'Unposted', source: 'management' },
  { id: 'u17', sl: 17, voucherNumber: 'CP-25-26-17000095', documentType: 'CP', documentTypeName: 'Cash Payment (CP)', documentDate: '19 Nov 2025', txnDate: '19 Nov 2025', entryDate: '19 Nov 2025', referenceNo: 'CP-REF-095', particular: 'Travel Allowance - Crew (63901001)', amount: 32000.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '63901001', accountName: 'Travel Allowance', scb: '', drAmount: 32000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11101001', accountName: 'Cash in Hand', scb: '', drAmount: 0, crAmount: 32000, remarks: '' }], narration: 'Crew TA/DA payment', postingStatus: 'Unposted', source: 'management' },
  { id: 'u18', sl: 18, voucherNumber: 'BR-25-26-16044072', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '19 Nov 2025', txnDate: '19 Nov 2025', entryDate: '19 Nov 2025', referenceNo: 'TRX-DBL-7741', particular: 'Customer Receipt - Sky Travels (11201006)', amount: 415700.00, entryUser: 'Sumi Akter | Foodi', dataType: 'CSV', selected: false, branchCode: 'KOL', branchName: 'Kolkata', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102004', accountName: 'DBBL Bank A/C', scb: '', drAmount: 415700, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11201006', accountName: 'Sky Travels Receivable', scb: '', drAmount: 0, crAmount: 415700, remarks: '' }], narration: 'Receipt against Inv #5512', postingStatus: 'Unposted', source: 'management' },
  { id: 'u19', sl: 19, voucherNumber: 'BP-25-26-14001145', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '18 Nov 2025', txnDate: '18 Nov 2025', entryDate: '18 Nov 2025', referenceNo: 'PAY-VND-1180', particular: 'Catering Vendor Payment (51301001)', amount: 524000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '51301001', accountName: 'Catering Expense', scb: '', drAmount: 524000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 524000, remarks: '' }], narration: 'In-flight catering Nov-W3', postingStatus: 'Unposted', source: 'management' },
  // === Extra Posted (Management) ===
  { id: 'p10', sl: 10, voucherNumber: 'BP-25-26-13000515', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '28 Oct 2025', txnDate: '28 Oct 2025', entryDate: '28 Oct 2025', referenceNo: 'REF-P-010', particular: 'Aircraft Maintenance Charges (51401001)', amount: 1850000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '51401001', accountName: 'Aircraft Maintenance', scb: '', drAmount: 1850000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 1850000, remarks: '' }], narration: 'C-check maintenance Oct', postingStatus: 'Posted', source: 'management' },
  { id: 'p11', sl: 11, voucherNumber: 'JV-25-26-12000100', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '25 Oct 2025', txnDate: '25 Oct 2025', entryDate: '25 Oct 2025', referenceNo: 'REF-P-011', particular: 'Forex Gain Recognition (44101001)', amount: 78900.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'SGP', branchName: 'Singapore', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102012', accountName: 'UCB Bank A/C', scb: '', drAmount: 78900, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '44101001', accountName: 'Foreign Exchange Gain', scb: '', drAmount: 0, crAmount: 78900, remarks: '' }], narration: 'FX revaluation Oct-25', postingStatus: 'Posted', source: 'management' },
  { id: 'p12', sl: 12, voucherNumber: 'BR-25-26-15000325', documentType: 'BR', documentTypeName: 'Bank Receipt (BR)', documentDate: '22 Oct 2025', txnDate: '22 Oct 2025', entryDate: '22 Oct 2025', referenceNo: 'REF-P-012', particular: 'Charter Flight Revenue (41401001)', amount: 2750000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 2750000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '41401001', accountName: 'Charter Revenue', scb: '', drAmount: 0, crAmount: 2750000, remarks: '' }], narration: 'Charter for Govt delegation', postingStatus: 'Posted', source: 'management' },
  { id: 'p13', sl: 13, voucherNumber: 'CP-25-26-17000068', documentType: 'CP', documentTypeName: 'Cash Payment (CP)', documentDate: '20 Oct 2025', txnDate: '20 Oct 2025', entryDate: '20 Oct 2025', referenceNo: 'REF-P-013', particular: 'Vehicle Fuel - Ground Ops (51202001)', amount: 28400.00, entryUser: 'Sumi Akter | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '51202001', accountName: 'Vehicle Fuel', scb: '', drAmount: 28400, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11101001', accountName: 'Cash in Hand', scb: '', drAmount: 0, crAmount: 28400, remarks: '' }], narration: 'GSE fuel weekly', postingStatus: 'Posted', source: 'management' },
  { id: 'p14', sl: 14, voucherNumber: 'BP-25-26-13000520', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '15 Oct 2025', txnDate: '15 Oct 2025', entryDate: '15 Oct 2025', referenceNo: 'REF-P-014', particular: 'Insurance Premium - Hull (63501002)', amount: 4200000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '14201002', accountName: 'Prepaid Hull Insurance', scb: '', drAmount: 4200000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 4200000, remarks: '' }], narration: 'Annual hull insurance', postingStatus: 'Posted', source: 'management' },
  // === Extra Tax Unposted ===
  { id: 't9', sl: 9, voucherNumber: 'TX-JV-25-26-00009', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '29 Nov 2025', txnDate: '29 Nov 2025', entryDate: '29 Nov 2025', referenceNo: 'TAX-REF-009', particular: 'TDS on Professional Fee (52102003)', amount: 15600.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21302005', accountName: 'Vendor Payable', scb: '', drAmount: 15600, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '52102003', accountName: 'TDS - Professional', scb: '', drAmount: 0, crAmount: 15600, remarks: '' }], narration: 'TDS @ 10% on consultant', postingStatus: 'Unposted', source: 'tax' },
  { id: 't10', sl: 10, voucherNumber: 'TX-BP-25-26-00010', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '30 Nov 2025', txnDate: '30 Nov 2025', entryDate: '30 Nov 2025', referenceNo: 'TAX-REF-010', particular: 'VAT Output Settlement (21201001)', amount: 142000.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '21201001', accountName: 'VAT Payable', scb: '', drAmount: 142000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 142000, remarks: '' }], narration: 'Monthly VAT return payment', postingStatus: 'Unposted', source: 'tax' },
  { id: 't11', sl: 11, voucherNumber: 'TX-JV-25-26-00011', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '30 Nov 2025', txnDate: '30 Nov 2025', entryDate: '30 Nov 2025', referenceNo: 'TAX-REF-011', particular: 'Excise Duty on Air Ticket (52204001)', amount: 87500.00, entryUser: 'Sumi Akter | Foodi', dataType: 'CSV', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '11201001', accountName: 'BSP Receivable', scb: '', drAmount: 87500, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '52204001', accountName: 'Excise Duty Payable', scb: '', drAmount: 0, crAmount: 87500, remarks: '' }], narration: 'Excise on domestic tickets', postingStatus: 'Unposted', source: 'tax' },
  { id: 't12', sl: 12, voucherNumber: 'TX-JV-25-26-00012', documentType: 'JV', documentTypeName: 'Journal Voucher (JV)', documentDate: '01 Dec 2025', txnDate: '01 Dec 2025', entryDate: '01 Dec 2025', referenceNo: 'TAX-REF-012', particular: 'VAT Input Credit Adjustment (15301001)', amount: 56700.00, entryUser: 'Foodi Admin | Foodi', dataType: 'Manual', selected: false, branchCode: 'CTG', branchName: 'Chattogram', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '15301001', accountName: 'VAT Input Credit', scb: '', drAmount: 56700, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '21302005', accountName: 'Vendor Payable', scb: '', drAmount: 0, crAmount: 56700, remarks: '' }], narration: 'Input VAT on imports', postingStatus: 'Unposted', source: 'tax' },
  { id: 't13', sl: 13, voucherNumber: 'TX-BP-25-26-00013', documentType: 'BP', documentTypeName: 'Bank Payment (BP)', documentDate: '02 Dec 2025', txnDate: '02 Dec 2025', entryDate: '02 Dec 2025', referenceNo: 'TAX-REF-013', particular: 'AIT Quarterly Installment (52101002)', amount: 750000.00, entryUser: 'Rakib Hasan | Foodi', dataType: 'Manual', selected: false, branchCode: 'DHK', branchName: 'Dhaka', excludedFromTax: false, lines: [{ sl: 1, accountNumber: '15201001', accountName: 'Advance Income Tax', scb: '', drAmount: 750000, crAmount: 0, remarks: '' }, { sl: 2, accountNumber: '11102001', accountName: 'City Bank A/C', scb: '', drAmount: 0, crAmount: 750000, remarks: '' }], narration: 'Q3 AIT installment', postingStatus: 'Unposted', source: 'tax' },
];

export default function VoucherList() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(mockVouchers);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'unposted');
  const { isTaxMode } = useAccountingMode();

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setActiveTab(t);
  }, [searchParams]);
  
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [taxToggleVoucher, setTaxToggleVoucher] = useState<VoucherItem | null>(null);
  const [deleteVoucher, setDeleteVoucher] = useState<VoucherItem | null>(null);

  const toggleSelect = (id: string) => {
    setVouchers(vouchers.map(v => v.id === id ? { ...v, selected: !v.selected } : v));
  };

  const toggleSelectAll = (checked: boolean) => {
    setVouchers(vouchers.map(v => ({ ...v, selected: checked })));
  };

  // Filter vouchers based on mode and tab
  const getFilteredVouchers = () => {
    let base = vouchers.filter(v =>
      v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.particular.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isTaxMode) {
      // Tax mode: show only non-excluded vouchers (from management) + tax-source vouchers
      base = base.filter(v => v.source === 'tax' || (v.source === 'management' && !v.excludedFromTax));
    } else {
      // Management mode
      if (activeTab === 'tax-unposted') {
        base = base.filter(v => v.source === 'tax' && v.postingStatus === 'Unposted');
        return base;
      }
      if (activeTab === 'revenue-accounting') {
        base = base.filter(v => v.source === 'revenue-accounting');
        return base;
      }
    }

    if (activeTab === 'posted') {
      base = base.filter(v => v.postingStatus === 'Posted');
    } else if (activeTab === 'unposted') {
      if (isTaxMode) {
        base = base.filter(v => v.postingStatus === 'Unposted');
      } else {
        base = base.filter(v => v.source === 'management' && v.postingStatus === 'Unposted');
      }
    }

    return base;
  };

  const filteredVouchers = getFilteredVouchers();
  const selectedCount = filteredVouchers.filter(v => v.selected).length;
  
  const handleViewVoucher = (voucher: VoucherItem) => {
    setSelectedVoucher(voucher);
    setIsDetailsOpen(true);
  };

  const handleTaxToggle = (voucher: VoucherItem) => {
    setTaxToggleVoucher(voucher);
  };

  const confirmTaxToggle = () => {
    if (!taxToggleVoucher) return;
    const newStatus = !taxToggleVoucher.excludedFromTax;
    setVouchers(vouchers.map(v => v.id === taxToggleVoucher.id ? { ...v, excludedFromTax: newStatus } : v));
    toast.success(newStatus ? 'Voucher excluded from Tax Accounting' : 'Voucher re-included in Tax Accounting');
    setTaxToggleVoucher(null);
  };

  const handleDelete = (voucher: VoucherItem) => {
    setDeleteVoucher(voucher);
  };

  const confirmDelete = () => {
    if (!deleteVoucher) return;
    setVouchers(vouchers.filter(v => v.id !== deleteVoucher.id));
    toast.success(`Voucher ${deleteVoucher.voucherNumber} deleted`);
    setDeleteVoucher(null);
  };
  
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    return convert(Math.floor(num)) + ' Only';
  };

  // Show Tax Status column only in management mode
  const showTaxStatus = !isTaxMode;
  // In tax mode, show edit/delete actions; in management mode, only view
  const showEditDelete = isTaxMode;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">Voucher</span> / Voucher Invoice List
            </nav>
            <h1 className="text-2xl font-bold">Voucher Invoice List</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="default" size="icon"><Filter className="h-4 w-4" /></Button>
            <Button variant="default" size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="unposted">Unposted List</TabsTrigger>
                  <TabsTrigger value="posted">Posted List</TabsTrigger>
                  {!isTaxMode && (
                    <TabsTrigger value="tax-unposted">Tax Unposted</TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button variant="destructive" disabled={selectedCount === 0}>Delete <Trash2 className="ml-1 h-4 w-4" /></Button>
                <Button disabled={selectedCount === 0}>Post ✉</Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><Settings2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
              <div className="flex-1"></div>
              <Input placeholder="Search all columns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64" />
            </div>

            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-12">
                      <Checkbox checked={filteredVouchers.length > 0 && filteredVouchers.every(v => v.selected)} onCheckedChange={(checked) => toggleSelectAll(!!checked)} />
                    </TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Voucher Number ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Voucher Date ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">TXN Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Entry Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Reference No ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Particular ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Amount ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Branch</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Branch Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Entry User ⇅</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Data</TableHead>
                    {showTaxStatus && (
                      <TableHead className="text-table-header-foreground font-semibold text-center">Tax Status</TableHead>
                    )}
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVouchers.map((voucher, index) => (
                    <TableRow key={voucher.id} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>
                        <Checkbox checked={voucher.selected} onCheckedChange={() => toggleSelect(voucher.id)} />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                      <TableCell>{voucher.documentDate}</TableCell>
                      <TableCell>{voucher.txnDate}</TableCell>
                      <TableCell>{voucher.entryDate}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={voucher.referenceNo}>{voucher.referenceNo}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={voucher.particular}>{voucher.particular}</TableCell>
                      <TableCell className="text-right font-medium">{voucher.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{voucher.branchName}</TableCell>
                      <TableCell>{voucher.branchCode}</TableCell>
                      <TableCell>{voucher.entryUser}</TableCell>
                      <TableCell>{voucher.dataType}</TableCell>
                      {showTaxStatus && (
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant={voucher.excludedFromTax ? 'outline' : 'ghost'}
                            className={`h-7 gap-1 text-xs ${voucher.excludedFromTax ? 'text-destructive border-destructive/30' : 'text-success'}`}
                            onClick={() => handleTaxToggle(voucher)}
                            title={voucher.excludedFromTax ? 'Click to re-include in Tax Accounting' : 'Click to exclude from Tax Accounting'}
                          >
                            {voucher.excludedFromTax ? (
                              <><ShieldOff className="h-3.5 w-3.5" /> Excluded</>
                            ) : (
                              <><ShieldCheck className="h-3.5 w-3.5" /> Included</>
                            )}
                          </Button>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md" onClick={() => handleViewVoucher(voucher)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {showEditDelete && (
                            <>
                              <Button size="icon" variant="ghost" className="h-8 w-8 bg-amber-500 text-white hover:bg-amber-600 rounded-md">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md" onClick={() => handleDelete(voucher)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Toggle Confirmation Dialog (Management mode only) */}
      <AlertDialog open={!!taxToggleVoucher} onOpenChange={(open) => !open && setTaxToggleVoucher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {taxToggleVoucher?.excludedFromTax ? 'Re-include in Tax Accounting?' : 'Exclude from Tax Accounting?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Voucher <strong>{taxToggleVoucher?.voucherNumber}</strong> is currently{' '}
                <strong>{taxToggleVoucher?.excludedFromTax ? 'excluded from' : 'included in'}</strong> Tax Accounting.
              </p>
              {taxToggleVoucher?.excludedFromTax ? (
                <div className="bg-success/10 border border-success/20 p-3 rounded-lg text-xs space-y-1">
                  <p>• This voucher will be <strong>re-included</strong> in Tax Accounting records.</p>
                  <p>• It will appear in both Management and Tax Accounting reports.</p>
                </div>
              ) : (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-xs space-y-1">
                  <p>• This voucher will be <strong>excluded</strong> from Tax Accounting.</p>
                  <p>• It will only appear in Management Accounting.</p>
                  <p>• You can re-include it anytime from this list.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTaxToggle} className={taxToggleVoucher?.excludedFromTax ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}>
              {taxToggleVoucher?.excludedFromTax ? 'Re-include in Tax' : 'Exclude from Tax'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVoucher} onOpenChange={(open) => !open && setDeleteVoucher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Voucher?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete voucher <strong>{deleteVoucher?.voucherNumber}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VoucherDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        voucher={selectedVoucher ? {
          voucherNumber: selectedVoucher.voucherNumber,
          documentType: selectedVoucher.documentType,
          documentTypeName: selectedVoucher.documentTypeName,
          documentDate: selectedVoucher.documentDate,
          postingStatus: selectedVoucher.postingStatus,
          lines: selectedVoucher.lines,
          amountInWords: numberToWords(selectedVoucher.amount),
          narration: selectedVoucher.narration,
          entryUser: selectedVoucher.entryUser,
          entryDate: selectedVoucher.entryDate,
          branchCode: selectedVoucher.branchCode,
        } : null}
      />
    </DashboardLayout>
  );
}
