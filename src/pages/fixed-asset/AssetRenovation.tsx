import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Pencil, Eye, Search, Download, Filter, FileText } from 'lucide-react';
import { toast } from 'sonner';

const defaultRenovations = [
  { id: '1', serialNo: 'BLD-001', assetName: 'Office Building', voucher: 'JV-RNV-2025-001', effectiveDate: '2025-03-15', currentTotalCost: 50000000, renovationCost: 2000000, costAfterRenovation: 52000000, status: 'Active', createdInfo: '15 Mar 2025' },
];

export default function AssetRenovation() {
  const [view, setView] = useState<'list' | 'form'>('list');

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Renovation List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Add Renovation</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Asset Serial Number</Label><Input /></div>
                <div><Label>Effective Date</Label><Input type="date" /></div>
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
                    <TableHead>Serial No</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Auto Voucher</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Current Cost</TableHead>
                    <TableHead>Renovation Cost</TableHead>
                    <TableHead>Cost After</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultRenovations.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono">{r.serialNo}</TableCell>
                      <TableCell>{r.assetName}</TableCell>
                      <TableCell className="font-mono text-primary">{r.voucher}</TableCell>
                      <TableCell>{r.effectiveDate}</TableCell>
                      <TableCell>{r.currentTotalCost.toLocaleString()}</TableCell>
                      <TableCell>{r.renovationCost.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">{r.costAfterRenovation.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="default">{r.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Eye size={14} /></Button>
                          <Button variant="ghost" size="icon"><Pencil size={14} /></Button>
                        </div>
                      </TableCell>
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
            <h1 className="text-2xl font-bold text-foreground">Asset Renovation Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div><Label>Asset Code *</Label><Input placeholder="Searchable Dropdown" /></div>
                <div><Label>Asset Serial Number *</Label><Input /></div>
                <div><Label>Asset Name</Label><Input disabled /></div>
                <div><Label>Asset Group</Label><Input disabled /></div>
                <div><Label>Asset Sub Group</Label><Input disabled /></div>
                <div><Label>Current Total Cost</Label><Input type="number" disabled /></div>
                <div><Label>Renovation Cost *</Label><Input type="number" /></div>
                <div><Label>Cost After Renovation</Label><Input type="number" disabled placeholder="Auto-calculated" /></div>
                <div><Label>Effective Date *</Label><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                <div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
              </div>
              <div className="mt-4"><Label>Remarks</Label><Textarea /></div>
              <div className="mt-4 flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-sm">
                <FileText size={16} className="mt-0.5 text-primary" />
                <div className="text-muted-foreground">
                  On submit, the system will automatically create a <span className="font-medium text-foreground">Journal Voucher in Unposted state</span> capitalising the renovation cost. You can review and post it from the Voucher List.
                </div>
              </div>
              <div className="flex gap-2 mt-6"><Button onClick={() => { toast.success('Renovation saved. Auto journal voucher created in Unposted state.'); setView('list'); }}>Submit & Create Voucher</Button><Button variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
