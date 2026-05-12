import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Settings, ChevronDown, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ReconRow { id: number; name: string; reconGLNumber: string; reconGLName: string; }

const seed: ReconRow[] = [
  { id: 1, name: 'Tasty Treat - Niketon Gulshan', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 2, name: 'Tasty Treat - Joar Shahara Bazar', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 3, name: 'Tasty Treat - Apollo Gate', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 4, name: 'Tasty Treat - Bashundhara 2', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 5, name: 'Tasty Treat - Bashundhara', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 6, name: 'Pizza Burg - Mohammadpur', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 7, name: 'KB Pharma', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 8, name: 'Pizza Burg - Bashundhara', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 9, name: 'Tasty Treat Cafe - Niketon Gulshan', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 10, name: 'Le dOr - Gulshan', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 11, name: 'Foodimart - Bashundhara', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
  { id: 12, name: 'Star Bakery - Banani', reconGLNumber: '22102003', reconGLName: 'Restaurant Payable' },
];

const reconGLOptions = [
  { code: '22102003', name: 'Restaurant Payable' },
  { code: '22102004', name: 'Vendor Payable' },
  { code: '22102005', name: 'Service Payable' },
];

const partyOptionsByTab: Record<string, string[]> = {
  supplier: ['Tasty Treat - Niketon Gulshan', 'Pizza Burg - Mohammadpur', 'KB Pharma', 'Star Bakery - Banani', 'Le dOr - Gulshan'],
  customer: ['Walk-in Customer', 'Corporate Client A', 'Corporate Client B', 'Online Customer', 'Retail Chain X'],
  employee: ['Md. Mahmudul Hasan', 'Farzana Islam', 'Rakib Hossain', 'Sumaiya Akter', 'Tanvir Ahmed'],
};

export default function PartyReconGLConfig() {
  const [rows, setRows] = useState<ReconRow[]>(seed);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [reconGL, setReconGL] = useState('');
  const [parties, setParties] = useState<string[]>([]);
  const [tab, setTab] = useState('supplier');

  const partyLabel = tab.charAt(0).toUpperCase() + tab.slice(1);
  const partyOptions = partyOptionsByTab[tab] || [];

  const filtered = rows.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.reconGLNumber.includes(search) ||
    r.reconGLName.toLowerCase().includes(search.toLowerCase())
  );

  const togglePartyAll = (checked: boolean) => setParties(checked ? [...partyOptions] : []);
  const toggleParty = (name: string) => setParties(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);

  const submit = () => {
    if (!reconGL || parties.length === 0) { toast.error(`Recon GL & ${partyLabel} are required`); return; }
    const gl = reconGLOptions.find(g => g.code === reconGL)!;
    setRows(prev => [...prev, ...parties.map(name => ({ id: Date.now() + Math.random(), name, reconGLNumber: gl.code, reconGLName: gl.name }))]);
    toast.success(`${parties.length} Recon GL mapping(s) added`);
    setReconGL(''); setParties([]); setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Party Module</span> / Recon GL Config
        </nav>
        <Card>
          <CardContent className="pt-6">
            <Tabs value={tab} onValueChange={setTab} className="mb-4">
              <TabsList>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
                <TabsTrigger value="employee">Employee</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold capitalize">{tab} Recon GL Config List</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
              <Input placeholder="Search all columns..." value={search} onChange={e => setSearch(e.target.value)} className="w-72" />
            </div>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-16">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Recon GL Number</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Recon GL Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.reconGLNumber}</TableCell>
                      <TableCell>{r.reconGLName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Recon GL Mapping</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Recon GL</Label>
              <Select value={reconGL} onValueChange={setReconGL}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {reconGLOptions.map(o => <SelectItem key={o.code} value={o.code}>{o.code} - {o.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{partyLabel}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    <span className="truncate">
                      {parties.length === 0 ? `Select ${partyLabel.toLowerCase()}(s)` : `${parties.length} selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover z-[9999]" align="start">
                  <div className="max-h-64 overflow-auto p-2 space-y-1">
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer border-b mb-1">
                      <Checkbox
                        checked={parties.length === partyOptions.length && partyOptions.length > 0}
                        onCheckedChange={(c) => togglePartyAll(!!c)}
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </label>
                    {partyOptions.map(s => (
                      <label key={s} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer">
                        <Checkbox checked={parties.includes(s)} onCheckedChange={() => toggleParty(s)} />
                        <span className="text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {parties.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {parties.map(p => (
                    <Badge key={p} variant="secondary" className="gap-1">
                      {p}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleParty(p)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReconGL(''); setParties([]); }}>Clear</Button>
            <Button onClick={submit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}