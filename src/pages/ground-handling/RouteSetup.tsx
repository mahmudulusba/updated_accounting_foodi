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
import { toast } from 'sonner';

const FLIGHT_TYPES = ['International', 'Domestic'];
const STATIONS = ['DAC - Dhaka', 'CGP - Chittagong', 'CXB - Cox\'s Bazar', 'ZYL - Sylhet', 'RJH - Rajshahi', 'JSR - Jessore', 'SPD - Saidpur', 'BZL - Barishal', 'DXB - Dubai', 'KUL - Kuala Lumpur', 'SIN - Singapore', 'BKK - Bangkok', 'CCU - Kolkata', 'DEL - Delhi', 'DOH - Doha', 'MCT - Muscat', 'GYD - Baku', 'JED - Jeddah', 'RUH - Riyadh', 'MLE - Male'];

interface RouteItem {
  id: string;
  routeName: string;
  flightType: string;
  startingStation: string;
  destinationStation: string;
  distance: string;
  status: 'Active' | 'Inactive';
}

type ColumnKey = 'routeName' | 'flightType' | 'startingStation' | 'destinationStation' | 'distance' | 'status';
interface ColumnConfig { key: ColumnKey; label: string; visible: boolean; }

const initialRoutes: RouteItem[] = [
  { id: '1', routeName: 'DAC-DXB', flightType: 'International', startingStation: 'DAC - Dhaka', destinationStation: 'DXB - Dubai', distance: '2200', status: 'Active' },
  { id: '2', routeName: 'DAC-CGP', flightType: 'Domestic', startingStation: 'DAC - Dhaka', destinationStation: 'CGP - Chittagong', distance: '135', status: 'Active' },
  { id: '3', routeName: 'DAC-KUL', flightType: 'International', startingStation: 'DAC - Dhaka', destinationStation: 'KUL - Kuala Lumpur', distance: '1900', status: 'Active' },
  { id: '4', routeName: 'DAC-CXB', flightType: 'Domestic', startingStation: 'DAC - Dhaka', destinationStation: 'CXB - Cox\'s Bazar', distance: '180', status: 'Active' },
  { id: '5', routeName: 'DAC-SIN', flightType: 'International', startingStation: 'DAC - Dhaka', destinationStation: 'SIN - Singapore', distance: '1800', status: 'Inactive' },
  { id: '6', routeName: 'DAC-CCU', flightType: 'International', startingStation: 'DAC - Dhaka', destinationStation: 'CCU - Kolkata', distance: '250', status: 'Active' },
];

export default function RouteSetup() {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Domestic');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState<RouteItem | null>(null);

  // Advanced filters
  const [advFilterFlightType, setAdvFilterFlightType] = useState('all');
  const [advFilterStatus, setAdvFilterStatus] = useState('all');
  const [advFilterStartStation, setAdvFilterStartStation] = useState('all');
  const [advFilterRouteName, setAdvFilterRouteName] = useState('');

  // Column filters
  const [columnFilters, setColumnFilters] = useState<Record<ColumnKey, string>>({
    routeName: '', flightType: '', startingStation: '', destinationStation: '', distance: '', status: '',
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'routeName', label: 'Route Name', visible: true },
    { key: 'flightType', label: 'Flight Type', visible: true },
    { key: 'startingStation', label: 'Starting Station', visible: true },
    { key: 'destinationStation', label: 'Destination Station', visible: true },
    { key: 'distance', label: 'Distance (NM)', visible: true },
    { key: 'status', label: 'Status', visible: true },
  ]);

  // Form state
  const [form, setForm] = useState({ routeName: '', flightType: '', startingStation: '', destinationStation: '', distance: '' });

  const tabCounts = useMemo(() => ({
    Domestic: routes.filter(r => r.flightType === 'Domestic').length,
    International: routes.filter(r => r.flightType === 'International').length,
  }), [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(item => {
      // Default: show active only unless searching
      if (item.status !== 'Active' && !search && advFilterStatus === 'all') return false;

      // Tab filter
      if (activeTab === 'Domestic' && item.flightType !== 'Domestic') return false;
      if (activeTab === 'International' && item.flightType !== 'International') return false;

      // Global search
      if (search) {
        const s = search.toLowerCase();
        if (!(item.routeName.toLowerCase().includes(s) || item.startingStation.toLowerCase().includes(s) || item.destinationStation.toLowerCase().includes(s) || item.flightType.toLowerCase().includes(s))) return false;
      }

      // Advanced filters
      if (advFilterFlightType !== 'all' && item.flightType !== advFilterFlightType) return false;
      if (advFilterStatus !== 'all' && item.status !== advFilterStatus) return false;
      if (advFilterStartStation !== 'all' && item.startingStation !== advFilterStartStation) return false;
      if (advFilterRouteName && !item.routeName.toLowerCase().includes(advFilterRouteName.toLowerCase())) return false;

      // Column filters
      for (const col of columns) {
        const fv = columnFilters[col.key];
        if (fv && !String(item[col.key] || '').toLowerCase().includes(fv.toLowerCase())) return false;
      }
      return true;
    });
  }, [routes, activeTab, search, advFilterFlightType, advFilterStatus, advFilterStartStation, advFilterRouteName, columnFilters, columns]);

  const totalPages = Math.ceil(filteredRoutes.length / pageSize);
  const paginated = filteredRoutes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleColumns = columns.filter(c => c.visible);

  const clearAdvancedFilters = () => {
    setAdvFilterFlightType('all');
    setAdvFilterStatus('all');
    setAdvFilterStartStation('all');
    setAdvFilterRouteName('');
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ routeName: '', flightType: '', startingStation: '', destinationStation: '', distance: '' });
    setShowAddDialog(true);
  };

  const openEdit = (item: RouteItem) => {
    setEditItem(item);
    setForm({ routeName: item.routeName, flightType: item.flightType, startingStation: item.startingStation, destinationStation: item.destinationStation, distance: item.distance });
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (!form.routeName || !form.flightType || !form.startingStation || !form.destinationStation) {
      toast.error('Please fill required fields');
      return;
    }
    if (editItem) {
      setRoutes(prev => prev.map(r => r.id === editItem.id ? { ...r, ...form } : r));
      toast.success('Route updated successfully');
    } else {
      setRoutes(prev => [...prev, { id: Date.now().toString(), ...form, status: 'Active' }]);
      toast.success('Route added successfully');
    }
    setShowAddDialog(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    toast.success('Route deleted successfully');
  };

  const getFlightTypeBadge = (type: string) => {
    return type === 'International' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Route Setup</h1>
            <p className="text-muted-foreground">Manage flight routes</p>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Flight Type</Label>
                  <Select value={advFilterFlightType} onValueChange={setAdvFilterFlightType}>
                    <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Types</SelectItem>
                      {FLIGHT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Starting Station</Label>
                  <Select value={advFilterStartStation} onValueChange={setAdvFilterStartStation}>
                    <SelectTrigger><SelectValue placeholder="All Stations" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Stations</SelectItem>
                      {STATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                  <Label className="text-xs font-medium text-primary">Route Name</Label>
                  <Input placeholder="Search by route name" value={advFilterRouteName} onChange={e => setAdvFilterRouteName(e.target.value)} />
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
            { key: 'Domestic', label: 'Domestic' },
            { key: 'International', label: 'International' },
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
                        {col.key === 'routeName' ? <span className="font-semibold text-primary">{item.routeName}</span>
                          : col.key === 'flightType' ? <Badge variant="outline" className={getFlightTypeBadge(item.flightType)}>{item.flightType}</Badge>
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
                  <TableRow><TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">No routes found</TableCell></TableRow>
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
            Showing {filteredRoutes.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredRoutes.length)} of {filteredRoutes.length}
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
            <DialogTitle>{editItem ? 'Edit Route' : 'Add Route'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-2">
              <Label>Route Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. DAC-DXB" value={form.routeName} onChange={e => setForm(f => ({ ...f, routeName: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label>Flight Type <span className="text-destructive">*</span></Label>
              <Select value={form.flightType} onValueChange={v => setForm(f => ({ ...f, flightType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select flight type" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {FLIGHT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Starting Station <span className="text-destructive">*</span></Label>
              <Select value={form.startingStation} onValueChange={v => setForm(f => ({ ...f, startingStation: v }))}>
                <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {STATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Station <span className="text-destructive">*</span></Label>
              <Select value={form.destinationStation} onValueChange={v => setForm(f => ({ ...f, destinationStation: v }))}>
                <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {STATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Distance (Nautical Miles)</Label>
              <Input type="number" placeholder="Distance in NM" value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditItem(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Route'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
