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
  { sn: 1, assetName: 'Desktop', glName: 'Laptop & Desktop', parentGL: 'IT Equipment', assetId: 'AST-001', qty: 1, costPerUnit: 55400, basePrice: 55400, paymentMode: 'Cash', acquisitionDate: '14-02-2021', supplier: 'Daffodil Computers', brand: 'Dell', model: 'DELL VOSTRO 3671MT', serialNumber: '6YR7Q03', depRate: '25%', accDep: 55400, wdv: 0 },
  { sn: 2, assetName: 'Desktop', glName: 'Laptop & Desktop', parentGL: 'IT Equipment', assetId: 'AST-002', qty: 1, costPerUnit: 55400, basePrice: 55400, paymentMode: 'Cash', acquisitionDate: '14-02-2021', supplier: 'Daffodil Computers', brand: 'Dell', model: 'DELL VOSTRO 3671MT', serialNumber: '6ZM8Q03', depRate: '25%', accDep: 55400, wdv: 0 },
];

export default function AssetDetailsReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Details Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div><Label>Asset Category</Label><Input /></div>
              <div><Label>Asset Name</Label><Input /></div>
              <div><Label>Location</Label><Input /></div>
              <div><Label>Status</Label><Input /></div>
            </div>
            <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead>SN#</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>GL Name</TableHead>
                  <TableHead>Parent GL</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Acquisition Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Dep. Rate</TableHead>
                  <TableHead>Acc. Depreciation</TableHead>
                  <TableHead>WDV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map(r => (
                  <TableRow key={r.sn}>
                    <TableCell>{r.sn}</TableCell>
                    <TableCell>{r.assetName}</TableCell>
                    <TableCell>{r.glName}</TableCell>
                    <TableCell>{r.parentGL}</TableCell>
                    <TableCell className="font-mono">{r.assetId}</TableCell>
                    <TableCell>{r.qty}</TableCell>
                    <TableCell>{r.costPerUnit.toLocaleString()}</TableCell>
                    <TableCell>{r.basePrice.toLocaleString()}</TableCell>
                    <TableCell>{r.paymentMode}</TableCell>
                    <TableCell>{r.acquisitionDate}</TableCell>
                    <TableCell>{r.supplier}</TableCell>
                    <TableCell>{r.brand}</TableCell>
                    <TableCell className="text-xs">{r.model}</TableCell>
                    <TableCell className="font-mono">{r.serialNumber}</TableCell>
                    <TableCell>{r.depRate}</TableCell>
                    <TableCell>{r.accDep.toLocaleString()}</TableCell>
                    <TableCell>{r.wdv.toLocaleString()}</TableCell>
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
