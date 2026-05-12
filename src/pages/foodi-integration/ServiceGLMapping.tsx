import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Save, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const SERVICES = ['Foodi', 'Foodi Mart', 'Parcel', 'Shop'];
const GLS = [
  '4001 - Food Sales',
  '4002 - Mart Sales',
  '4003 - Parcel Income',
  '4004 - Shop Sales',
  '5001 - Food COGS',
  '6001 - Delivery Cost',
  '6002 - Packaging Cost',
  '2105 - VAT Payable',
];

interface Line {
  id: number;
  component: string;
  gl: string;
}

export default function ServiceGLMapping() {
  const [service, setService] = useState('');
  const [lines, setLines] = useState<Line[]>([{ id: 1, component: '', gl: '' }]);

  const addLine = () => setLines(l => [...l, { id: Date.now(), component: '', gl: '' }]);
  const removeLine = (id: number) => setLines(l => l.length > 1 ? l.filter(x => x.id !== id) : l);
  const updateLine = (id: number, key: keyof Line, val: string) =>
    setLines(l => l.map(x => x.id === id ? { ...x, [key]: val } : x));

  const save = () => {
    if (!service) { toast.error('Service Name is required'); return; }
    if (lines.some(l => !l.component || !l.gl)) { toast.error('Component and GL are required for all rows'); return; }
    toast.success('Service wise GL mapping saved');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1200px] mx-auto space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-xl">Service wise GL Mapping</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Service Name <span className="text-destructive">*</span></Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                  <SelectContent>{SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Service Components & GL Mapping</Label>
                <Button size="sm" variant="outline" onClick={addLine}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
              </div>
              <TableWithSearch className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border w-12">SL</TableHead>
                    <TableHead className="border">Service wise Component <span className="text-destructive">*</span></TableHead>
                    <TableHead className="border">GL <span className="text-destructive">*</span></TableHead>
                    <TableHead className="border w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l, i) => (
                    <TableRow key={l.id}>
                      <TableCell className="border">{i + 1}</TableCell>
                      <TableCell className="border">
                        <Input placeholder="Enter component name"
                          value={l.component}
                          onChange={e => updateLine(l.id, 'component', e.target.value)} />
                      </TableCell>
                      <TableCell className="border">
                        <Select value={l.gl} onValueChange={v => updateLine(l.id, 'gl', v)}>
                          <SelectTrigger><SelectValue placeholder="Select GL" /></SelectTrigger>
                          <SelectContent>{GLS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="border">
                        <div className="flex justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={addLine}>
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                            onClick={() => removeLine(l.id)} disabled={lines.length === 1}>
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>

            <div className="flex justify-end">
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
