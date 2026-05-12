import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';

const reportData = [
  { sl: 1, assetId: 'AST-001', assetName: 'Dell Desktop', category: 'IT Equipment', location: 'Dhaka HQ', department: 'Finance', assignedUser: 'Farzana Islam', requestId: 'MNT-001', workOrderNo: 'WO-0045', maintenanceType: 'Preventive', issue: 'Routine check', woStatus: 'Completed', scheduledDate: '2025-08-01', maintenanceDate: '2025-08-10', completionDate: '2025-08-10', downtime: '4 hours', vendor: 'TechCare Ltd', technician: 'Rahim', estimatedCost: 5000, actualCost: 4500, sparesCost: 500, totalCost: 5000, warranty: 'Out of Warranty', nextDate: '2026-02-10', remarks: 'All good', requestedBy: 'Farzana Islam', approvedBy: 'Admin' },
];

export default function AssetMaintenanceReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Maintenance Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filtering Criteria</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div><Label>Asset Category</Label><Input /></div>
              <div><Label>Asset Name</Label><Input /></div>
              <div><Label>Maintenance Type</Label><Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="preventive">Preventive</SelectItem><SelectItem value="corrective">Corrective</SelectItem><SelectItem value="breakdown">Breakdown</SelectItem></SelectContent></Select></div>
              <div><Label>Assigned To</Label><Input /></div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
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
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>WO Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Maintenance Date</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Downtime</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Actual Cost</TableHead>
                  <TableHead>Spares</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Next Date</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Approved By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map(r => (
                  <TableRow key={r.sl}>
                    <TableCell>{r.sl}</TableCell>
                    <TableCell className="font-mono">{r.assetId}</TableCell>
                    <TableCell>{r.assetName}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>{r.assignedUser}</TableCell>
                    <TableCell className="font-mono">{r.requestId}</TableCell>
                    <TableCell className="font-mono">{r.workOrderNo}</TableCell>
                    <TableCell>{r.maintenanceType}</TableCell>
                    <TableCell>{r.issue}</TableCell>
                    <TableCell><Badge variant="default">{r.woStatus}</Badge></TableCell>
                    <TableCell>{r.scheduledDate}</TableCell>
                    <TableCell>{r.maintenanceDate}</TableCell>
                    <TableCell>{r.completionDate}</TableCell>
                    <TableCell>{r.downtime}</TableCell>
                    <TableCell>{r.vendor}</TableCell>
                    <TableCell>{r.technician}</TableCell>
                    <TableCell className="text-right">{r.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.actualCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.sparesCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{r.totalCost.toLocaleString()}</TableCell>
                    <TableCell>{r.warranty}</TableCell>
                    <TableCell>{r.nextDate}</TableCell>
                    <TableCell>{r.remarks}</TableCell>
                    <TableCell>{r.requestedBy}</TableCell>
                    <TableCell>{r.approvedBy}</TableCell>
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
