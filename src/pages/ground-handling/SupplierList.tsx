import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Eye, Pencil, Download, Settings2, ChevronLeft, ChevronRight, Trash2, X, ArrowLeft, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SUPPLIER_TYPES, COUNTRIES } from '@/lib/groundHandlingData';
import { AddSupplierDialog } from '@/components/ground-handling/AddSupplierDialog';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ColumnKey = 'company_name' | 'supplier_type' | 'country' | 'station_iata' | 'contact_name' | 'status';

interface ColumnConfig { key: ColumnKey; label: string; visible: boolean; }

interface Supplier {
  id: string;
  company_name: string;
  contact_name: string | null;
  designation: string | null;
  email: string | null;
  phone: string | null;
  fax: string | null;
  supplier_type: string;
  country: string | null;
  station_iata: string | null;
  remarks: string | null;
  valid_from: string | null;
  valid_till: string | null;
  status: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active': return <Badge className="bg-success/20 text-success border-success/30">{status}</Badge>;
    case 'Expiring Soon': return <Badge className="bg-warning/20 text-warning border-warning/30">{status}</Badge>;
    case 'Expired': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    'Airport Authority': 'bg-primary/10 text-primary border-primary/20',
    'Ground Handling': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Cargo': 'bg-orange-100 text-orange-700 border-orange-200',
    'OverFly': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return <Badge variant="outline" className={colors[type] || ''}>{type}</Badge>;
};

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // View detail state
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  // Edit dialog state
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '', contactName: '', designation: '', email: '', phone: '', fax: '',
    supplierType: '', country: '', station: '', remarks: '',
  });

  // Advanced filter state
  const [advFilterType, setAdvFilterType] = useState('all');
  const [advFilterCountry, setAdvFilterCountry] = useState('all');
  const [advFilterStatus, setAdvFilterStatus] = useState('all');
  const [advFilterName, setAdvFilterName] = useState('');

  const [columnFilters, setColumnFilters] = useState<Record<ColumnKey, string>>({
    company_name: '', supplier_type: '', country: '', station_iata: '', contact_name: '', status: '',
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'company_name', label: 'Name', visible: true },
    { key: 'supplier_type', label: 'Type', visible: true },
    { key: 'country', label: 'Country', visible: true },
    { key: 'station_iata', label: 'Station', visible: true },
    { key: 'contact_name', label: 'Contact Name', visible: true },
    { key: 'status', label: 'Status', visible: true },
  ]);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gh_suppliers').select('*').order('company_name');
    if (!error && data) setSuppliers(data as Supplier[]);
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const tabCounts = useMemo(() => ({
    all: suppliers.length,
    'Airport Authority': suppliers.filter(s => s.supplier_type === 'Airport Authority').length,
    'Ground Handling': suppliers.filter(s => s.supplier_type === 'Ground Handling').length,
  }), [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      if (activeTab !== 'all') {
        if (supplier.supplier_type !== activeTab) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (!((supplier.company_name || '').toLowerCase().includes(s) || (supplier.contact_name || '').toLowerCase().includes(s) || (supplier.country || '').toLowerCase().includes(s) || (supplier.station_iata || '').toLowerCase().includes(s))) return false;
      }
      if (advFilterType !== 'all' && supplier.supplier_type !== advFilterType) return false;
      if (advFilterCountry !== 'all' && supplier.country !== advFilterCountry) return false;
      if (advFilterStatus !== 'all' && supplier.status !== advFilterStatus) return false;
      if (advFilterName && !(supplier.company_name || '').toLowerCase().includes(advFilterName.toLowerCase())) return false;
      for (const col of columns) {
        const fv = columnFilters[col.key];
        if (fv && !String((supplier as any)[col.key] || '').toLowerCase().includes(fv.toLowerCase())) return false;
      }
      return true;
    });
  }, [suppliers, activeTab, search, advFilterType, advFilterCountry, advFilterStatus, advFilterName, columnFilters, columns]);

  const totalPages = Math.ceil(filteredSuppliers.length / pageSize);
  const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('gh_suppliers').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Supplier deleted successfully');
    fetchSuppliers();
  };

  const handleEditOpen = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setEditFormData({
      name: supplier.company_name, contactName: supplier.contact_name || '',
      designation: supplier.designation || '', email: supplier.email || '',
      phone: supplier.phone || '', fax: supplier.fax || '',
      supplierType: supplier.supplier_type, country: supplier.country || '',
      station: supplier.station_iata || '', remarks: supplier.remarks || '',
    });
  };

  const handleEditSave = async () => {
    if (!editSupplier) return;
    const { error } = await supabase.from('gh_suppliers').update({
      company_name: editFormData.name, contact_name: editFormData.contactName,
      designation: editFormData.designation, email: editFormData.email,
      phone: editFormData.phone, fax: editFormData.fax,
      supplier_type: editFormData.supplierType, country: editFormData.country,
      station_iata: editFormData.station, remarks: editFormData.remarks,
    }).eq('id', editSupplier.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Supplier updated successfully');
    setEditSupplier(null);
    fetchSuppliers();
  };

  const clearAdvancedFilters = () => {
    setAdvFilterType('all'); setAdvFilterCountry('all'); setAdvFilterStatus('all'); setAdvFilterName('');
  };

  const visibleColumns = columns.filter(c => c.visible);

  // View detail mode
  if (viewSupplier) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setViewSupplier(null)}><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                  <h1 className="text-2xl font-bold">{viewSupplier.company_name}</h1>
                  <p className="text-sm text-muted-foreground">{viewSupplier.station_iata}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(viewSupplier.status)}
                <Button onClick={() => { setViewSupplier(null); handleEditOpen(viewSupplier); }}>
                  <Pencil className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              <div><p className="text-sm text-primary font-medium">Type</p><p className="mt-1">{viewSupplier.supplier_type}</p></div>
              <div><p className="text-sm text-primary font-medium">Country</p><p className="mt-1">{viewSupplier.country || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Station</p><p className="mt-1">{viewSupplier.station_iata || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Contact Name</p><p className="mt-1">{viewSupplier.contact_name || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Designation</p><p className="mt-1">{viewSupplier.designation || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Email</p><p className="mt-1">{viewSupplier.email || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Phone</p><p className="mt-1">{viewSupplier.phone || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Fax</p><p className="mt-1">{viewSupplier.fax || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Valid From</p><p className="mt-1">{viewSupplier.valid_from || '-'}</p></div>
              <div><p className="text-sm text-primary font-medium">Valid Till</p><p className="mt-1">{viewSupplier.valid_till || '-'}</p></div>
              {viewSupplier.remarks && (
                <div className="md:col-span-3"><p className="text-sm text-primary font-medium">Remarks</p><p className="mt-1">{viewSupplier.remarks}</p></div>
              )}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
            <p className="text-muted-foreground">Manage your ground handling suppliers</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-[9999]">
                <DropdownMenuItem onClick={() => toast.success('Downloading as Excel')}>Download as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Downloading as PDF')}>Download as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={showAdvancedFilters ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button className="bg-primary" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />Add Supplier
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Advanced Filters</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAdvancedFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Type</Label>
                  <Select value={advFilterType} onValueChange={setAdvFilterType}>
                    <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Types</SelectItem>
                      {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Country</Label>
                  <Select value={advFilterCountry} onValueChange={setAdvFilterCountry}>
                    <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Countries</SelectItem>
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Status</Label>
                  <Select value={advFilterStatus} onValueChange={setAdvFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Supplier Name</Label>
                  <Input placeholder="Search by name" value={advFilterName} onChange={e => setAdvFilterName(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={clearAdvancedFilters}>Clear</Button>
                <Button size="sm" onClick={() => setShowAdvancedFilters(false)}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Types' },
            { key: 'Airport Authority', label: 'Airport Authority' },
            { key: 'Ground Handling', label: 'Ground Handling' },
          ].map(tab => (
            <Button key={tab.key} variant={activeTab === tab.key ? 'default' : 'outline'} size="sm"
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}>
              {tab.label} ({tabCounts[tab.key as keyof typeof tabCounts] || 0})
            </Button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Settings2 className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 bg-popover z-[9999]">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Show Columns</h4>
                  {columns.map(col => (
                    <div key={col.key} className="flex items-center gap-2">
                      <Checkbox id={`col-${col.key}`} checked={col.visible} onCheckedChange={() => setColumns(columns.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))} />
                      <label htmlFor={`col-${col.key}`} className="text-sm cursor-pointer">{col.label}</label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant={showColumnSearch ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setShowColumnSearch(!showColumnSearch)}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search all columns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="w-12">SL</TableHead>
                  {visibleColumns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                {showColumnSearch && (
                  <TableRow className="bg-muted/30">
                    <TableHead />
                    {visibleColumns.map(col => (
                      <TableHead key={`search-${col.key}`} className="py-2">
                        <Input placeholder={`Search ${col.label.toLowerCase()}...`} value={columnFilters[col.key]} onChange={(e) => setColumnFilters({ ...columnFilters, [col.key]: e.target.value })} className="h-8 text-sm" />
                      </TableHead>
                    ))}
                    <TableHead />
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.map((supplier, index) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium text-primary">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    {visibleColumns.map(col => (
                      <TableCell key={col.key}>
                        {col.key === 'company_name' ? <span className="font-medium">{supplier.company_name}</span>
                          : col.key === 'supplier_type' ? getTypeBadge(supplier.supplier_type)
                          : col.key === 'station_iata' ? <span className="font-semibold text-primary">{supplier.station_iata || '-'}</span>
                          : col.key === 'status' ? getStatusBadge(supplier.status)
                          : (supplier as any)[col.key] || '-'}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewSupplier(supplier)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(supplier)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(supplier.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedSuppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">No suppliers found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover z-[9999]">
              {[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Showing {filteredSuppliers.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredSuppliers.length)} of {filteredSuppliers.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1)).map(page => (
              <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setCurrentPage(page)}>{page}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <AddSupplierDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Edit Supplier Dialog */}
      <Dialog open={!!editSupplier} onOpenChange={(open) => !open && setEditSupplier(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Supplier Information</h3>
              <div className="space-y-2">
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Contact Name <span className="text-destructive">*</span></Label>
                <Input value={editFormData.contactName} onChange={e => setEditFormData({ ...editFormData, contactName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={editFormData.designation} onChange={e => setEditFormData({ ...editFormData, designation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Other Information</h3>
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select value={editFormData.supplierType} onValueChange={v => setEditFormData({ ...editFormData, supplierType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <SearchableSelect label="Country" required options={COUNTRIES} value={editFormData.country} onChange={v => setEditFormData({ ...editFormData, country: v, station: '' })} placeholder="Select country" />
              <div className="space-y-2">
                <Label>Station</Label>
                <Input value={editFormData.station} onChange={e => setEditFormData({ ...editFormData, station: e.target.value.toUpperCase() })} placeholder="IATA code (e.g. MLE)" maxLength={3} />
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Input value={editFormData.remarks} onChange={e => setEditFormData({ ...editFormData, remarks: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSupplier(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
