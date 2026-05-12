import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  workEmail: string;
  mobile: string;
  lineManager: string;
  currentWorkLocation: string;
  status: 'Active' | 'Inactive';
}

const defaultEmployees: Employee[] = [
  { id: '1', employeeId: 'EMP-001', name: 'Farzana Islam', designation: 'Sr. Accountant', department: 'Finance', workEmail: 'farzana@foodi.com', mobile: '+8801711000001', lineManager: 'Md. Mahmudul Hasan', currentWorkLocation: 'Dhaka HQ', status: 'Active' },
  { id: '2', employeeId: 'EMP-002', name: 'Md. Mahmudul Hasan', designation: 'IT Manager', department: 'IT', workEmail: 'hasan.mahmudul@foodi.com', mobile: '+8801711000002', lineManager: 'Farzana Islam', currentWorkLocation: 'Dhaka HQ', status: 'Active' },
  { id: '3', employeeId: 'EMP-003', name: 'Farzana Islam', designation: 'Operations Lead', department: 'Operations', workEmail: 'farzana@foodi.com', mobile: '+6591234567', lineManager: 'Md. Mahmudul Hasan', currentWorkLocation: 'Singapore', status: 'Active' },
];

export default function EmployeeDirectory() {
  const [employees] = useState<Employee[]>(defaultEmployees);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Employee Directory</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success('Synced from HR system')}><RefreshCw size={14} className="mr-1" /> Sync from HR</Button>
            <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
            <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
          </div>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          Employee records are read-only — data is synchronized from the HR system via API or data upload.
        </div>
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Work Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Line Manager</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono">{emp.employeeId}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.workEmail}</TableCell>
                    <TableCell>{emp.mobile}</TableCell>
                    <TableCell>{emp.lineManager}</TableCell>
                    <TableCell>{emp.currentWorkLocation}</TableCell>
                    <TableCell><Badge variant={emp.status === 'Active' ? 'default' : 'secondary'}>{emp.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="icon" title="View"><Eye size={14} /></Button></TableCell>
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
