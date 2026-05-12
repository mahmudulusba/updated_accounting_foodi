import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Filter, Play, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const defaultRuns = [
  { id: '1', runId: 'DEP-RUN-2025-09', period: 'Sep 2025', runDate: '2025-10-01 02:00', method: 'Auto Scheduler', assetsProcessed: 142, totalDepreciation: 845000, status: 'Completed' },
  { id: '2', runId: 'DEP-RUN-2025-08', period: 'Aug 2025', runDate: '2025-09-01 02:00', method: 'Auto Scheduler', assetsProcessed: 138, totalDepreciation: 812400, status: 'Completed' },
  { id: '3', runId: 'DEP-RUN-2025-07', period: 'Jul 2025', runDate: '2025-08-01 02:00', method: 'Auto Scheduler', assetsProcessed: 136, totalDepreciation: 798200, status: 'Completed' },
];

export default function AssetDepreciation() {
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    toast.info('Scheduler started — depreciation is being calculated...');
    setTimeout(() => { setRunning(false); toast.success('Depreciation run completed successfully'); }, 1800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Depreciation & Amortization Scheduler</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
            <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
          </div>
        </div>

        {/* Scheduler Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Calendar size={16} /> Run Scheduler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Run Type *</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="adhoc">Ad-hoc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Period *</Label>
                <Input type="month" defaultValue="2025-10" />
              </div>
              <div>
                <Label>Asset Group (Optional)</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All Groups" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="it">IT Equipment</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="vehicle">Vehicles</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Posting Mode</Label>
                <Select defaultValue="unposted">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unposted">Create Unposted Voucher</SelectItem>
                    <SelectItem value="posted">Auto Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button onClick={handleRun} disabled={running}>
                <Play size={14} className="mr-2" /> {running ? 'Running…' : 'Run Now'}
              </Button>
              <Button variant="outline"><Calendar size={14} className="mr-2" /> Schedule</Button>
              <span className="text-xs text-muted-foreground">Next auto-run: 1st of next month, 02:00 AM</span>
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active Assets</div><div className="text-2xl font-bold">142</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Last Run</div><div className="text-2xl font-bold">Sep 2025</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Last Depreciation</div><div className="text-2xl font-bold">৳ 8.45 L</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Next Scheduled</div><div className="text-2xl font-bold">1 Nov 2025</div></CardContent></Card>
        </div>

        {/* Run History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Search Run History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Run ID</Label><Input /></div>
              <div><Label>Period</Label><Input type="month" /></div>
              <div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select></div>
            </div>
            <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Run History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Run Date/Time</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Assets Processed</TableHead>
                  <TableHead>Total Depreciation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaultRuns.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono">{r.runId}</TableCell>
                    <TableCell>{r.period}</TableCell>
                    <TableCell>{r.runDate}</TableCell>
                    <TableCell>{r.method}</TableCell>
                    <TableCell>{r.assetsProcessed}</TableCell>
                    <TableCell>৳ {r.totalDepreciation.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'Completed' ? 'default' : 'secondary'} className="gap-1">
                        {r.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {r.status}
                      </Badge>
                    </TableCell>
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
