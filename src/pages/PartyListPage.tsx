import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Eye, Pencil, Plus, Download, Save, RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';
import { defaultPartyTypes } from '@/pages/PartyTypeSetup';

interface Party {
  id: string;
  partyName: string;
  partyCode: string;
  mobile: string;
  nid: string;
  address: string;
  partyType: 'Customer' | 'Supplier' | 'Employee';
  status: 'Active' | 'Inactive';
  hasTransaction: boolean;
}

const mockParties: Party[] = [
  { id: '1', partyName: 'Riyad Foods', partyCode: 'CUS-001', mobile: '+8801711234567', nid: '1990123456789', address: 'Motijheel, Dhaka', partyType: 'Customer', status: 'Active', hasTransaction: true },
  { id: '2', partyName: 'Sky Aviation Services', partyCode: 'CUS-002', mobile: '+8801812345678', nid: '1985987654321', address: 'Banani, Dhaka', partyType: 'Customer', status: 'Active', hasTransaction: false },
  { id: '3', partyName: 'Global Fuel Supply Ltd', partyCode: 'SUP-001', mobile: '+8801912345678', nid: '2000112233445', address: 'Uttara, Dhaka', partyType: 'Supplier', status: 'Active', hasTransaction: true },
  { id: '4', partyName: 'Airport Ground Services', partyCode: 'SUP-002', mobile: '+8801612345678', nid: '1995556677889', address: 'Airport Road, Dhaka', partyType: 'Supplier', status: 'Active', hasTransaction: false },
  { id: '5', partyName: 'Catering Solutions BD', partyCode: 'SUP-003', mobile: '+8801512345678', nid: '1988334455667', address: 'Gulshan, Dhaka', partyType: 'Supplier', status: 'Inactive', hasTransaction: true },
  { id: '6', partyName: 'Mahmudul Hasan', partyCode: 'EMP-001', mobile: '+8801771234567', nid: '1992445566778', address: 'Dhanmondi, Dhaka', partyType: 'Employee', status: 'Active', hasTransaction: true },
  { id: '7', partyName: 'Farzana Islam', partyCode: 'EMP-002', mobile: '+8801871234567', nid: '1994667788990', address: 'Mirpur, Dhaka', partyType: 'Employee', status: 'Active', hasTransaction: false },
  { id: '8', partyName: 'Kamal Uddin', partyCode: 'EMP-003', mobile: '+8801671234567', nid: '1991778899001', address: 'Mohammadpur, Dhaka', partyType: 'Employee', status: 'Active', hasTransaction: false },
  { id: '9', partyName: 'Bengal Airways Agency', partyCode: 'CUS-003', mobile: '+8801311234567', nid: '1987223344556', address: 'Chittagong', partyType: 'Customer', status: 'Active', hasTransaction: false },
  { id: '10', partyName: 'Maintenance Works Ltd', partyCode: 'SUP-004', mobile: '+8801411234567', nid: '1993889900112', address: 'Narayanganj', partyType: 'Supplier', status: 'Active', hasTransaction: false },
];

export default function PartyListPage() {
  const [parties, setParties] = useState<Party[]>(mockParties);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Customer');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [form, setForm] = useState({
    partyName: '',
    partyCode: '',
    mobile: '',
    nid: '',
    address: '',
    partyType: '',
  });

  const [linkedAccounts, setLinkedAccounts] = useState<{ code: string; name: string }[]>([]);

  const filtered = parties.filter(p => {
    const matchSearch = p.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery);
    const matchType = p.partyType === activeTab;
    return matchSearch && matchType && p.status === 'Active';
  });

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Customer': return 'bg-primary/10 text-primary border-primary/20';
      case 'Supplier': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Employee': return 'bg-success/10 text-success border-success/20';
      default: return '';
    }
  };

  const handleTypeChange = (typeId: string) => {
    setForm({ ...form, partyType: typeId });
    const pt = defaultPartyTypes.find(t => t.id === typeId);
    if (pt) {
      setLinkedAccounts(pt.linkedGLCodes.map((code, i) => ({ code, name: pt.linkedGLNames[i] || code })));
    } else {
      setLinkedAccounts([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partyName || !form.partyCode || !form.partyType) {
      toast.error('Please fill in all required fields');
      return;
    }
    const pt = defaultPartyTypes.find(t => t.id === form.partyType);
    const newParty: Party = {
      id: Date.now().toString(),
      partyName: form.partyName,
      partyCode: form.partyCode,
      mobile: form.mobile,
      nid: form.nid,
      address: form.address,
      partyType: pt?.name as 'Customer' | 'Supplier' | 'Employee' || 'Customer',
      status: 'Active',
      hasTransaction: false,
    };
    setParties([...parties, newParty]);
    toast.success(`Party "${form.partyName}" added successfully`);
    handleReset();
    setShowCreateDialog(false);
    setActiveTab(newParty.partyType);
  };

  const handleReset = () => {
    setForm({ partyName: '', partyCode: '', mobile: '', nid: '', address: '', partyType: '' });
    setLinkedAccounts([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">Party Management</span> / Party List
            </nav>
            <h1 className="text-2xl font-bold">Party Management</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Download</Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Party
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Tabs for party types */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="Customer">Customer</TabsTrigger>
                  <TabsTrigger value="Supplier">Supplier</TabsTrigger>
                  <TabsTrigger value="Employee">Employee</TabsTrigger>
                </TabsList>
                <Input placeholder="Search by name, code or mobile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-72" />
              </div>

              {['Customer', 'Supplier', 'Employee'].map(type => (
                <TabsContent key={type} value={type}>
                  <div className="rounded-md border overflow-hidden">
                    <TableWithSearch>
                      <TableHeader>
                        <TableRow className="bg-table-header hover:bg-table-header">
                          <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">Party Code</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">Party Name</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">Mobile</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">NID</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">Address</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((party, index) => (
                          <TableRow key={party.id} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{party.partyCode}</TableCell>
                            <TableCell>{party.partyName}</TableCell>
                            <TableCell>{party.mobile}</TableCell>
                            <TableCell>{party.nid}</TableCell>
                            <TableCell className="max-w-[180px] truncate" title={party.address}>{party.address}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filtered.length === 0 && (
                          <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No active {type.toLowerCase()} parties found</TableCell></TableRow>
                        )}
                      </TableBody>
                    </TableWithSearch>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Party Dialog - same page popup */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Party</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select value={form.partyType} onValueChange={handleTypeChange}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {defaultPartyTypes.filter(t => t.status === 'active').map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Party Code <span className="text-destructive">*</span></Label>
                <Input value={form.partyCode} onChange={(e) => setForm({ ...form, partyCode: e.target.value })} placeholder="e.g. SUP-001" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Party Name <span className="text-destructive">*</span></Label>
              <Input value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} placeholder="Enter party name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile</Label>
                <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="e.g. +880171XXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>NID</Label>
                <Input value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} placeholder="National ID number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter address" rows={2} />
            </div>
            {linkedAccounts.length > 0 && (
              <div className="space-y-2">
                <Label>Linked Accounts</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {linkedAccounts.map(acc => (
                    <div key={acc.code} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-mono">{acc.code}</Badge>
                        <span className="text-sm">{acc.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setLinkedAccounts(prev => prev.filter(a => a.code !== acc.code))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { handleReset(); setShowCreateDialog(false); }}>Cancel</Button>
              <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Party</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}