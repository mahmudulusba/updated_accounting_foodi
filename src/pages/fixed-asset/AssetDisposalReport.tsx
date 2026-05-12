import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search } from 'lucide-react';

const reportData = [
  { sl: 1, assetId: 'AST-010', assetName: 'Old Printer', category: 'IT Equipment', disposalType: 'Scrapped', disposalDate: '2025-06-15', purchaseCost: 25000, accDep: 25000, nbv: 0, saleAmount: 0, gainLoss: 0, location: 'Dhaka HQ', approvedBy: 'Admin', voucherNo: 'DSP-001', remarks: 'Obsolete' },
  { sl: 2, assetId: 'AST-015', assetName: 'Company Car', category: 'Vehicles', disposalType: 'Sold', disposalDate: '2025-09-20', purchaseCost: 3500000, accDep: 2100000, nbv: 1400000, saleAmount: 1600000, gainLoss: 200000, location: 'Dhaka', approvedBy: 'CFO', voucherNo: 'DSP-002', remarks: 'Replaced with new vehicle' },
];

export default function AssetDisposalReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Disposal & Retirement Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div><Label>Asset Category</Label><Input /></div>
              <div><Label>Disposal Type</Label><Input /></div>
              <div><Label>Date From</Label><Input type="date" /></div>
              <div><Label>Date To</Label><Input type="date" /></div>
            </div>
            <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purchase Cost</TableHead>
                  <TableHead>Acc. Dep.</TableHead>
                  <TableHead>NBV</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Voucher No</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map(r => (
                  <TableRow key={r.sl}>
                    <TableCell>{r.sl}</TableCell>
                    <TableCell className="font-mono">{r.assetId}</TableCell>
                    <TableCell>{r.assetName}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.disposalType}</TableCell>
                    <TableCell>{r.disposalDate}</TableCell>
                    <TableCell className="text-right">{r.purchaseCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.accDep.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.nbv.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.saleAmount.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-medium ${r.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{r.gainLoss.toLocaleString()}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.approvedBy}</TableCell>
                    <TableCell className="font-mono">{r.voucherNo}</TableCell>
                    <TableCell>{r.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
