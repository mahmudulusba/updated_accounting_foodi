import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2, Check, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SBUS = ['Foodi', 'US-Bangla Airlines', 'Mart', 'Pharma', 'Restaurant'];
const DEPARTMENTS = ['HR', 'Finance & Accounts', 'Commercial - Mart', 'Foodi - Revenue', 'Foodi - Expenses', 'IT'];
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Cumilla', 'Gazipur', 'Noakhali', 'Mymensingh'];
const HUBS = ['Foodi - Pharma', 'Foodi - Shop', 'Foodi - Mart', 'Foodi - Restaurant'];

interface Zone { id: string; sbu: string; department: string; city: string; hub: string; name: string; active: boolean; }
const seedNames = ['Barishal Sadar','Noakhali','Konabari (Gazipur)','Cumilla','Satarkul','Sadar','Begumganj','Rupatali','Sonapur','Maijdee'];
const seed: Zone[] = seedNames.map((n, i) => ({ id: String(i + 1), sbu: 'Foodi', department: 'HR', city: 'Dhaka', hub: 'Foodi - Pharma', name: n, active: true }));

export default function ZoneSetup() {
  const [list, setList] = useState<Zone[]>(seed);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sbu, setSbu] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [hub, setHub] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const clear = () => { setSbu(''); setDepartment(''); setCity(''); setHub(''); setName(''); setActive(true); setEditing(null); setOpen(false); };
  const submit = () => {
    if (!sbu) { toast.error('SBU required'); return; }
    if (!department) { toast.error('Department required'); return; }
    if (!city) { toast.error('City required'); return; }
    if (!hub) { toast.error('Hub required'); return; }
    if (!name) { toast.error('Zone Name required'); return; }
    if (editing) { setList(prev => prev.map(z => z.id === editing ? { ...z, sbu, department, city, hub, name, active } : z)); toast.success('Updated'); }
    else { setList(prev => [{ id: Date.now().toString(), sbu, department, city, hub, name, active }, ...prev]); toast.success('Added'); }
    clear();
  };
  const edit = (z: Zone) => { setEditing(z.id); setSbu(z.sbu); setDepartment(z.department); setCity(z.city); setHub(z.hub); setName(z.name); setActive(z.active); setOpen(true); };
  const del = (id: string) => setList(prev => prev.filter(z => z.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4"><nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Zone</nav></CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Zone List</h2>
              <div className="flex gap-2">
                <Button variant="destructive" size="icon" title="Filter" onClick={() => setShowFilter(s => !s)}><Filter className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" title="Add" onClick={() => { clear(); setOpen(true); }}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {showFilter && (
              <div className="mb-4 flex justify-center">
                <Input placeholder="Search by Zone Name" className="max-w-md" />
              </div>
            )}

            {open && (
              <div className="border rounded-md p-4 mb-4 bg-muted/30">
                <h3 className="font-semibold mb-3">{editing ? 'Edit Zone' : 'New Zone'}</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2"><Label>SBU <span className="text-destructive">*</span></Label>
                    <Select value={sbu} onValueChange={setSbu}>
                      <SelectTrigger><SelectValue placeholder="Select SBU" /></SelectTrigger>
                      <SelectContent>{SBUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Department <span className="text-destructive">*</span></Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                      <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>City Name <span className="text-destructive">*</span></Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                      <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Hub Name <span className="text-destructive">*</span></Label>
                    <Select value={hub} onValueChange={setHub}>
                      <SelectTrigger><SelectValue placeholder="Select Hub" /></SelectTrigger>
                      <SelectContent>{HUBS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3 items-end mt-4">
                  <div className="space-y-2"><Label>Zone Name <span className="text-destructive">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Status</Label>
                    <div className="flex items-center gap-2 pt-2"><Checkbox id="zone-act" checked={active} onCheckedChange={v => setActive(!!v)} /><Label htmlFor="zone-act" className="font-normal">Active</Label></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={clear}>Cancel</Button>
                    <Button onClick={submit}>Submit</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-20">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">SBU</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Department</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">City</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Hub</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Zone Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold w-32">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((z, i) => (
                    <TableRow key={z.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{z.sbu}</TableCell>
                      <TableCell>{z.department}</TableCell>
                      <TableCell>{z.city}</TableCell>
                      <TableCell>{z.hub}</TableCell>
                      <TableCell>{z.name}</TableCell>
                      <TableCell>{z.active ? <Check className="h-4 w-4 text-success" /> : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(z)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(z.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
