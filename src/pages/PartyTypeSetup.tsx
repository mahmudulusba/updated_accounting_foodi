import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';

export interface PartyType {
  id: string;
  name: string;
  code: string;
  controlAccountGL: string;
  controlAccountName: string;
  linkedGLCodes: string[];
  linkedGLNames: string[];
  status: 'active' | 'inactive';
}

export interface Party {
  id: string;
  partyTypeId: string;
  partyTypeName: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
}

// Default dummy data - removed code from display, removed status field
const defaultPartyTypes: PartyType[] = [
  {
    id: '1', name: 'Customer', code: 'CUST',
    controlAccountGL: '11201001', controlAccountName: 'Accounts Receivable',
    linkedGLCodes: ['11201001', '41101001'],
    linkedGLNames: ['Accounts Receivable', 'Sales Revenue'],
    status: 'active',
  },
  {
    id: '2', name: 'Supplier', code: 'SUPP',
    controlAccountGL: '21101001', controlAccountName: 'Accounts Payable',
    linkedGLCodes: ['21101001', '51101001', '11102001'],
    linkedGLNames: ['Accounts Payable', 'Office Expenses', 'City Bank A/C: 1233305341001'],
    status: 'active',
  },
  {
    id: '3', name: 'Employee', code: 'EMP',
    controlAccountGL: '11101001', controlAccountName: 'Head Office Cash',
    linkedGLCodes: ['11101001', '51102001'],
    linkedGLNames: ['Head Office Cash', 'Conveyance Expenses'],
    status: 'active',
  },
];

const defaultParties: Party[] = [
  { id: '1', partyTypeId: '1', partyTypeName: 'Customer', name: 'Riyad Foods', code: 'C-001', contactPerson: 'Mr. Rahman', phone: '01711111111', email: 'riyad@foods.com', address: 'Gulshan-2, Dhaka', status: 'active' },
  { id: '2', partyTypeId: '1', partyTypeName: 'Customer', name: 'Sky International', code: 'C-002', contactPerson: 'Ms. Aisha', phone: '01722222222', email: 'info@skyintl.com', address: 'Banani, Dhaka', status: 'active' },
  { id: '3', partyTypeId: '2', partyTypeName: 'Supplier', name: 'Foodi Enterprise', code: 'S-001', contactPerson: 'Md. Mahmudul Hasan', phone: '01733333333', email: 'hasan.mahmudul@foodi.com', address: 'Motijheel, Dhaka', status: 'active' },
  { id: '4', partyTypeId: '2', partyTypeName: 'Supplier', name: 'AeroTech Services', code: 'S-002', contactPerson: 'Kamal Ahmed', phone: '01744444444', email: 'kamal@aerotech.com', address: 'Uttara, Dhaka', status: 'active' },
  { id: '5', partyTypeId: '3', partyTypeName: 'Employee', name: 'Mahmudul Hasan', code: 'E-001', contactPerson: 'Self', phone: '01755555555', email: 'hasan.mahmudul@foodi.com', address: 'Dhanmondi, Dhaka', status: 'active' },
  { id: '6', partyTypeId: '3', partyTypeName: 'Employee', name: 'Nusrat Jahan', code: 'E-002', contactPerson: 'Self', phone: '01766666666', email: 'farzana@foodi.com', address: 'Mirpur, Dhaka', status: 'active' },
  { id: '7', partyTypeId: '2', partyTypeName: 'Supplier', name: 'Global Fuel Ltd.', code: 'S-003', contactPerson: 'Rafiq Uddin', phone: '01777777777', email: 'rafiq@globalfuel.com', address: 'Chittagong', status: 'active' },
  { id: '8', partyTypeId: '1', partyTypeName: 'Customer', name: 'Bengal Air Cargo', code: 'C-003', contactPerson: 'Shahin Alam', phone: '01788888888', email: 'shahin@bengalcargo.com', address: 'Airport Road, Dhaka', status: 'active' },
];

export { defaultPartyTypes, defaultParties };

export default function PartyTypeSetup() {
  const { glEntries } = useApp();
  const [partyTypes, setPartyTypes] = useState<PartyType[]>(defaultPartyTypes);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [controlGLOpen, setControlGLOpen] = useState(false);

  const [form, setForm] = useState({
    name: '', controlAccountGL: '',
    linkedGLCodes: [] as string[],
  });

  const filteredTypes = partyTypes.filter(pt =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTypes.length / pageSize);
  const paginatedTypes = filteredTypes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', controlAccountGL: '', linkedGLCodes: [] });
    setShowDialog(true);
  };

  const openEdit = (pt: PartyType) => {
    setEditingId(pt.id);
    setForm({
      name: pt.name, controlAccountGL: pt.controlAccountGL,
      linkedGLCodes: pt.linkedGLCodes,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name || !form.controlAccountGL) {
      toast.error('Please fill all required fields');
      return;
    }
    const controlGL = glEntries.find(g => g.glCode === form.controlAccountGL);
    const linkedNames = form.linkedGLCodes.map(c => glEntries.find(g => g.glCode === c)?.glName || c);

    if (editingId) {
      setPartyTypes(partyTypes.map(pt => pt.id === editingId ? {
        ...pt, name: form.name, controlAccountGL: form.controlAccountGL,
        controlAccountName: controlGL?.glName || '',
        linkedGLCodes: form.linkedGLCodes,
        linkedGLNames: linkedNames,
        code: pt.code,
      } : pt));
      toast.success('Party Type updated');
    } else {
      setPartyTypes([...partyTypes, {
        id: Date.now().toString(), name: form.name, code: form.name.substring(0, 4).toUpperCase(),
        controlAccountGL: form.controlAccountGL,
        controlAccountName: controlGL?.glName || '',
        linkedGLCodes: form.linkedGLCodes,
        linkedGLNames: linkedNames,
        status: 'active',
      }]);
      toast.success('Party Type created');
    }
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    setPartyTypes(partyTypes.filter(pt => pt.id !== id));
    toast.success('Party Type deleted');
  };

  const toggleLinkedGL = (glCode: string) => {
    setForm(prev => ({
      ...prev,
      linkedGLCodes: prev.linkedGLCodes.includes(glCode)
        ? prev.linkedGLCodes.filter(c => c !== glCode)
        : [...prev.linkedGLCodes, glCode],
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <span className="text-primary font-medium">Configuration</span> / Party Management
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Party Management</h1>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Party Type
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Note: Ledger setup changes are locked once transactions exist for that setup.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search party types..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Removed Code and Status columns per feedback */}
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/10">
                  <TableHead className="font-semibold">SL</TableHead>
                  <TableHead className="font-semibold">Party Type</TableHead>
                  <TableHead className="font-semibold">Control Account</TableHead>
                  <TableHead className="font-semibold">Linked GL Accounts</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTypes.map((pt, idx) => (
                  <TableRow key={pt.id}>
                    <TableCell>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell className="font-medium">{pt.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{pt.controlAccountGL}</div>
                      <div className="text-xs text-muted-foreground">{pt.controlAccountName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pt.linkedGLNames.map((name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{name}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(pt)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(pt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select className="border rounded px-2 py-1 text-sm" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                  {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog - removed Code and Status fields */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Party Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Party Type Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Customer" />
            </div>
            <div className="space-y-2">
              <Label>Control Account (GL) <span className="text-destructive">*</span></Label>
              <Popover open={controlGLOpen} onOpenChange={setControlGLOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {form.controlAccountGL
                      ? `${form.controlAccountGL} - ${glEntries.find(g => g.glCode === form.controlAccountGL)?.glName || ''}`
                      : 'Search & select control account...'}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[460px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search GL code or name..." />
                    <CommandList>
                      <CommandEmpty>No GL found.</CommandEmpty>
                      <CommandGroup>
                        {glEntries.filter(g => g.status === 'active').map(g => (
                          <CommandItem
                            key={g.glCode}
                            value={`${g.glCode} ${g.glName}`}
                            onSelect={() => {
                              setForm(prev => ({
                                ...prev,
                                controlAccountGL: g.glCode,
                                linkedGLCodes: prev.linkedGLCodes.includes(g.glCode) ? prev.linkedGLCodes : [...prev.linkedGLCodes, g.glCode],
                              }));
                              setControlGLOpen(false);
                            }}
                          >
                            <span className="font-mono text-xs mr-2">{g.glCode}</span>
                            <span>{g.glName}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Linked GL Accounts</Label>
              {form.linkedGLCodes.length > 0 ? (
                <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
                  {form.linkedGLCodes.map((code) => {
                    const gl = glEntries.find(g => g.glCode === code);
                    return (
                      <div key={code} className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground font-mono">{code}</span>
                          <span className="text-sm">{gl?.glName || code}</span>
                        </div>
                        <button type="button" onClick={() => toggleLinkedGL(code)} className="text-destructive hover:text-destructive/80 text-sm font-medium">✕</button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Select a control account to see linked GL accounts</p>
              )}
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