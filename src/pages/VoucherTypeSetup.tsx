import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Pencil, Trash2, Eye, Plus, Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface VT { id: string; code: string; name: string; type: string; lastDate: string; lastNo: string; }
const seed: VT[] = [
  { id: '1', code: 'CE', name: 'Contra Entry', type: 'Journal', lastDate: '28 Apr 2026', lastNo: 'CE-2026-000124' },
  { id: '2', code: 'TR', name: 'Trade payment', type: 'Vendor', lastDate: '02 May 2026', lastNo: 'TR-2026-000891' },
  { id: '3', code: 'BP', name: 'Bank Payment', type: 'Bank', lastDate: '05 May 2026', lastNo: 'BP-2026-003457' },
  { id: '4', code: 'CR', name: 'Cash Receipt(CR)', type: 'Cash', lastDate: '06 May 2026', lastNo: 'CR-2026-001209' },
  { id: '5', code: 'BR', name: 'Bank Receive', type: 'Bank', lastDate: '04 May 2026', lastNo: 'BR-2026-002145' },
  { id: '6', code: 'JE', name: 'Journal Entry', type: 'Journal', lastDate: '07 May 2026', lastNo: 'JE-2026-000678' },
];

const typeOptions = ['Journal', 'Bank', 'Cash', 'Vendor', 'Customer', 'Contra'];
const lastVoucherHistory = [
  { sl: 1, fy: '01 Jul 2022 to 30 Jun 2023', last: '6999999999' },
  { sl: 2, fy: '01 Jul 2023 to 30 Jun 2024', last: '6999999999' },
  { sl: 3, fy: '01 Jul 2024 to 30 Jun 2025', last: '6999999999' },
];

export default function VoucherTypeSetup() {
  const [list, setList] = useState<VT[]>(seed);
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVT, setHistoryVT] = useState<VT | null>(null);
  const [code, setCode] = useState(''); const [name, setName] = useState(''); const [type, setType] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');

  const clear = () => { setCode(''); setName(''); setType(''); setEditing(null); setOpen(false); };
  const submit = () => {
    if (!code || !name) { toast.error('Code & Name required'); return; }
    if (editing) { setList(prev => prev.map(v => v.id === editing ? { ...v, code, name, type } : v)); toast.success('Updated'); }
    else { setList(prev => [...prev, { id: Date.now().toString(), code, name, type, lastDate: '-', lastNo: '-' }]); toast.success('Added'); }
    clear();
  };
  const edit = (v: VT) => { setEditing(v.id); setCode(v.code); setName(v.name); setType(v.type); setOpen(true); };
  const del = (id: string) => setList(prev => prev.filter(v => v.id !== id));
  const view = (v: VT) => { setHistoryVT(v); setHistoryOpen(true); };

  const filtered = list.filter(v =>
    (!searchCode || v.code.toLowerCase().includes(searchCode.toLowerCase())) &&
    (!searchName || v.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchType || searchType === 'all' || v.type === searchType)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card><CardContent className="py-4"><nav className="text-sm"><span className="font-semibold">Central Configuration</span> / Voucher Type</nav></CardContent></Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Voucher Type</h2>
              <div className="flex gap-2">
                <Button variant="default" size="icon" onClick={() => setFilterOpen(o => !o)}><Filter className="h-4 w-4" /></Button>
                <Button onClick={() => { clear(); setOpen(true); }}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {filterOpen && (
              <div className="border rounded-md p-4 mb-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Voucher Type</h3>
                  <Button variant="ghost" size="icon" onClick={() => setFilterOpen(false)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2"><Label>Voucher Type Code</Label><Input placeholder="Enter Voucher Type Code" value={searchCode} onChange={e => setSearchCode(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Voucher Type Name</Label><Input placeholder="Enter Voucher Type Name" value={searchName} onChange={e => setSearchName(e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Voucher Type</Label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger><SelectValue placeholder="Select Voucher Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {typeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={() => { setSearchCode(''); setSearchName(''); setSearchType(''); }}>Clear</Button>
                  <Button>Search</Button>
                </div>
              </div>
            )}

            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Voucher Type Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Voucher Type Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Voucher Type</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Last Voucher Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Last Voucher No.</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v, i) => (
                    <TableRow key={v.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{v.code}</TableCell>
                      <TableCell>{v.name}</TableCell>
                      <TableCell>{v.type}</TableCell>
                      <TableCell>{v.lastDate}</TableCell>
                      <TableCell className="font-mono text-sm">{v.lastNo}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => view(v)}><Eye className="h-4 w-4 text-primary" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => edit(v)}><Pencil className="h-4 w-4 text-primary" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => del(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

      {/* Add / Edit Popup */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) clear(); else setOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Voucher Type' : 'Add Voucher Type Info'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Voucher Type <span className="text-destructive">*</span></Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{typeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Voucher Type Name <span className="text-destructive">*</span></Label><Input placeholder="Enter Voucher Type Name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Voucher Type Code <span className="text-destructive">*</span></Label><Input placeholder="Enter Voucher Type Code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clear}>Reset</Button>
            <Button onClick={submit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View / Last Voucher History Popup */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Last Voucher No History — {historyVT?.code}</DialogTitle>
          </DialogHeader>
          <div className="rounded-md border overflow-hidden">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="text-table-header-foreground font-semibold w-16">SL</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Financial Year Name</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Last Generated Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastVoucherHistory.map(h => (
                  <TableRow key={h.sl}>
                    <TableCell>{h.sl}</TableCell>
                    <TableCell>{h.fy}</TableCell>
                    <TableCell>{h.last}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
