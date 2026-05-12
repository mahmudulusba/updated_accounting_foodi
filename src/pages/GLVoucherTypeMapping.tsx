import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp, GLVoucherTypeMapping as GLVoucherTypeMappingType } from '@/contexts/AppContext';
import { GLSearchDialog } from '@/components/GLSearchDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Pencil, FileCheck, X, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const voucherTypes = [
  { value: 'JE', label: 'Journal Entry (JE)' },
  { value: 'BP', label: 'Bank Payment (BP)' },
  { value: 'BR', label: 'Bank Receipt (BR)' },
  { value: 'CP', label: 'Cash Payment (CP)' },
  { value: 'CR', label: 'Cash Receipt (CR)' },
];

const userRoles = [
  { value: 'accountant', label: 'Accountant' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'admin', label: 'Admin' },
  { value: 'cashier', label: 'Cashier' },
];

const usersList = [
  { value: 'mahmudul', label: 'Mahmudul Hasan' },
  { value: 'rakib', label: 'Rakib Hossain' },
  { value: 'sadia', label: 'Sadia Akter' },
  { value: 'imran', label: 'Imran Khan' },
  { value: 'nadia', label: 'Nadia Rahman' },
];

export default function GLVoucherTypeMapping() {
  const { glEntries, selectedBranch, branches, glVoucherTypeMappings, addGLVoucherTypeMapping, deleteGLVoucherTypeMapping, updateGLVoucherTypeMapping } = useApp();
  
  const [formData, setFormData] = useState({
    voucherType: '',
    userRole: '',
    user: '',
    selectedGLCodes: [] as string[],
    affectsTaxAccounting: true,
    branchCode: selectedBranch?.code || '',
  });

  const [isGLSearchOpen, setIsGLSearchOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<GLVoucherTypeMappingType | null>(null);
  const [editVoucherType, setEditVoucherType] = useState('');

  const [columnFilters, setColumnFilters] = useState({
    glCode: '', glName: '', voucherType: '', status: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showSearchRow, setShowSearchRow] = useState(false);

  const handleGLSelect = (entry: { glCode: string; glName: string }) => {
    if (!formData.selectedGLCodes.includes(entry.glCode)) {
      setFormData(prev => ({
        ...prev,
        selectedGLCodes: [...prev.selectedGLCodes, entry.glCode],
      }));
    }
    toast.success('GL Code added');
  };

  const removeSelectedGL = (glCode: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGLCodes: prev.selectedGLCodes.filter(c => c !== glCode),
    }));
  };

  const handleAdd = () => {
    if (!formData.voucherType || formData.selectedGLCodes.length === 0) {
      toast.error('Please select voucher type and at least one GL');
      return;
    }

    const voucherTypeName = voucherTypes.find(v => v.value === formData.voucherType)?.label || '';

    // Add mapping for each selected GL
    formData.selectedGLCodes.forEach(glCode => {
      const existingMapping = glVoucherTypeMappings.find(
        m => m.glCode === glCode && m.voucherType === formData.voucherType
      );
      if (existingMapping) return;

      const gl = glEntries.find(g => g.glCode === glCode);
      addGLVoucherTypeMapping({
        glCode,
        glName: gl?.glName || glCode,
        voucherType: formData.voucherType,
        voucherTypeName,
        status: 'active',
        hasTransaction: false,
        affectsTaxAccounting: formData.affectsTaxAccounting,
      });
    });

    toast.success('Voucher Type wise GL mapping(s) added successfully');
    setFormData({ voucherType: '', userRole: '', user: '', selectedGLCodes: [], affectsTaxAccounting: true, branchCode: selectedBranch?.code || '' });
  };

  const handleDelete = (mapping: GLVoucherTypeMappingType) => {
    if (mapping.hasTransaction) { toast.error('Cannot delete mapping with existing transactions'); return; }
    deleteGLVoucherTypeMapping(mapping.id);
    toast.success('Mapping deleted successfully');
  };

  const handleEditClick = (mapping: GLVoucherTypeMappingType) => {
    if (mapping.hasTransaction) { toast.error('Cannot edit mapping with existing transactions'); return; }
    setEditingMapping(mapping);
    setEditVoucherType(mapping.voucherType);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingMapping || !editVoucherType) return;
    const existingMapping = glVoucherTypeMappings.find(
      m => m.glCode === editingMapping.glCode && m.voucherType === editVoucherType && m.id !== editingMapping.id
    );
    if (existingMapping) { toast.error('This mapping already exists'); return; }
    const voucherTypeName = voucherTypes.find(v => v.value === editVoucherType)?.label || '';
    updateGLVoucherTypeMapping(editingMapping.id, { voucherType: editVoucherType, voucherTypeName });
    toast.success('Mapping updated successfully');
    setIsEditDialogOpen(false);
    setEditingMapping(null);
  };

  const filteredMappings = glVoucherTypeMappings.filter(m => {
    const matchesGLCode = !columnFilters.glCode || m.glCode.toLowerCase().includes(columnFilters.glCode.toLowerCase());
    const matchesGLName = !columnFilters.glName || m.glName.toLowerCase().includes(columnFilters.glName.toLowerCase());
    const matchesVoucherType = !columnFilters.voucherType || m.voucherType.toLowerCase().includes(columnFilters.voucherType.toLowerCase()) || m.voucherTypeName.toLowerCase().includes(columnFilters.voucherType.toLowerCase());
    const matchesStatus = !columnFilters.status || columnFilters.status === 'all' || m.status === columnFilters.status;
    return matchesGLCode && matchesGLName && matchesVoucherType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <span className="text-primary">Central Configuration</span> / Voucher Type wise GL Mapping
          </nav>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Voucher Type wise GL Mapping</CardTitle>
              <div className="flex gap-2">
                <Button variant="default" size="icon" onClick={() => setShowSearchRow(s => !s)} title="Search"><Search className="h-4 w-4" /></Button>
                <Button variant="default" size="icon" onClick={() => setShowForm(s => !s)} title="Add Mapping"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
          {showForm && (
            <>
            {/* Form - select voucher type first, then add multiple GLs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Voucher Type<span className="text-destructive">*</span></Label>
                <Select value={formData.voucherType} onValueChange={(value) => setFormData({ ...formData, voucherType: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Voucher Type" /></SelectTrigger>
                  <SelectContent>
                    {voucherTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">User Role</Label>
                <Select value={formData.userRole} onValueChange={(value) => setFormData({ ...formData, userRole: value })}>
                  <SelectTrigger><SelectValue placeholder="Select User Role" /></SelectTrigger>
                  <SelectContent>
                    {userRoles.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">User</Label>
                <Select value={formData.user} onValueChange={(value) => setFormData({ ...formData, user: value })}>
                  <SelectTrigger><SelectValue placeholder="Select User" /></SelectTrigger>
                  <SelectContent>
                    {usersList.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected GLs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mapped GL Accounts</Label>
                <Button variant="outline" size="sm" onClick={() => setIsGLSearchOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add GL
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-3">
                {formData.selectedGLCodes.map(code => {
                  const gl = glEntries.find(g => g.glCode === code);
                  return (
                    <Badge key={code} variant="secondary" className="gap-1 px-3 py-1.5">
                      <span className="font-mono text-xs">{code}</span> - {gl?.glName || code}
                      <button onClick={() => removeSelectedGL(code)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                    </Badge>
                  );
                })}
                {formData.selectedGLCodes.length === 0 && (
                  <span className="text-sm text-muted-foreground">Click "Add GL" to select ledgers for this voucher type</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => { handleAdd(); setShowForm(false); }}>Add Mapping</Button>
              <Button variant="outline" onClick={() => setFormData({ voucherType: '', userRole: '', user: '', selectedGLCodes: [], affectsTaxAccounting: true, branchCode: selectedBranch?.code || '' })}>Clear</Button>
            </div>
            </>
          )}

            {/* Table */}
            <div className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <TableWithSearch>
                  <TableHeader>
                    {showSearchRow && (
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-semibold w-12"></TableHead>
                      <TableHead className="text-table-header-foreground p-1">
                        <Input placeholder="Search..." value={columnFilters.glCode} onChange={(e) => setColumnFilters({ ...columnFilters, glCode: e.target.value })} className="h-8 bg-background text-foreground text-xs" />
                      </TableHead>
                      <TableHead className="text-table-header-foreground p-1">
                        <Input placeholder="Search..." value={columnFilters.glName} onChange={(e) => setColumnFilters({ ...columnFilters, glName: e.target.value })} className="h-8 bg-background text-foreground text-xs" />
                      </TableHead>
                      <TableHead className="text-table-header-foreground p-1">
                        <Input placeholder="Search..." value={columnFilters.voucherType} onChange={(e) => setColumnFilters({ ...columnFilters, voucherType: e.target.value })} className="h-8 bg-background text-foreground text-xs" />
                      </TableHead>
                      <TableHead className="text-table-header-foreground p-1">
                        <Select value={columnFilters.status} onValueChange={(value) => setColumnFilters({ ...columnFilters, status: value })}>
                          <SelectTrigger className="h-8 bg-background text-foreground text-xs"><SelectValue placeholder="-- Select --" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead className="text-table-header-foreground font-semibold"></TableHead>
                      <TableHead className="text-table-header-foreground font-semibold"></TableHead>
                      <TableHead className="text-table-header-foreground font-semibold"></TableHead>
                      <TableHead className="text-table-header-foreground font-semibold"></TableHead>
                      <TableHead className="text-table-header-foreground font-semibold w-24"></TableHead>
                    </TableRow>
                    )}
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">GL Code</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">GL Name</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Voucher Type</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">User Role</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">User</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Created At</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMappings.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No mappings found.</TableCell></TableRow>
                    ) : (
                      filteredMappings.map((mapping, index) => {
                        const role = userRoles[index % userRoles.length].label;
                        const usr = usersList[index % usersList.length].label;
                        return (
                        <TableRow key={mapping.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono">{mapping.glCode}</TableCell>
                          <TableCell>{mapping.glName}</TableCell>
                          <TableCell>{mapping.voucherTypeName}</TableCell>
                          <TableCell>{role}</TableCell>
                          <TableCell>{usr}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${mapping.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                              <span className={`w-2 h-2 rounded-full ${mapping.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                              {mapping.status.charAt(0).toUpperCase() + mapping.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{format(mapping.createdAt, 'dd-MMM-yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="icon" variant="outline" className={`h-8 w-8 ${mapping.hasTransaction ? 'opacity-50' : 'text-primary'}`} onClick={() => handleEditClick(mapping)} disabled={mapping.hasTransaction}><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="outline" className={`h-8 w-8 ${mapping.hasTransaction ? 'opacity-50' : 'text-destructive'}`} onClick={() => handleDelete(mapping)} disabled={mapping.hasTransaction}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </TableWithSearch>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GLSearchDialog open={isGLSearchOpen} onOpenChange={setIsGLSearchOpen} glEntries={glEntries} onSelect={handleGLSelect} />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Mapping</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>GL Code</Label><Input value={editingMapping?.glCode || ''} readOnly className="bg-muted" /></div>
            <div className="space-y-2"><Label>GL Name</Label><Input value={editingMapping?.glName || ''} readOnly className="bg-muted" /></div>
            <div className="space-y-2">
              <Label>Voucher Type</Label>
              <Select value={editVoucherType} onValueChange={setEditVoucherType}>
                <SelectTrigger><SelectValue placeholder="Select Voucher Type" /></SelectTrigger>
                <SelectContent>{voucherTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}