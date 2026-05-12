import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Pencil, Download, Settings2, ChevronLeft, ChevronRight, Trash2, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AIRCRAFT_TYPES = ['ATR-72', 'B737'];

interface Aircraft {
  id: string;
  aircraftType: string;
  registrationNo: string;
  weight: string;
  status: 'Active' | 'Inactive';
}

type ColumnKey = 'aircraftType' | 'registrationNo' | 'weight' | 'status';
interface ColumnConfig { key: ColumnKey; label: string; visible: boolean; }

const initialAircraft: Aircraft[] = [
  { id: '1', aircraftType: 'ATR-72', registrationNo: 'S2-AJV', weight: '23000', status: 'Active' },
  { id: '2', aircraftType: 'B737', registrationNo: 'S2-AJW', weight: '78000', status: 'Active' },
  { id: '3', aircraftType: 'B737', registrationNo: 'S2-AKA', weight: '79000', status: 'Active' },
  { id: '4', aircraftType: 'ATR-72', registrationNo: 'S2-AGQ', weight: '23000', status: 'Inactive' },
  { id: '5', aircraftType: 'B737', registrationNo: 'S2-AJX', weight: '78500', status: 'Active' },
];

export default function AircraftSetup() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(initialAircraft);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState<Aircraft | null>(null);

  // Advanced filters
  const [advFilterType, setAdvFilterType] = useState('all');
  const [advFilterStatus, setAdvFilterStatus] = useState('all');
  const [advFilterRegNo, setAdvFilterRegNo] = useState('');

  // Column filters
  const [columnFilters, setColumnFilters] = useState<Record<ColumnKey, string>>({
    aircraftType: '', registrationNo: '', weight: '', status: '',
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'aircraftType', label: 'Aircraft Type', visible: true },
    { key: 'registrationNo', label: 'Registration No', visible: true },
    { key: 'weight', label: 'Weight (kg)', visible: true },
    { key: 'status', label: 'Status', visible: true },
  ]);

  // Form state
  const [form, setForm] = useState({ aircraftType: '', registrationNo: '', weight: '', status: true });

  const tabCounts = useMemo(() => ({
    all: aircraft.length,
    'ATR-72': aircraft.filter(a => a.aircraftType === 'ATR-72').length,
    'B737': aircraft.filter(a => a.aircraftType === 'B737').length,
  }), [aircraft]);

  const filteredAircraft = useMemo(() => {
    return aircraft.filter(item => {
      // Default: show active only unless searching
      if (item.status !== 'Active' && !search && advFilterStatus === 'all') return false;

      // Tab filter
      if (activeTab !== 'all' && item.aircraftType !== activeTab) return false;

      // Global search
      if (search) {
        const s = search.toLowerCase();
        if (!(item.aircraftType.toLowerCase().includes(s) || item.registrationNo.toLowerCase().includes(s) || item.weight.includes(s))) return false;
      }

      // Advanced filters
      if (advFilterType !== 'all' && item.aircraftType !== advFilterType) return false;
      if (advFilterStatus !== 'all' && item.status !== advFilterStatus) return false;
      if (advFilterRegNo && !item.registrationNo.toLowerCase().includes(advFilterRegNo.toLowerCase())) return false;

      // Column filters
      for (const col of columns) {
        const fv = columnFilters[col.key];
        if (fv && !String(item[col.key] || '').toLowerCase().includes(fv.toLowerCase())) return false;
      }
      return true;
    });
  }, [aircraft, activeTab, search, advFilterType, advFilterStatus, advFilterRegNo, columnFilters, columns]);

  const totalPages = Math.ceil(filteredAircraft.length / pageSize);
  const paginated = filteredAircraft.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleColumns = columns.filter(c => c.visible);

  const clearAdvancedFilters = () => {
    setAdvFilterType('all');
    setAdvFilterStatus('all');
    setAdvFilterRegNo('');
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ aircraftType: '', registrationNo: '', weight: '', status: true });
    setShowAddDialog(true);
  };

  const openEdit = (item: Aircraft) => {
    setEditItem(item);
    setForm({ aircraftType: item.aircraftType, registrationNo: item.registrationNo, weight: item.weight, status: item.status === 'Active' });
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (!form.aircraftType || !form.registrationNo) {
      toast.error('Please fill required fields');
      return;
    }
    if (editItem) {
      setAircraft(prev => prev.map(a => a.id === editItem.id ? { ...a, aircraftType: form.aircraftType, registrationNo: form.registrationNo, weight: form.weight, status: form.status ? 'Active' : 'Inactive' } : a));
      toast.success('Aircraft updated successfully');
    } else {
      setAircraft(prev => [...prev, { id: Date.now().toString(), aircraftType: form.aircraftType, registrationNo: form.registrationNo, weight: form.weight, status: form.status ? 'Active' : 'Inactive' }]);
      toast.success('Aircraft added successfully');
    }
    setShowAddDialog(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setAircraft(prev => prev.filter(a => a.id !== id));
    toast.success('Aircraft deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aircraft Setup</h1>
            <p className="text-muted-foreground">Manage aircraft fleet</p>
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
            <Button variant={showAdvancedFilters ? 'default' : 'outline'} size="icon" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-primary" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />Add
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Advanced Filters</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAdvancedFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Aircraft Type</Label>
                  <Select value={advFilterType} onValueChange={setAdvFilterType}>
                    <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Types</SelectItem>
                      {AIRCRAFT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Registration No</Label>
                  <Input placeholder="Search by registration no" value={advFilterRegNo} onChange={e => setAdvFilterRegNo(e.target.value)} />
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
            { key: 'all', label: 'All' },
            { key: 'ATR-72', label: 'ATR-72' },
            { key: 'B737', label: 'B737' },
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
                {paginated.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-primary">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    {visibleColumns.map(col => (
                      <TableCell key={col.key}>
                        {col.key === 'aircraftType' ? <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{item.aircraftType}</Badge>
                          : col.key === 'status' ? <Badge className={item.status === 'Active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted text-muted-foreground'}>{item.status}</Badge>
                          : item[col.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow><TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">No aircraft found</TableCell></TableRow>
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
            Showing {filteredAircraft.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredAircraft.length)} of {filteredAircraft.length}
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

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => { if (!open) { setShowAddDialog(false); setEditItem(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Aircraft' : 'Add Aircraft'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-2">
              <Label>Aircraft Type <span className="text-destructive">*</span></Label>
              <Select value={form.aircraftType} onValueChange={v => setForm(f => ({ ...f, aircraftType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select aircraft type" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {AIRCRAFT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Aircraft Registration No <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. S2-AJV" value={form.registrationNo} onChange={e => setForm(f => ({ ...f, registrationNo: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label>Aircraft Weight (kg)</Label>
              <Input type="number" placeholder="Weight in kg" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Active Status</Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch checked={form.status} onCheckedChange={v => setForm(f => ({ ...f, status: v }))} />
                <span className="text-sm">{form.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditItem(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Aircraft'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
