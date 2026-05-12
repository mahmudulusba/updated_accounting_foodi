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

interface InvRow {
  itemNumber: string;
  itemGroup: string;
  productName: string;
  unit: string;
  location: string;
  serialNumber: string;
  inventoryOwner: string;
  inventoryStatus: string;
  onHandQty: number;
  onHandValue: number;
  invValueQty: number;
  invValue: number;
  avgUnitCost: number;
  p1Qty: number; p1Amt: number;
  p2Qty: number; p2Amt: number;
  p3Qty: number; p3Amt: number;
  p4Qty: number; p4Amt: number;
  p5Qty: number; p5Amt: number;
}

const dummy: InvRow[] = [
  { itemNumber: '100029682_BD', itemGroup: 'Fashion', productName: 'Cabin Bag', unit: 'ea', location: 'DHAKA', serialNumber: '1013856646', inventoryOwner: 'USB', inventoryStatus: 'Available', onHandQty: 100, onHandValue: 250000, invValueQty: 100, invValue: 250000, avgUnitCost: 2500, p1Qty: 60, p1Amt: 150000, p2Qty: 25, p2Amt: 62500, p3Qty: 10, p3Amt: 25000, p4Qty: 3, p4Amt: 7500, p5Qty: 2, p5Amt: 5000 },
  { itemNumber: '100029878_BD', itemGroup: 'Fashion', productName: 'Reusable Bag', unit: 'ea', location: 'DHAKA', serialNumber: '1013858919', inventoryOwner: 'USB', inventoryStatus: 'Available', onHandQty: 200, onHandValue: 80000, invValueQty: 200, invValue: 80000, avgUnitCost: 400, p1Qty: 120, p1Amt: 48000, p2Qty: 50, p2Amt: 20000, p3Qty: 20, p3Amt: 8000, p4Qty: 7, p4Amt: 2800, p5Qty: 3, p5Amt: 1200 },
  { itemNumber: '100030402_BD', itemGroup: 'Fashion', productName: 'Carry-On', unit: 'ea', location: 'CTG', serialNumber: '1013858365', inventoryOwner: 'USB', inventoryStatus: 'Reserved', onHandQty: 50, onHandValue: 175000, invValueQty: 50, invValue: 175000, avgUnitCost: 3500, p1Qty: 30, p1Amt: 105000, p2Qty: 12, p2Amt: 42000, p3Qty: 5, p3Amt: 17500, p4Qty: 2, p4Amt: 7000, p5Qty: 1, p5Amt: 3500 },
];

export default function InventoryAgingReport() {
  const [invType, setInvType] = useState('subsidiary');
  const [agingAsOf, setAgingAsOf] = useState('today');
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-04-30');
  const [show, setShow] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Inventory Aging Report</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-sm font-semibold text-muted-foreground">Inventory Aging Report Filtering Criteria</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Inventory Type<span className="text-destructive">*</span></Label>
                <RadioGroup value={invType} onValueChange={setInvType} className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2"><RadioGroupItem value="parent" id="inv-p" /><label htmlFor="inv-p">Parent</label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="subsidiary" id="inv-s" /><label htmlFor="inv-s">Subsidiary</label></div>
                </RadioGroup>
              </div>
              <div>
                <Label>Aging as of<span className="text-destructive">*</span></Label>
                <Select value={agingAsOf} onValueChange={setAgingAsOf}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="receipt_date">Receipt Date</SelectItem>
                    <SelectItem value="last_movement">Last Movement</SelectItem>
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
              <div className="text-base font-semibold mb-3">Inventory Ageing Report</div>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Number</TableHead>
                    <TableHead>Item Group</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">On-hand Qty</TableHead>
                    <TableHead className="text-right">On-hand Value</TableHead>
                    <TableHead className="text-right">Inv Value Qty</TableHead>
                    <TableHead className="text-right">Inv Value</TableHead>
                    <TableHead className="text-right">Avg Unit Cost</TableHead>
                    <TableHead className="text-right">0-90 Qty</TableHead>
                    <TableHead className="text-right">0-90 Amt</TableHead>
                    <TableHead className="text-right">91-180 Qty</TableHead>
                    <TableHead className="text-right">91-180 Amt</TableHead>
                    <TableHead className="text-right">181-365 Qty</TableHead>
                    <TableHead className="text-right">181-365 Amt</TableHead>
                    <TableHead className="text-right">366+ Qty</TableHead>
                    <TableHead className="text-right">366+ Amt</TableHead>
                    <TableHead className="text-right">Prior Qty</TableHead>
                    <TableHead className="text-right">Prior Amt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummy.map(r => (
                    <TableRow key={r.itemNumber}>
                      <TableCell>{r.itemNumber}</TableCell>
                      <TableCell>{r.itemGroup}</TableCell>
                      <TableCell>{r.productName}</TableCell>
                      <TableCell>{r.unit}</TableCell>
                      <TableCell>{r.location}</TableCell>
                      <TableCell>{r.serialNumber}</TableCell>
                      <TableCell>{r.inventoryOwner}</TableCell>
                      <TableCell>{r.inventoryStatus}</TableCell>
                      <TableCell className="text-right">{r.onHandQty}</TableCell>
                      <TableCell className="text-right">{r.onHandValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.invValueQty}</TableCell>
                      <TableCell className="text-right">{r.invValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.avgUnitCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.p1Qty}</TableCell>
                      <TableCell className="text-right">{r.p1Amt.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.p2Qty}</TableCell>
                      <TableCell className="text-right">{r.p2Amt.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.p3Qty}</TableCell>
                      <TableCell className="text-right">{r.p3Amt.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.p4Qty}</TableCell>
                      <TableCell className="text-right">{r.p4Amt.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.p5Qty}</TableCell>
                      <TableCell className="text-right">{r.p5Amt.toLocaleString()}</TableCell>
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