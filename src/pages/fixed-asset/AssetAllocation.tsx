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

interface Allocation {
  id: string;
  employeeName: string;
  employeeId: string;
  assetName: string;
  assetSerialNumber: string;
  location: string;
  allocationDate: string;
  allocationUpTo: string;
  status: 'Allocated' | 'Not Allocated';
  createdInfo: string;
}

const defaultAllocations: Allocation[] = [
  { id: '1', employeeName: 'Farzana Islam', employeeId: 'EMP-001', assetName: 'Dell Vostro Desktop', assetSerialNumber: '6YR7Q03', location: 'Dhaka HQ - Floor 3', allocationDate: '2024-01-15', allocationUpTo: '2026-01-15', status: 'Allocated', createdInfo: '15 Jan 2024' },
  { id: '2', employeeName: 'Md. Mahmudul Hasan', employeeId: 'EMP-002', assetName: 'HP Laptop', assetSerialNumber: 'HP-9812', location: 'Dhaka HQ - IT Lab', allocationDate: '2024-03-01', allocationUpTo: '2026-03-01', status: 'Allocated', createdInfo: '01 Mar 2024' },
  { id: '3', employeeName: 'Farzana Islam', employeeId: 'EMP-003', assetName: 'Office Chair', assetSerialNumber: 'CHR-445', location: 'Singapore Office', allocationDate: '', allocationUpTo: '', status: 'Not Allocated', createdInfo: '' },
];

const employees = [
  { value: 'emp-001', label: 'Farzana Islam — EMP-001 (Sr. Accountant, Finance)' },
  { value: 'emp-002', label: 'Md. Mahmudul Hasan — EMP-002 (IT Manager, IT)' },
  { value: 'emp-003', label: 'Farzana Islam — EMP-003 (Operations Lead, Operations)' },
];

const assets = [
  { value: 'AST-001', label: 'AST-001 — Dell Vostro Desktop' },
  { value: 'AST-002', label: 'AST-002 — Office Desk' },
  { value: 'AST-003', label: 'AST-003 — ERP Software License' },
];

export default function AssetAllocation() {
  const [view, setView] = useState<'list' | 'form'>('list');

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Allocation List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Allocate</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Employee Name</Label><Input /></div>
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Location</Label><Input /></div>
                <div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="allocated">Allocated</SelectItem><SelectItem value="not-allocated">Not Allocated</SelectItem></SelectContent></Select></div>
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
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Allocation Date</TableHead>
                    <TableHead>Up To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultAllocations.map((a, i) => (
                    <TableRow key={a.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{a.employeeName}</TableCell>
                      <TableCell className="font-mono">{a.employeeId}</TableCell>
                      <TableCell>{a.assetName}</TableCell>
                      <TableCell className="font-mono">{a.assetSerialNumber}</TableCell>
                      <TableCell>{a.location}</TableCell>
                      <TableCell>{a.allocationDate}</TableCell>
                      <TableCell>{a.allocationUpTo}</TableCell>
                      <TableCell><Badge variant={a.status === 'Allocated' ? 'default' : 'secondary'}>{a.status}</Badge></TableCell>
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
            <h1 className="text-2xl font-bold text-foreground">Asset Allocation Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Allocate To (Employee)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Employee *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Search employee" /></SelectTrigger>
                    <SelectContent>{employees.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Designation</Label><Input disabled placeholder="Auto" /></div>
                  <div><Label>Department</Label><Input disabled placeholder="Auto" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Allocation Period & Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>From *</Label><Input type="date" /></div>
                  <div><Label>Up To</Label><Input type="date" /></div>
                </div>
                <div>
                  <Label>Asset Location *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka-hq">Dhaka HQ</SelectItem>
                      <SelectItem value="dhaka-floor-3">Dhaka HQ - Floor 3</SelectItem>
                      <SelectItem value="ctg-branch">Chittagong Branch</SelectItem>
                      <SelectItem value="sg-office">Singapore Office</SelectItem>
                      <SelectItem value="kl-office">Kuala Lumpur Office</SelectItem>
                      <SelectItem value="kol-branch">Kolkata Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Specific Location / Room</Label><Input placeholder="e.g. Room 305, Desk D-12" /></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Assets</CardTitle></CardHeader>
            <CardContent>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="min-w-[260px]"><SelectValue placeholder="Search asset" /></SelectTrigger>
                        <SelectContent>{assets.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input disabled placeholder="Auto" className="w-32" /></TableCell>
                    <TableCell><Input placeholder="Serial" className="w-36" /></TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="good">Good</SelectItem><SelectItem value="fair">Fair</SelectItem><SelectItem value="poor">Poor</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Remove</Button></TableCell>
                  </TableRow>
                </TableBody>
              </TableWithSearch>
              <Button variant="outline" size="sm" className="mt-3"><Plus size={14} className="mr-1" /> Add Asset</Button>
              <div className="mt-4"><Label>Remarks</Label><Textarea placeholder="Notes for handover" /></div>
              <div className="flex gap-2 mt-6"><Button onClick={() => { toast.success('Allocation saved'); setView('list'); }}>Submit</Button><Button variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
