import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { toast } from 'sonner';

const lines = [
  { p: 'Delivered Orders', bold: true },
  { p: 'Delivered Orders Total Price', a2: 1200.00 },
  { p: 'Transaction', a2: -350.00 },
  { p: 'Commission Fee', a1: -300.00 },
  { p: 'VAT on Commission', a1: -45.00 },
  { p: 'Withholding Tax', a1: -5.00 },
  { p: 'Delivery Charge', a2: -50.00 },
  { p: 'Penalties', a2: -200.00 },
  { p: 'Grand Total', a2: -1168.96, bold: true },
];

export default function ManualStatementGenerate() {
  const [from, setFrom] = useState('2026-04-03');
  const [to, setTo] = useState('2026-05-03');
  const [supplier, setSupplier] = useState('SLC00009656');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Home / Supplier / <span className="text-primary font-medium">Manual Statement Generate</span>
        </nav>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Manual Statement Generate</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>From Date</Label>
                <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <div>
                <Label>Supplier *</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="SLC00009656">Lucky Dragon - Fahmida Islam (SLC00009656)</SelectItem>
                    <SelectItem value="SLC00009688">Sugarblush - Fahmida Islam (SLC00009688)</SelectItem>
                    <SelectItem value="SLC00009470">Digital Pack - Khan Nazmul Islam (SLC00009470)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>Preview</Button>
                <Button onClick={() => toast.success('Statement generated')}>Generate</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4 text-center underline">Supplier Statement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4 pb-4 border-b">
                <div><span className="text-muted-foreground">Shop Name:</span> <strong>Lucky Dragon</strong></div>
                <div><span className="text-muted-foreground">Supplier Name:</span> <strong>Fahmida Islam</strong></div>
                <div><span className="text-muted-foreground">Supplier Code:</span> <strong>SLC00009656</strong></div>
                <div><span className="text-muted-foreground">Date Cycle:</span> <strong>03-Apr-2026 - 03-May-2026</strong></div>
                <div><span className="text-muted-foreground">Status:</span> <strong className="text-warning">Pending</strong></div>
                <div><span className="text-muted-foreground">Method:</span> <strong>Manual</strong></div>
                <div><span className="text-muted-foreground">Paid Amount:</span> <strong>0.00</strong></div>
                <div><span className="text-muted-foreground">Statement:</span> <strong>-1,168.96</strong></div>
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
        )}
      </div>
    </DashboardLayout>
  );
}