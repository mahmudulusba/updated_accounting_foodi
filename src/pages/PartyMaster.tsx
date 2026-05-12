import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { defaultPartyTypes, defaultParties, type PartyType, type Party } from './PartyTypeSetup';

export default function PartyMaster() {
  const [partyTypes] = useState<PartyType[]>(defaultPartyTypes);
  const [parties, setParties] = useState<Party[]>(defaultParties);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form, setForm] = useState({
    partyTypeId: '', name: '', code: '', contactPerson: '', phone: '', email: '', address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const filtered = parties.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || p.partyTypeId === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const typeCounts = {
    all: parties.length,
    ...Object.fromEntries(partyTypes.map(pt => [pt.id, parties.filter(p => p.partyTypeId === pt.id).length])),
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ partyTypeId: '', name: '', code: '', contactPerson: '', phone: '', email: '', address: '', status: 'active' });
    setShowDialog(true);
  };

  const openEdit = (p: Party) => {
    setEditingId(p.id);
    setForm({
      partyTypeId: p.partyTypeId, name: p.name, code: p.code, contactPerson: p.contactPerson,
      phone: p.phone, email: p.email, address: p.address, status: p.status,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.partyTypeId || !form.name || !form.code) {
      toast.error('Please fill all required fields');
      return;
    }
    const pt = partyTypes.find(p => p.id === form.partyTypeId);
    if (editingId) {
      setParties(parties.map(p => p.id === editingId ? {
        ...p, ...form, partyTypeName: pt?.name || '',
      } : p));
      toast.success('Party updated');
    } else {
      setParties([...parties, {
        id: Date.now().toString(), ...form, partyTypeName: pt?.name || '',
      }]);
      toast.success('Party created');
    }
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    setParties(parties.filter(p => p.id !== id));
    toast.success('Party deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <span className="text-primary font-medium">Configuration</span> / Party Master
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Party Master</h1>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Party
            </Button>
          </div>
        </div>

        {/* Tab Filters */}
        <Tabs value={filterType} onValueChange={v => { setFilterType(v); setCurrentPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All ({typeCounts.all})</TabsTrigger>
            {partyTypes.map(pt => (
              <TabsTrigger key={pt.id} value={pt.id}>
                {pt.name} ({typeCounts[pt.id] || 0})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search parties..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/10">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Code</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact Person</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((p, idx) => (
                  <TableRow key={p.id}>
                    <TableCell>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell><Badge variant="outline">{p.partyTypeName}</Badge></TableCell>
                    <TableCell className="font-medium">{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.contactPerson}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell className="text-xs">{p.email}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'active' ? 'default' : 'destructive'}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={pageSize.toString()} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Party Type <span className="text-destructive">*</span></Label>
              <Select value={form.partyTypeId} onValueChange={v => setForm({ ...form, partyTypeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {partyTypes.filter(pt => pt.status === 'active').map(pt => (
                    <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Party name" />
              </div>
              <div className="space-y-2">
                <Label>Code <span className="text-destructive">*</span></Label>
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g., C-001" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: 'active' | 'inactive') => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
