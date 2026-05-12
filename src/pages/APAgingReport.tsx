import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Search, RotateCcw, Download } from 'lucide-react';

interface APRow {
  accountNo: string;
  name: string;
  vendorGroup: string;
  balance: number;
  d0_30: number;
  d31_60: number;
  d61_90: number;
  d91_181: number;
  d182_365: number;
  d366_730: number;
  d731_1095: number;
  d1095p: number;
}

const dummy: APRow[] = [
  { accountNo: 'V001', name: 'ABC Suppliers Ltd.', vendorGroup: 'Local', balance: 250000, d0_30: 100000, d31_60: 80000, d61_90: 40000, d91_181: 30000, d182_365: 0, d366_730: 0, d731_1095: 0, d1095p: 0 },
  { accountNo: 'V002', name: 'Global Aviation Co.', vendorGroup: 'Foreign', balance: 540000, d0_30: 200000, d31_60: 150000, d61_90: 90000, d91_181: 60000, d182_365: 40000, d366_730: 0, d731_1095: 0, d1095p: 0 },
  { accountNo: 'V003', name: 'City Fuel Services', vendorGroup: 'Local', balance: 180000, d0_30: 80000, d31_60: 50000, d61_90: 30000, d91_181: 20000, d182_365: 0, d366_730: 0, d731_1095: 0, d1095p: 0 },
];

export default function APAgingReport() {
  const [apName, setApName] = useState('subsidiary');
  const [agingAsOf, setAgingAsOf] = useState('today');
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-04-30');
  const [show, setShow] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">AP Aging Report</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-sm font-semibold text-muted-foreground">AP Aging Report Filtering Criteria</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>AP Name<span className="text-destructive">*</span></Label>
                <RadioGroup value={apName} onValueChange={setApName} className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2"><RadioGroupItem value="parent" id="ap-p" /><label htmlFor="ap-p">Parent</label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="subsidiary" id="ap-s" /><label htmlFor="ap-s">Subsidiary</label></div>
                </RadioGroup>
              </div>
              <div>
                <Label>Aging as of<span className="text-destructive">*</span></Label>
                <Select value={agingAsOf} onValueChange={setAgingAsOf}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="invoice_date">Invoice Date</SelectItem>
                    <SelectItem value="due_date">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From<span className="text-destructive">*</span></Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <Label>To<span className="text-destructive">*</span></Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShow(true)} className="gap-2"><Search size={14} /> Search</Button>
              <Button variant="outline" onClick={() => setShow(false)} className="gap-2"><RotateCcw size={14} /> Reset</Button>
              <Button variant="outline" className="gap-2 ml-auto"><Download size={14} /> Export</Button>
            </div>
          </CardContent>
        </Card>

        {show && (
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <div className="text-base font-semibold mb-3">AP Aging Report (LCY)</div>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vendor Group</TableHead>
                    <TableHead className="text-right">Balance As Of</TableHead>
                    <TableHead className="text-right">0-30</TableHead>
                    <TableHead className="text-right">31-60</TableHead>
                    <TableHead className="text-right">61-90</TableHead>
                    <TableHead className="text-right">91-181</TableHead>
                    <TableHead className="text-right">182-365</TableHead>
                    <TableHead className="text-right">366-730</TableHead>
                    <TableHead className="text-right">731-1095</TableHead>
                    <TableHead className="text-right">1095+</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummy.map(r => (
                    <TableRow key={r.accountNo}>
                      <TableCell>{r.accountNo}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.vendorGroup}</TableCell>
                      <TableCell className="text-right">{r.balance.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d0_30.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d31_60.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d61_90.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d91_181.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d182_365.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d366_730.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d731_1095.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.d1095p.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}