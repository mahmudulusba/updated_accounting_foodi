import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lines = [
  { p: 'Delivered Orders', bold: true },
  { p: 'Delivered Orders Total Price', a2: 4900.00 },
  { p: 'Transaction', a2: -781.66 },
  { p: 'Commission Fee', a1: -655.66 },
  { p: 'VAT on Commission', a1: -98.34 },
  { p: 'Withholding Tax', a1: -27.66 },
  { p: 'Delivery Charge', a2: -200.00 },
  { p: 'Packaging Material Cost', a2: 0.00 },
  { p: 'Approved Claims', a2: 0.00 },
  { p: 'Penalties Adjustment', a2: 0.00 },
  { p: 'Grand Total', a2: 2778.42, bold: true },
  { p: 'Opening Balance', a2: 0.00, bold: true },
  { p: 'Statement Amount', a2: 2778.42 },
  { p: 'Total Payable Amount', a2: 2778.42 },
  { p: 'Payment Amount', a2: 2778.42 },
  { p: 'PrePayment Amount', a2: 0.00 },
  { p: 'Closing Balance', a2: 0.00, bold: true },
];

export default function SupplierStatementView() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Home / Supplier Billing / <span className="text-primary font-medium">Supplier Payout</span> / View
        </nav>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download Overview PDF</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 text-center">Supplier Statement</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-6 pb-4 border-b">
              <div><span className="text-muted-foreground">Shop Name:</span> <strong>Sugarblush</strong></div>
              <div><span className="text-muted-foreground">Supplier Name:</span> <strong>Fahmida Islam</strong></div>
              <div><span className="text-muted-foreground">Supplier Code:</span> <strong>SLC00009688</strong></div>
              <div><span className="text-muted-foreground">Statement No:</span> <strong>BAT-2604272123509065169</strong></div>
              <div><span className="text-muted-foreground">Date Cycle:</span> <strong>20-Apr-2026 - 26-Apr-2026</strong></div>
              <div><span className="text-muted-foreground">Paid Amount:</span> <strong>2,778.42</strong></div>
              <div><span className="text-muted-foreground">Statement Amount:</span> <strong>2,778.42</strong></div>
              <div><span className="text-muted-foreground">Remaining:</span> <strong>0.00</strong></div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">Particulars</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l, i) => (
                    <TableRow key={i} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell className={l.bold ? 'font-bold' : ''}>{l.p}</TableCell>
                      <TableCell className="text-right">{l.a1 != null ? l.a1.toFixed(2) : ''}</TableCell>
                      <TableCell className={`text-right ${l.bold ? 'font-bold' : ''}`}>{l.a2 != null ? l.a2.toFixed(2) : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}