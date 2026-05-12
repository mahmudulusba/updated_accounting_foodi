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

interface ARRow {
  lineOfBusiness: string;
  customerId: string;
  customerName: string;
  customerGroup: string;
  total: number;
  withinCredit: number;
  past1to3: number;
  past4to6: number;
  pastOver6: number;
  collectionPlan: string;
  proportionOverdue: string;
}

const dummy: ARRow[] = [
  { lineOfBusiness: 'Domestic', customerId: 'C001', customerName: 'Sky Foods', customerGroup: 'Agency', total: 850000, withinCredit: 400000, past1to3: 250000, past4to6: 150000, pastOver6: 50000, collectionPlan: 'Follow up via email', proportionOverdue: '23.5%' },
  { lineOfBusiness: 'International', customerId: 'C002', customerName: 'Global Foods', customerGroup: 'Corporate', total: 1240000, withinCredit: 600000, past1to3: 350000, past4to6: 200000, pastOver6: 90000, collectionPlan: 'Legal notice issued', proportionOverdue: '23.4%' },
  { lineOfBusiness: 'Cargo', customerId: 'C003', customerName: 'Express Logistics', customerGroup: 'B2B', total: 480000, withinCredit: 280000, past1to3: 120000, past4to6: 60000, pastOver6: 20000, collectionPlan: 'Phone follow-up scheduled', proportionOverdue: '16.7%' },
];

export default function ARAgingReport() {
  const [arName, setArName] = useState('subsidiary');
  const [agingAsOf, setAgingAsOf] = useState('today');
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-04-30');
  const [show, setShow] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">AR Aging Report</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-sm font-semibold text-muted-foreground">AR Aging Report Filtering Criteria</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>AR Name<span className="text-destructive">*</span></Label>
                <RadioGroup value={arName} onValueChange={setArName} className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2"><RadioGroupItem value="parent" id="ar-p" /><label htmlFor="ar-p">Parent</label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="subsidiary" id="ar-s" /><label htmlFor="ar-s">Subsidiary</label></div>
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
              <div className="text-base font-semibold mb-3">AR Aging Report</div>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={4} className="text-center bg-muted">Basic Information</TableHead>
                    <TableHead colSpan={5} className="text-center bg-muted">Aging Information</TableHead>
                    <TableHead colSpan={2} className="text-center bg-muted">Long Aging</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead>Line of business</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Customer Group</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Within Credit Period</TableHead>
                    <TableHead className="text-right">Past Due 1-3 Months</TableHead>
                    <TableHead className="text-right">Past Due 4-6 Months</TableHead>
                    <TableHead className="text-right">Past Due Over 6 Months</TableHead>
                    <TableHead>Collection Plan (AR &gt; 180 days)</TableHead>
                    <TableHead className="text-right">Proportion Overdue &gt; 3 Months</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummy.map(r => (
                    <TableRow key={r.customerId}>
                      <TableCell>{r.lineOfBusiness}</TableCell>
                      <TableCell>{r.customerId}</TableCell>
                      <TableCell>{r.customerName}</TableCell>
                      <TableCell>{r.customerGroup}</TableCell>
                      <TableCell className="text-right">{r.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.withinCredit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.past1to3.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.past4to6.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.pastOver6.toLocaleString()}</TableCell>
                      <TableCell>{r.collectionPlan}</TableCell>
                      <TableCell className="text-right">{r.proportionOverdue}</TableCell>
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