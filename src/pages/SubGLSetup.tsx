import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { defaultPartyTypes, defaultParties, type PartyType, type Party } from './PartyTypeSetup';

export interface SubGLMapping {
  id: string;
  partyTypeId: string;
  partyTypeName: string;
  partyId: string;
  partyName: string;
  partyCode: string;
  assignedGLCodes: string[];
  assignedGLNames: string[];
  status: 'active' | 'inactive';
}

const defaultSubGLMappings: SubGLMapping[] = [
  {
    id: '1', partyTypeId: '1', partyTypeName: 'Customer', partyId: '1', partyName: 'Riyad Foods', partyCode: 'C-001',
    assignedGLCodes: ['11201001', '41101001'], assignedGLNames: ['Accounts Receivable', 'Sales Revenue'], status: 'active',
  },
  {
    id: '2', partyTypeId: '2', partyTypeName: 'Supplier', partyId: '3', partyName: 'Foodi Enterprise', partyCode: 'S-001',
    assignedGLCodes: ['21101001', '51101001'], assignedGLNames: ['Accounts Payable', 'Office Expenses'], status: 'active',
  },
  {
    id: '3', partyTypeId: '3', partyTypeName: 'Employee', partyId: '5', partyName: 'Mahmudul Hasan', partyCode: 'E-001',
    assignedGLCodes: ['11101001', '51102001'], assignedGLNames: ['Head Office Cash', 'Conveyance Expenses'], status: 'active',
  },
  {
    id: '4', partyTypeId: '2', partyTypeName: 'Supplier', partyId: '4', partyName: 'AeroTech Services', partyCode: 'S-002',
    assignedGLCodes: ['21101001', '11102001'], assignedGLNames: ['Accounts Payable', 'City Bank A/C: 1233305341001'], status: 'active',
  },
  {
    id: '5', partyTypeId: '1', partyTypeName: 'Customer', partyId: '8', partyName: 'Bengal Air Cargo', partyCode: 'C-003',
    assignedGLCodes: ['11201001'], assignedGLNames: ['Accounts Receivable'], status: 'active',
  },
];

export { defaultSubGLMappings };

export default function SubGLSetup() {
  const { glEntries } = useApp();
  const [partyTypes] = useState<PartyType[]>(defaultPartyTypes);
  const [parties] = useState<Party[]>(defaultParties);
  const [mappings, setMappings] = useState<SubGLMapping[]>(defaultSubGLMappings);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartyType, setFilterPartyType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form, setForm] = useState({
    partyTypeId: '',
    partyId: '',
    assignedGLCodes: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });

  // When party type is selected, auto-populate linked GLs from PartyType config
  const selectedPartyType = partyTypes.find(pt => pt.id === form.partyTypeId);
  const filteredParties = parties.filter(p => p.partyTypeId === form.partyTypeId && p.status === 'active');

  const handlePartyTypeChange = (ptId: string) => {
    const pt = partyTypes.find(p => p.id === ptId);
    setForm({
      ...form,
      partyTypeId: ptId,
      partyId: '',
      assignedGLCodes: pt ? [...pt.linkedGLCodes] : [],
    });
  };

  const filteredMappings = mappings.filter(m => {
    const matchSearch = m.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.partyCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterPartyType === 'all' || m.partyTypeId === filterPartyType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filteredMappings.length / pageSize);
  const paginatedMappings = filteredMappings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm({ partyTypeId: '', partyId: '', assignedGLCodes: [], status: 'active' });
    setShowDialog(true);
  };

  const openEdit = (m: SubGLMapping) => {
    setEditingId(m.id);
    setForm({
      partyTypeId: m.partyTypeId, partyId: m.partyId,
      assignedGLCodes: [...m.assignedGLCodes], status: m.status,
    });
    setShowDialog(true);
  };

  const removeGL = (glCode: string) => {
    setForm(prev => ({
      ...prev,
      assignedGLCodes: prev.assignedGLCodes.filter(c => c !== glCode),
    }));
  };

  const handleSave = () => {
    if (!form.partyTypeId || !form.partyId) {
      toast.error('Please select party type and party');
      return;
    }
    const pt = partyTypes.find(p => p.id === form.partyTypeId);
    const party = parties.find(p => p.id === form.partyId);
    if (!pt || !party) return;

    const glNames = form.assignedGLCodes.map(c => glEntries.find(g => g.glCode === c)?.glName || c);

    if (editingId) {
      setMappings(mappings.map(m => m.id === editingId ? {
        ...m, partyTypeId: form.partyTypeId, partyTypeName: pt.name,
        partyId: form.partyId, partyName: party.name, partyCode: party.code,
        assignedGLCodes: form.assignedGLCodes, assignedGLNames: glNames, status: form.status,
      } : m));
      toast.success('Sub GL mapping updated');
    } else {
      setMappings([...mappings, {
        id: Date.now().toString(), partyTypeId: form.partyTypeId, partyTypeName: pt.name,
        partyId: form.partyId, partyName: party.name, partyCode: party.code,
        assignedGLCodes: form.assignedGLCodes, assignedGLNames: glNames, status: form.status,
      }]);
      toast.success('Sub GL mapping created');
    }
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
    toast.success('Mapping deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <span className="text-primary font-medium">Configuration</span> / Sub GL Setup
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Sub GL Setup</h1>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Sub GL Mapping
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Map parties to their GL accounts. Linked GLs are auto-populated from Party Type configuration but can be removed per party.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by party name or code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterPartyType} onValueChange={v => { setFilterPartyType(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {partyTypes.map(pt => (
                <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="pt-6">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/10">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">Party Type</TableHead>
                  <TableHead className="font-semibold">Party Code</TableHead>
                  <TableHead className="font-semibold">Party Name</TableHead>
                  <TableHead className="font-semibold">Assigned GL Accounts</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMappings.map((m, idx) => (
                  <TableRow key={m.id}>
                    <TableCell>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.partyTypeName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.partyCode}</TableCell>
                    <TableCell>{m.partyName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {m.assignedGLNames.map((name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {m.assignedGLCodes[i]} - {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.status === 'active' ? 'default' : 'destructive'}>{m.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(m.id)}>
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
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Sub GL Mapping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Party Type <span className="text-destructive">*</span></Label>
              <Select value={form.partyTypeId} onValueChange={handlePartyTypeChange}>
                <SelectTrigger><SelectValue placeholder="Select party type" /></SelectTrigger>
                <SelectContent>
                  {partyTypes.filter(pt => pt.status === 'active').map(pt => (
                    <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Party <span className="text-destructive">*</span></Label>
              <Select value={form.partyId} onValueChange={v => setForm({ ...form, partyId: v })} disabled={!form.partyTypeId}>
                <SelectTrigger><SelectValue placeholder="Select party" /></SelectTrigger>
                <SelectContent>
                  {filteredParties.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.code} - {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned GL Accounts</Label>
              <p className="text-xs text-muted-foreground">
                Auto-populated from Party Type config. Remove any that don't apply to this party.
              </p>
              <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
                {form.assignedGLCodes.map(code => {
                  const gl = glEntries.find(g => g.glCode === code);
                  return (
                    <Badge key={code} variant="secondary" className="gap-1">
                      {code} - {gl?.glName || code}
                      <button onClick={() => removeGL(code)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {form.assignedGLCodes.length === 0 && (
                  <span className="text-xs text-muted-foreground">No GL accounts assigned</span>
                )}
              </div>
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
