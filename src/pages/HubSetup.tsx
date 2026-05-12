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
const ZONES = ['Satarkul', 'Konabari (Gazipur)', 'Cumilla', 'Noakhali', 'Barishal Sadar', 'Sonapur', 'Maijdee', 'Chowmuhani', 'Bogra Road', 'Rupatali'];

interface Hub {
  id: string;
  sbu: string;
  department: string;
  cityName: string;
  name: string;
  address: string;
  city: string;
  zone: string;
  manager: string;
  active: boolean;
}

const seed: Hub[] = [
  { id: '1', sbu: 'Foodi', department: 'HR', cityName: 'Dhaka', name: 'Foodi - Pharma', address: '', city: 'Dhaka', zone: 'Satarkul', manager: 'Md. Rahim Uddin', active: true },
  { id: '2', sbu: 'Pharma', department: 'IT', cityName: 'Chittagong', name: 'Foodi - Shop', address: '', city: 'Chittagong', zone: 'Cumilla', manager: 'Mizanur Rahman', active: true },
  { id: '3', sbu: 'Mart', department: 'Commercial - Mart', cityName: 'Sylhet', name: 'Foodi - Mart', address: '', city: 'Sylhet', zone: 'Maijdee', manager: 'Kamal Hossain', active: true },
  { id: '4', sbu: 'Restaurant', department: 'Foodi - Revenue', cityName: 'Dhaka', name: 'Foodi - Restaurant', address: '', city: 'Dhaka', zone: 'Konabari (Gazipur)', manager: 'Sadia Afroz', active: true },
];

export default function HubSetup() {
  const [list, setList] = useState<Hub[]>(seed);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sbu, setSbu] = useState('');
  const [department, setDepartment] = useState('');
  const [cityName, setCityName] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zone, setZone] = useState('');
  const [manager, setManager] = useState('');
  const [active, setActive] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const clear = () => {
    setSbu(''); setDepartment(''); setCityName('');
    setName(''); setAddress(''); setCity(''); setZone(''); setManager(''); setActive(true);
    setEditing(null); setOpen(false);
  };

  const submit = () => {
    if (!sbu) { toast.error('SBU required'); return; }
    if (!department) { toast.error('Department required'); return; }
    if (!cityName) { toast.error('City required'); return; }
    if (!name) { toast.error('Hub Name required'); return; }
    if (!city) { toast.error('City required'); return; }
    if (!zone) { toast.error('Zone required'); return; }
    if (editing) {
      setList(prev => prev.map(h => h.id === editing ? { ...h, sbu, department, cityName, name, address, city, zone, manager, active } : h));
      toast.success('Hub updated');
    } else {
      setList(prev => [{ id: Date.now().toString(), sbu, department, cityName, name, address, city, zone, manager, active }, ...prev]);
      toast.success('Hub added');
    }
    clear();
  };

  const edit = (h: Hub) => {
    setEditing(h.id); setSbu(h.sbu); setDepartment(h.department); setCityName(h.cityName);
    setName(h.name); setAddress(h.address);
    setCity(h.city); setZone(h.zone); setManager(h.manager || ''); setActive(h.active); setOpen(true);
  };
  const del = (id: string) => { setList(prev => prev.filter(h => h.id !== id)); toast.success('Deleted'); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4"><nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Hub</nav></CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Hub List</h2>
              <div className="flex gap-2">
                <Button variant="destructive" size="icon" title="Filter" onClick={() => setShowFilter(s => !s)}><Filter className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" title="Add" onClick={() => { clear(); setOpen(true); }}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {showFilter && (
              <div className="mb-4 flex justify-center">
                <Input placeholder="Search by Hub Name" className="max-w-md" />
              </div>
            )}

            {open && (
              <div className="border rounded-md p-4 mb-4 bg-muted/30">
                <h3 className="font-semibold mb-3">{editing ? 'Edit Hub' : 'New Hub'}</h3>
                <div className="grid gap-4 md:grid-cols-3">
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
                    <Select value={cityName} onValueChange={setCityName}>
                      <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                      <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>Hub Name <span className="text-destructive">*</span></Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hub Address</Label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>City <span className="text-destructive">*</span></Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                      <SelectContent>
                        {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Sourced from external app via API</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Zone <span className="text-destructive">*</span></Label>
                    <Select value={zone} onValueChange={setZone}>
                      <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                      <SelectContent>
                        {ZONES.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Sourced from external app via API</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Hub Manager</Label>
                    <Input value={manager} onChange={e => setManager(e.target.value)} placeholder="Enter Manager Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox id="hub-act" checked={active} onCheckedChange={v => setActive(!!v)} />
                      <Label htmlFor="hub-act" className="font-normal">Active</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="destructive" onClick={clear}>Clear</Button>
                  <Button onClick={submit}>Submit</Button>
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
                    <TableHead className="text-table-header-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Zone</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Hub Manager</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold w-32">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((h, i) => (
                    <TableRow key={h.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{h.sbu}</TableCell>
                      <TableCell>{h.department}</TableCell>
                      <TableCell>{h.cityName}</TableCell>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>{h.zone}</TableCell>
                      <TableCell>{h.manager || '-'}</TableCell>
                      <TableCell>{h.active ? <Check className="h-4 w-4 text-success" /> : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => edit(h)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(h.id)}><Trash2 className="h-4 w-4" /></Button>
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
