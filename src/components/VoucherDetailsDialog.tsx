import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Printer, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { currencySymbols } from '@/components/ReportCurrencySelector';

interface VoucherLine {
  sl: number;
  accountNumber: string;
  accountName: string;
  scb: string;
  drAmount: number;
  crAmount: number;
  remarks: string;
}

interface VoucherDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: {
    voucherNumber: string;
    documentType: string;
    documentTypeName: string;
    documentDate: string;
    postingStatus: 'Posted' | 'Unposted';
    lines: VoucherLine[];
    amountInWords: string;
    narration: string;
    entryUser: string;
    entryDate: string;
    postingUser?: string;
    postingDate?: string;
    branchCode: string;
  } | null;
  onPost?: () => void;
}

export function VoucherDetailsDialog({ open, onOpenChange, voucher, onPost }: VoucherDetailsProps) {
  const { branches, currencyRates } = useApp();

  if (!voucher) return null;

  // Get branch info for currency
  const branch = branches.find(b => b.code === voucher.branchCode);
  const baseCurrency = branch?.baseCurrency || 'BDT';
  const baseCurrencySymbol = currencySymbols[baseCurrency] || baseCurrency;

  // Get currency rates for this branch
  const branchRate = currencyRates.find(r => r.branchCode === voucher.branchCode);
  const rateToBDT = branchRate?.rateToBDT || (baseCurrency === 'BDT' ? 1 : 95.1);
  const rateToUSD = branchRate?.rateToUSD || (baseCurrency === 'USD' ? 1 : 0.0084);

  // Calculate totals
  const totalDr = voucher.lines.reduce((sum, line) => sum + line.drAmount, 0);
  const totalCr = voucher.lines.reduce((sum, line) => sum + line.crAmount, 0);

  // Calculate converted totals
  const totalDrBDT = baseCurrency === 'BDT' ? totalDr : totalDr * rateToBDT;
  const totalCrBDT = baseCurrency === 'BDT' ? totalCr : totalCr * rateToBDT;
  const totalDrUSD = baseCurrency === 'USD' ? totalDr : totalDr * rateToUSD;
  const totalCrUSD = baseCurrency === 'USD' ? totalCr : totalCr * rateToUSD;

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Voucher Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="default" className="bg-primary">
              <Printer className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="default" className="bg-primary">
              <FileText className="h-5 w-5" />
            </Button>
          </div>

          {/* Document Info Header */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Document No.: </span>
              <span>{voucher.voucherNumber}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">Document Date: </span>
              <span>{voucher.documentDate}</span>
            </div>
            <div>
              <span className="font-semibold">Document Type: </span>
              <span>{voucher.documentTypeName}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">Posting Status: </span>
              <span className={voucher.postingStatus === 'Posted' ? 'text-success' : 'text-muted-foreground'}>
                {voucher.postingStatus}
              </span>
            </div>
          </div>

          {/* Voucher Lines Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="text-table-header-foreground font-semibold w-12">SL</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Account Number</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Account Name</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">S / C / B</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold text-right">
                    Dr. Amount ({baseCurrencySymbol})
                  </TableHead>
                  <TableHead className="text-table-header-foreground font-semibold text-right">
                    Cr. Amount ({baseCurrencySymbol})
                  </TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Remarks / Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voucher.lines.map((line, index) => (
                  <TableRow key={index} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                    <TableCell>{line.sl}</TableCell>
                    <TableCell>{line.accountNumber}</TableCell>
                    <TableCell>{line.accountName}</TableCell>
                    <TableCell>{line.scb}</TableCell>
                    <TableCell className="text-right">{formatAmount(line.drAmount)}</TableCell>
                    <TableCell className="text-right">{formatAmount(line.crAmount)}</TableCell>
                    <TableCell>{line.remarks}</TableCell>
                  </TableRow>
                ))}
                
                {/* Total Amount Row - Base Currency */}
                <TableRow className="font-semibold bg-muted/50">
                  <TableCell colSpan={4} className="text-right">Total Amount:</TableCell>
                  <TableCell className="text-right">{formatAmount(totalDr)}</TableCell>
                  <TableCell className="text-right">{formatAmount(totalCr)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* Converted Amount - USD */}
                <TableRow className="text-sm bg-blue-50 dark:bg-blue-950/20">
                  <TableCell colSpan={4} className="text-right font-medium">
                    <span className="text-muted-foreground">Converted to</span> USD ($):
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${formatAmount(totalDrUSD)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${formatAmount(totalCrUSD)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* Converted Amount - BDT */}
                <TableRow className="text-sm bg-green-50 dark:bg-green-950/20">
                  <TableCell colSpan={4} className="text-right font-medium">
                    <span className="text-muted-foreground">Converted to</span> BDT (৳):
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ৳{formatAmount(totalDrBDT)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ৳{formatAmount(totalCrBDT)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Amount in Words */}
          <div className="grid grid-cols-[150px_1fr] gap-2 items-center text-sm">
            <span className="font-semibold">Amount In Words :</span>
            <div className="p-2 border rounded bg-muted/30">
              {voucher.amountInWords}
            </div>
          </div>

          {/* Narration */}
          <div className="grid grid-cols-[150px_1fr] gap-2 items-start text-sm">
            <span className="font-semibold">Narration :</span>
            <Textarea
              value={voucher.narration}
              readOnly
              className="resize-none bg-muted/30"
              rows={2}
            />
          </div>

          {/* Entry/Posting Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Entry User : </span>
              <span>{voucher.entryUser}</span>
            </div>
            <div>
              <span className="font-semibold">Posting User : </span>
              <span>{voucher.postingUser || ''}</span>
            </div>
            <div>
              <span className="font-semibold">Entry Date : </span>
              <span>{voucher.entryDate}</span>
            </div>
            <div>
              <span className="font-semibold">Posting Date : </span>
              <span>{voucher.postingDate || ''}</span>
            </div>
          </div>

          {/* Post Button */}
          {voucher.postingStatus === 'Unposted' && onPost && (
            <div className="flex justify-center pt-4">
              <Button onClick={onPost} className="px-8">
                Post
              </Button>
            </div>
          )}

          {/* Activity Log Section Header */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-bold">Activity Log</h3>
            <div className="text-sm text-muted-foreground mt-2">
              No activity logs available.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
