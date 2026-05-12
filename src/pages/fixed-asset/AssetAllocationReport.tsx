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
  { sl: 1, assetId: 'AST-001', assetName: 'Dell Desktop', category: 'IT Equipment', assignedTo: 'Farzana Islam', department: 'Finance', location: 'Dhaka HQ - 3rd Floor', startDate: '2024-01-15', endDate: '2026-01-15', allocationType: 'Permanent', condition: 'Good', remarks: '' },
  { sl: 2, assetId: 'AST-002', assetName: 'HP Laptop', category: 'IT Equipment', assignedTo: 'Md. Mahmudul Hasan', department: 'IT', location: 'Dhaka HQ - 4th Floor', startDate: '2024-03-01', endDate: '', allocationType: 'Permanent', condition: 'Good', remarks: '' },
];

export default function AssetAllocationReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Allocation Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div><Label>Department</Label><Input /></div>
              <div><Label>Employee</Label><Input /></div>
              <div><Label>Asset Category</Label><Input /></div>
              <div><Label>Allocation Type</Label><Input /></div>
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
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
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
                    <TableCell>{r.assignedTo}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.startDate}</TableCell>
                    <TableCell>{r.endDate || '-'}</TableCell>
                    <TableCell>{r.allocationType}</TableCell>
                    <TableCell>{r.condition}</TableCell>
                    <TableCell>{r.remarks || '-'}</TableCell>
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
