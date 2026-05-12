import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Eye, Search, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

const defaultTransfers = [
  { id: '1', assetName: 'Dell Desktop', serialNo: '6YR7Q03', fromEmployee: 'Farzana Islam', toEmployee: 'Md. Mahmudul Hasan', transferDate: '2025-07-01', createdInfo: '01 Jul 2025' },
  { id: '2', assetName: 'HP Laptop', serialNo: 'HP-9812', fromEmployee: 'Md. Mahmudul Hasan', toEmployee: 'Farzana Islam', transferDate: '2025-08-15', createdInfo: '15 Aug 2025' },
];

export default function AssetTransfer() {
  const [view, setView] = useState<'list' | 'form'>('list');

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Transfer List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Transfer Asset</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Asset Serial Number</Label><Input /></div>
                <div><Label>Employee Name</Label><Input /></div>
                <div><Label>Transfer Date</Label><Input type="date" /></div>
              </div>
              <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Asset Serial No</TableHead>
                    <TableHead>From (Employee)</TableHead>
                    <TableHead>To (Employee)</TableHead>
                    <TableHead>Transfer Date</TableHead>
                    <TableHead>Created Info</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultTransfers.map((t, i) => (
                    <TableRow key={t.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{t.assetName}</TableCell>
                      <TableCell className="font-mono">{t.serialNo}</TableCell>
                      <TableCell>{t.fromEmployee}</TableCell>
                      <TableCell>{t.toEmployee}</TableCell>
                      <TableCell>{t.transferDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.createdInfo}</TableCell>
                      <TableCell><Button variant="ghost" size="icon"><Eye size={14} /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Transfer Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div><Label>Transfer ID</Label><Input disabled placeholder="Auto-generated" /></div>
                <div><Label>Asset Code</Label><Input placeholder="Searchable Dropdown" /></div>
                <div><Label>Asset Name</Label><Input disabled /></div>
                <div><Label>Asset Serial Number</Label><Input disabled /></div>
                <div><Label>Asset Category</Label><Input disabled /></div>
                <div><Label>Asset Sub Category</Label><Input disabled /></div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <Card className="border-dashed">
                  <CardHeader><CardTitle className="text-base">From</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Employee Name</Label><Input disabled placeholder="View Only" /></div>
                    <div><Label>Employee ID</Label><Input disabled placeholder="View Only" /></div>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardHeader><CardTitle className="text-base">To</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Employee Name</Label><Input placeholder="Searchable Dropdown" /></div>
                    <div><Label>Employee ID</Label><Input placeholder="Searchable Dropdown" /></div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div><Label>Transfer Date</Label><Input type="date" /></div>
              </div>
              <div className="mt-4"><Label>Remarks</Label><Textarea /></div>
              <div className="flex gap-2 mt-6"><Button onClick={() => { toast.success('Transfer recorded'); setView('list'); }}>Submit</Button><Button variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
