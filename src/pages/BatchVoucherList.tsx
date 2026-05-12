import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Trash2, Mail, Paperclip, Eye } from 'lucide-react';

interface BatchRow {
  sl: number;
  batchNumber: string;
  notes: string;
  totalAmount: number;
  entryBy: string;
  entryDate: string;
  reference: string;
  noOfTxn: number;
  unposted: number;
  posted: number;
  attachment: boolean;
}

const dummyRows: BatchRow[] = [
  { sl: 1, batchNumber: 'BATCH-25-26-0001', notes: 'November payroll batch', totalAmount: 1500000.00, entryBy: 'Foodi Admin', entryDate: '20-Nov-2025', reference: 'PAY-NOV-25', noOfTxn: 12, unposted: 0, posted: 12, attachment: true },
  { sl: 2, batchNumber: 'BATCH-25-26-0002', notes: 'Bank reconciliation entries', totalAmount: 875400.50, entryBy: 'Foodi Admin', entryDate: '22-Nov-2025', reference: 'BR-W47', noOfTxn: 8, unposted: 3, posted: 5, attachment: false },
  { sl: 3, batchNumber: 'BATCH-25-26-0003', notes: 'Vendor settlements', totalAmount: 450230.75, entryBy: 'M. Hasan', entryDate: '24-Nov-2025', reference: 'VS-2025-11', noOfTxn: 6, unposted: 6, posted: 0, attachment: true },
  { sl: 4, batchNumber: 'BATCH-25-26-0004', notes: 'Fuel cost allocation', totalAmount: 3200000.00, entryBy: 'Foodi Admin', entryDate: '25-Nov-2025', reference: 'FUEL-NOV', noOfTxn: 4, unposted: 0, posted: 4, attachment: true },
  { sl: 5, batchNumber: 'BATCH-25-26-0005', notes: 'Misc journal adjustments', totalAmount: 125000.00, entryBy: 'M. Hasan', entryDate: '26-Nov-2025', reference: 'JV-MISC-01', noOfTxn: 3, unposted: 1, posted: 2, attachment: false },
  { sl: 6, batchNumber: 'BATCH-25-26-0006', notes: 'Aircraft maintenance batch', totalAmount: 4250000.00, entryBy: 'Foodi Admin', entryDate: '27-Nov-2025', reference: 'MAINT-NOV-W4', noOfTxn: 9, unposted: 0, posted: 9, attachment: true },
  { sl: 7, batchNumber: 'BATCH-25-26-0007', notes: 'Catering cost allocation', totalAmount: 685400.00, entryBy: 'Sumi Akter', entryDate: '28-Nov-2025', reference: 'CATR-NOV', noOfTxn: 5, unposted: 2, posted: 3, attachment: false },
  { sl: 8, batchNumber: 'BATCH-25-26-0008', notes: 'BSP weekly settlement', totalAmount: 12500000.00, entryBy: 'Foodi Admin', entryDate: '29-Nov-2025', reference: 'BSP-W48', noOfTxn: 18, unposted: 0, posted: 18, attachment: true },
  { sl: 9, batchNumber: 'BATCH-25-26-0009', notes: 'Tax provision entries', totalAmount: 945000.00, entryBy: 'Rakib Hasan', entryDate: '30-Nov-2025', reference: 'TAX-PROV-Q3', noOfTxn: 7, unposted: 7, posted: 0, attachment: true },
  { sl: 10, batchNumber: 'BATCH-25-26-0010', notes: 'Depreciation run', totalAmount: 1875000.00, entryBy: 'Foodi Admin', entryDate: '01-Dec-2025', reference: 'DEP-NOV-25', noOfTxn: 14, unposted: 0, posted: 14, attachment: false },
  { sl: 11, batchNumber: 'BATCH-25-26-0011', notes: 'Forex revaluation', totalAmount: 320500.00, entryBy: 'M. Hasan', entryDate: '02-Dec-2025', reference: 'FX-REVAL-NOV', noOfTxn: 4, unposted: 1, posted: 3, attachment: false },
  { sl: 12, batchNumber: 'BATCH-25-26-0012', notes: 'Fuel hedging adjustments', totalAmount: 2750000.00, entryBy: 'Foodi Admin', entryDate: '03-Dec-2025', reference: 'FUEL-HEDGE', noOfTxn: 6, unposted: 6, posted: 0, attachment: true },
];

const BatchVoucherList = () => {
  const [batchCode, setBatchCode] = useState('');
  const [reference, setReference] = useState('');
  const [fromDate, setFromDate] = useState('09 Feb 2025');
  const [toDate, setToDate] = useState('16 Feb 2026');

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Voucher</span> / Batch Voucher List
        </div>

        {/* Filter Card */}
        <div className="bg-card border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Voucher List</h2>
            <Button variant="ghost" size="icon"><X size={18} /></Button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold">Batch Code</Label>
                <Input value={batchCode} onChange={e => setBatchCode(e.target.value)} placeholder="Enter Code" />
              </div>
              <div>
                <Label className="text-sm font-semibold">User</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold">Reference</Label>
                <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="Enter Reference" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold">From Date <span className="text-destructive">*</span></Label>
                <Input value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm font-semibold">To Date <span className="text-destructive">*</span></Label>
                <Input value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="destructive">Clear</Button>
              <Button>Submit</Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="destructive" className="gap-2"><Trash2 size={16} /> Delete</Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90"><Mail size={16} /> Post</Button>
        </div>

        {/* Results Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <TableWithSearch>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-primary-foreground text-center w-12">SL</TableHead>
                <TableHead className="text-primary-foreground text-center">Batch Number ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Additional Notes ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Total Amount ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Entry By ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Entry Date ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Reference ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">No Of Txn ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Unposted ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Posted ↕</TableHead>
                <TableHead className="text-primary-foreground text-center">Attachment</TableHead>
                <TableHead className="text-primary-foreground text-center w-12">
                  <div className="flex items-center gap-1 justify-center">
                    <Checkbox id="selectAll" />
                    <span>All</span>
                  </div>
                </TableHead>
                <TableHead className="text-primary-foreground text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyRows.map((r, i) => (
                <TableRow key={r.sl} className={i % 2 === 1 ? 'bg-muted/30' : ''}>
                  <TableCell className="text-center">{r.sl}</TableCell>
                  <TableCell className="font-medium">{r.batchNumber}</TableCell>
                  <TableCell>{r.notes}</TableCell>
                  <TableCell className="text-right">{r.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{r.entryBy}</TableCell>
                  <TableCell>{r.entryDate}</TableCell>
                  <TableCell>{r.reference}</TableCell>
                  <TableCell className="text-center">{r.noOfTxn}</TableCell>
                  <TableCell className="text-center">{r.unposted}</TableCell>
                  <TableCell className="text-center">{r.posted}</TableCell>
                  <TableCell className="text-center">
                    {r.attachment ? <Paperclip className="h-4 w-4 inline text-primary" /> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4 text-primary" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWithSearch>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BatchVoucherList;
