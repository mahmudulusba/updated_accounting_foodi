import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Save, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const SERVICES = ['Foodi', 'Foodi Mart', 'Parcel', 'Shop'];
const PARENT_GLS = [
  '4000 - Sales Revenue',
  '4100 - Service Revenue',
  '5000 - Cost of Goods Sold',
  '6000 - Operating Expense',
  '1200 - Accounts Receivable',
  '2100 - Accounts Payable',
];

interface Row {
  id: number;
  service: string;
  parentGL: string;
}

const initial: Row[] = [
  { id: 1, service: 'Foodi', parentGL: '4000 - Sales Revenue' },
  { id: 2, service: 'Foodi Mart', parentGL: '4100 - Service Revenue' },
  { id: 3, service: 'Parcel', parentGL: '6000 - Operating Expense' },
];

export default function ServiceParentGLMapping() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [service, setService] = useState('');
  const [parentGL, setParentGL] = useState('');

  const save = () => {
    if (!service || !parentGL) { toast.error('Service Name and Parent GL are required'); return; }
    setRows(r => [...r, { id: Date.now(), service, parentGL }]);
    setService(''); setParentGL('');
    toast.success('Mapping saved');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1200px] mx-auto space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-xl">Service wise Parent GL Mapping</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label>Service Name <span className="text-destructive">*</span></Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                  <SelectContent>{SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent GL <span className="text-destructive">*</span></Label>
                <Select value={parentGL} onValueChange={setParentGL}>
                  <SelectTrigger><SelectValue placeholder="Select Parent GL" /></SelectTrigger>
                  <SelectContent>{PARENT_GLS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Mapping List</CardTitle></CardHeader>
          <CardContent>
            <TableWithSearch className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="border">SL</TableHead>
                  <TableHead className="border">Service Name</TableHead>
                  <TableHead className="border">Parent GL</TableHead>
                  <TableHead className="border text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell className="border">{i + 1}</TableCell>
                    <TableCell className="border">{r.service}</TableCell>
                    <TableCell className="border">{r.parentGL}</TableCell>
                    <TableCell className="border">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info('Edit ' + r.service)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setRows(rs => rs.filter(x => x.id !== r.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
