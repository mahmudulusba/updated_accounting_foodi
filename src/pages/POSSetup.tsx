import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Store, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { mockPointsOfSale, PointOfSale, POS_TYPES } from '@/lib/ticketSalesData';

const getPOSTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    'Counter': 'bg-primary/10 text-primary border-primary/20',
    'Online': 'bg-success/10 text-success border-success/20',
    'GDS': 'bg-warning/10 text-warning border-warning/20',
    'Agent': 'bg-accent/10 text-accent border-accent/20',
  };
  return <Badge variant="outline" className={colors[type] || ''}>{type}</Badge>;
};

export default function POSSetup() {
  const { branches } = useApp();
  const activeBranches = branches.filter(b => b.status === 'active' && !b.isConsolidated);

  const [posList, setPOSList] = useState<PointOfSale[]>(mockPointsOfSale);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPOS, setEditingPOS] = useState<PointOfSale | null>(null);

  const [formData, setFormData] = useState({
    posCode: '',
    posName: '',
    posType: '' as typeof POS_TYPES[number] | '',
    branchId: '',
    location: '',
    isActive: true,
  });

  const filteredPOS = useMemo(() => {
    return posList.filter(pos => {
      const matchesSearch = pos.posCode.toLowerCase().includes(search.toLowerCase()) || pos.posName.toLowerCase().includes(search.toLowerCase()) || pos.location.toLowerCase().includes(search.toLowerCase());
      const matchesBranch = branchFilter === 'all' || pos.branchId === branchFilter;
      const matchesType = typeFilter === 'all' || pos.posType === typeFilter;
      return matchesSearch && matchesBranch && matchesType;
    });
  }, [posList, search, branchFilter, typeFilter]);

  const handleOpenDialog = (pos?: PointOfSale) => {
    if (pos) {
      setEditingPOS(pos);
      setFormData({ posCode: pos.posCode, posName: pos.posName, posType: pos.posType, branchId: pos.branchId, location: pos.location, isActive: pos.status === 'active' });
    } else {
      setEditingPOS(null);
      setFormData({ posCode: '', posName: '', posType: '', branchId: '', location: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.posCode || !formData.posName || !formData.posType || !formData.branchId) {
      toast.error('Please fill in all required fields');
      return;
    }
    const selectedBranch = activeBranches.find(b => b.id === formData.branchId);
    if (!selectedBranch) { toast.error('Invalid branch selected'); return; }
    const status = formData.isActive ? 'active' : 'inactive';

    if (editingPOS) {
      setPOSList(posList.map(p => p.id === editingPOS.id ? { ...p, ...formData, posType: formData.posType as typeof POS_TYPES[number], status: status as 'active' | 'inactive', branchCode: selectedBranch.code, branchName: selectedBranch.name } : p));
      toast.success('Point of Sale updated successfully');
    } else {
      const newPOS: PointOfSale = {
        id: Date.now().toString(), posCode: formData.posCode, posName: formData.posName, posType: formData.posType as typeof POS_TYPES[number],
        branchId: formData.branchId, location: formData.location, status: status as 'active' | 'inactive',
        branchCode: selectedBranch.code, branchName: selectedBranch.name, createdAt: new Date(),
      };
      setPOSList([...posList, newPOS]);
      toast.success('Point of Sale created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => { setPOSList(posList.filter(p => p.id !== id)); toast.success('Point of Sale deleted successfully'); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Point of Sale (POS) Master</h1>
            <p className="text-muted-foreground">Manage ticket issuing sources for sales tracking</p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">POS Accounting Rules:</p>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Each POS belongs to exactly one Branch</li>
                  <li>• POS never owns revenue - only generates receivable, cash, and clearing entries</li>
                  <li>• POS is used only in Ticket Sales and Settlement vouchers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search POS..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                <SelectItem value="all">All Branches</SelectItem>
                {activeBranches.map((branch) => (<SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                <SelectItem value="all">All Types</SelectItem>
                {POS_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-primary" onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-2" /> Add Point of Sale</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>POS Code</TableHead><TableHead>POS Name</TableHead><TableHead>Type</TableHead>
                  <TableHead>Branch</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOS.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell className="font-semibold text-primary">{pos.posCode}</TableCell>
                    <TableCell>{pos.posName}</TableCell>
                    <TableCell>{getPOSTypeBadge(pos.posType)}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-muted/50">{pos.branchName} ({pos.branchCode})</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{pos.location}</TableCell>
                    <TableCell><Badge className={pos.status === 'active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted text-muted-foreground'}>{pos.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(pos)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(pos.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPOS.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No points of sale found</TableCell></TableRow>)}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        {/* Dialog - Status changed from dropdown to checkbox */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingPOS ? 'Edit Point of Sale' : 'Add New Point of Sale'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>POS Code <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g., POS-DHK-001" value={formData.posCode} onChange={(e) => setFormData({ ...formData, posCode: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <Label>POS Type <span className="text-destructive">*</span></Label>
                  <Select value={formData.posType} onValueChange={(v) => setFormData({ ...formData, posType: v as typeof POS_TYPES[number] })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {POS_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>POS Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter POS name" value={formData.posName} onChange={(e) => setFormData({ ...formData, posName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Branch <span className="text-destructive">*</span></Label>
                <Select value={formData.branchId} onValueChange={(v) => setFormData({ ...formData, branchId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {activeBranches.map((branch) => (<SelectItem key={branch.id} value={branch.id}>{branch.name} ({branch.code})</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Enter location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="pos-status"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                    />
                    <Label htmlFor="pos-status">Active</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingPOS ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}