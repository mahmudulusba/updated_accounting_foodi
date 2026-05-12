import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Search, RotateCcw, Download } from 'lucide-react';

interface TxnRow {
  itemNumber: string;
  itemGroup: string;
  location: string;
  txnType: string;
  txnDate: string;
  qty: number;
  rate: number;
  amount: number;
}

const dummy: TxnRow[] = [
  { itemNumber: '100015593_BD', itemGroup: 'MERCH', location: 'DHAKA', txnType: 'Receipt', txnDate: '2026-02-12', qty: 200, rate: 1500, amount: 300000 },
  { itemNumber: '100016725_BD', itemGroup: 'MERCH', location: 'DHAKA', txnType: 'Issue', txnDate: '2026-03-01', qty: -50, rate: 2000, amount: -100000 },
  { itemNumber: '100016725_BD', itemGroup: 'MERCH', location: 'CTG', txnType: 'Transfer', txnDate: '2026-03-15', qty: 25, rate: 2000, amount: 50000 },
  { itemNumber: '100017161_BD', itemGroup: 'MERCH', location: 'DHAKA', txnType: 'Adjustment', txnDate: '2026-04-02', qty: -2, rate: 3500, amount: -7000 },
];

export default function InventoryTransactionReport() {
  const [itemFilter, setItemFilter] = useState('');
  const [txnType, setTxnType] = useState('all');
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-04-30');
  const [show, setShow] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Inventory Transaction Report</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Item Number</Label>
                <Input value={itemFilter} onChange={(e) => setItemFilter(e.target.value)} placeholder="Search by item" />
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={txnType} onValueChange={setTxnType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <Label>To</Label>
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
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Number</TableHead>
                    <TableHead>Item Group</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Transaction Date</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummy.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.itemNumber}</TableCell>
                      <TableCell>{r.itemGroup}</TableCell>
                      <TableCell>{r.location}</TableCell>
                      <TableCell>{r.txnType}</TableCell>
                      <TableCell>{r.txnDate}</TableCell>
                      <TableCell className="text-right">{r.qty}</TableCell>
                      <TableCell className="text-right">{r.rate.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.amount.toLocaleString()}</TableCell>
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