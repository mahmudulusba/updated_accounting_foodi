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
import { Plus, ArrowLeft, Pencil, Eye, Search, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

const defaultRecords = [
  { id: '1', assetId: 'AST-001', assetName: 'Dell Desktop', category: 'IT Equipment', assignTo: 'Farzana Islam', maintenanceId: 'MNT-001', maintenanceDate: '2025-08-10', reason: 'Routine check', status: 'Active' },
  { id: '2', assetId: 'AST-005', assetName: 'Company Vehicle', category: 'Vehicles', assignTo: 'Driver Pool', maintenanceId: 'MNT-002', maintenanceDate: '2025-09-20', reason: 'Engine service', status: 'Inactive' },
];

export default function AssetMaintenance() {
  const [view, setView] = useState<'list' | 'form'>('list');

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Maintenance List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Add Maintenance</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Asset ID</Label><Input /></div>
                <div><Label>Maintenance Date From</Label><Input type="date" /></div>
                <div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
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
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assign To</TableHead>
                    <TableHead>Maintenance ID</TableHead>
                    <TableHead>Maintenance Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultRecords.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono">{r.assetId}</TableCell>
                      <TableCell>{r.assetName}</TableCell>
                      <TableCell>{r.category}</TableCell>
                      <TableCell>{r.assignTo}</TableCell>
                      <TableCell className="font-mono">{r.maintenanceId}</TableCell>
                      <TableCell>{r.maintenanceDate}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell><Badge variant={r.status === 'Active' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Pencil size={14} /></Button>
                          <Button variant="ghost" size="icon"><Eye size={14} /></Button>
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
            <h1 className="text-2xl font-bold text-foreground">Asset Maintenance Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Asset Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Asset Category *</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="it">IT Equipment</SelectItem><SelectItem value="vehicle">Vehicles</SelectItem><SelectItem value="furniture">Furniture</SelectItem></SelectContent></Select></div>
                <div><Label>Asset ID *</Label><Input /></div>
                <div><Label>Asset Name</Label><Input disabled /></div>
                <div><Label>Location</Label><Input disabled /></div>
                <div><Label>Department</Label><Input disabled /></div>
                <div><Label>Assigned User</Label><Input disabled /></div>
                <div><Label>Maintenance Request ID *</Label><Input disabled placeholder="System generated" /></div>
                <div><Label>Work Order No *</Label><Input /></div>
                <div><Label>Maintenance Type</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="preventive">Preventive</SelectItem><SelectItem value="corrective">Corrective</SelectItem><SelectItem value="breakdown">Breakdown</SelectItem></SelectContent></Select></div>
                <div><Label>Issue Reported</Label><Input /></div>
                <div><Label>Work Order Status</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in-progress">In-progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select></div>
                <div><Label>Scheduled Date</Label><Input type="date" /></div>
                <div><Label>Maintenance Date</Label><Input type="date" /></div>
                <div><Label>Completion Date</Label><Input type="date" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Costs & Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Downtime (Hours/Days)</Label><Input /></div>
                <div><Label>Service Vendor</Label><Input /></div>
                <div><Label>Technician Name</Label><Input /></div>
                <div><Label>Estimated Cost</Label><Input type="number" /></div>
                <div><Label>Actual Cost</Label><Input type="number" /></div>
                <div><Label>Spare Parts Cost</Label><Input type="number" /></div>
                <div><Label>Total Maintenance Cost</Label><Input type="number" disabled placeholder="Auto-calculated" /></div>
                <div><Label>Warranty Status</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="in-warranty">In Warranty</SelectItem><SelectItem value="out-warranty">Out of Warranty</SelectItem></SelectContent></Select></div>
                <div><Label>Next Scheduled Date</Label><Input type="date" /></div>
                <div><Label>Requested By</Label><Input /></div>
                <div><Label>Approved By</Label><Input /></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Label>Maintenance Reason</Label>
              <Textarea className="mt-2" />
            </CardContent>
          </Card>
          <div className="flex gap-2"><Button onClick={() => { toast.success('Maintenance record saved'); setView('list'); }}>Submit</Button><Button variant="outline">Clear</Button></div>
        </div>
      )}
    </DashboardLayout>
  );
}
