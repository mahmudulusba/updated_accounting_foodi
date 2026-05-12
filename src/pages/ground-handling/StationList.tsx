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
import { Search, Plus, Eye, Pencil, Download, Settings2, ChevronLeft, ChevronRight, Trash2, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { STATION_TYPES, COUNTRIES, REGIONS } from '@/lib/groundHandlingData';
import { AddStationDialog } from '@/components/ground-handling/AddStationDialog';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Station {
  id: string;
  type: 'Domestic' | 'International';
  iata_code: string;
  icao_code: string;
  name: string;
  country: string;
  region: string;
  status: 'Active' | 'Inactive';
}

type ColumnKey = 'iata_code' | 'icao_code' | 'name' | 'type' | 'country' | 'region' | 'status';

interface ColumnConfig { key: ColumnKey; label: string; visible: boolean; }

export default function StationList() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const fetchStations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gh_stations').select('*').order('iata_code');
    if (!error && data) setStations(data as Station[]);
    setLoading(false);
  };

  useEffect(() => { fetchStations(); }, []);
  const [activeTab, setActiveTab] = useState<string>('Domestic');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Advanced filter state
  const [advFilterType, setAdvFilterType] = useState('all');
  const [advFilterCountry, setAdvFilterCountry] = useState('all');
  const [advFilterRegion, setAdvFilterRegion] = useState('all');
  const [advFilterStatus, setAdvFilterStatus] = useState('all');
  const [advFilterIata, setAdvFilterIata] = useState('');
  const [advFilterIcao, setAdvFilterIcao] = useState('');
  const [advFilterName, setAdvFilterName] = useState('');

  // Edit dialog state
  const [editStation, setEditStation] = useState<Station | null>(null);
  const [editFormData, setEditFormData] = useState({
    stationType: [] as string[],
    iataCode: '',
    icaoCode: '',
    stationName: '',
    country: '',
    region: '',
  });

  const [columnFilters, setColumnFilters] = useState<Record<ColumnKey, string>>({
    iata_code: '', icao_code: '', name: '', type: '', country: '', region: '', status: '',
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'iata_code', label: 'IATA Code', visible: true },
    { key: 'icao_code', label: 'ICAO Code', visible: true },
    { key: 'name', label: 'Station Name', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'country', label: 'Country', visible: true },
    { key: 'region', label: 'Region', visible: true },
    { key: 'status', label: 'Status', visible: true },
  ]);

  const tabCounts = useMemo(() => ({
    Domestic: stations.filter(s => s.type === 'Domestic').length,
    International: stations.filter(s => s.type === 'International').length,
  }), [stations]);

  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Tab filter
      if (activeTab === 'Domestic' && station.type !== 'Domestic') return false;
      if (activeTab === 'International' && station.type !== 'International') return false;

      // Global search
      if (search) {
        const s = search.toLowerCase();
        if (!(station.iata_code.toLowerCase().includes(s) || station.icao_code.toLowerCase().includes(s) || station.name.toLowerCase().includes(s) || station.country.toLowerCase().includes(s) || station.region.toLowerCase().includes(s))) return false;
      }

      // Advanced filters
      if (advFilterType !== 'all' && station.type !== advFilterType) return false;
      if (advFilterCountry !== 'all' && station.country !== advFilterCountry) return false;
      if (advFilterRegion !== 'all' && station.region !== advFilterRegion) return false;
      if (advFilterStatus !== 'all' && station.status !== advFilterStatus) return false;
      if (advFilterIata && !station.iata_code.toLowerCase().includes(advFilterIata.toLowerCase())) return false;
      if (advFilterIcao && !station.icao_code.toLowerCase().includes(advFilterIcao.toLowerCase())) return false;
      if (advFilterName && !station.name.toLowerCase().includes(advFilterName.toLowerCase())) return false;

      // Column filters
      for (const col of columns) {
        const fv = columnFilters[col.key];
        if (fv && !String(station[col.key] || '').toLowerCase().includes(fv.toLowerCase())) return false;
      }
      return true;
    });
  }, [stations, activeTab, search, advFilterType, advFilterCountry, advFilterRegion, advFilterStatus, advFilterIata, advFilterIcao, advFilterName, columnFilters, columns]);

  const totalPages = Math.ceil(filteredStations.length / pageSize);
  const paginatedStations = filteredStations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('gh_stations').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Station deleted successfully');
    fetchStations();
  };

  const handleEditOpen = (station: Station) => {
    setEditStation(station);
    setEditFormData({
      stationType: [station.type],
      iataCode: station.iata_code,
      icaoCode: station.icao_code,
      stationName: station.name,
      country: station.country,
      region: station.region,
    });
  };

  const handleEditSave = async () => {
    if (!editStation) return;
    const { error } = await supabase.from('gh_stations').update({
      type: editFormData.stationType[0],
      iata_code: editFormData.iataCode,
      icao_code: editFormData.icaoCode,
      name: editFormData.stationName,
      country: editFormData.country,
      region: editFormData.region,
    }).eq('id', editStation.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Station updated successfully');
    setEditStation(null);
    fetchStations();
  };

  const clearAdvancedFilters = () => {
    setAdvFilterType('all');
    setAdvFilterCountry('all');
    setAdvFilterRegion('all');
    setAdvFilterStatus('all');
    setAdvFilterIata('');
    setAdvFilterIcao('');
    setAdvFilterName('');
  };

  const visibleColumns = columns.filter(c => c.visible);

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'International': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Domestic': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Hub': return 'bg-primary/10 text-primary border-primary/20';
      case 'Cargo': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const toggleStationType = (type: string) => {
    setEditFormData(prev => ({
      ...prev,
      stationType: prev.stationType.includes(type)
        ? prev.stationType.filter(t => t !== type)
        : [...prev.stationType, type],
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stations</h1>
            <p className="text-muted-foreground">Manage airport stations</p>
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
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-primary" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />Add
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
                    <SelectTrigger><SelectValue placeholder="Select types" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Types</SelectItem>
                      {STATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                  <Label className="text-xs font-medium text-primary">Region</Label>
                  <Select value={advFilterRegion} onValueChange={setAdvFilterRegion}>
                    <SelectTrigger><SelectValue placeholder="All Regions" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Regions</SelectItem>
                      {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">IATA Code</Label>
                  <Input placeholder="Enter IATA Code (e.g., DAC)" value={advFilterIata} onChange={e => setAdvFilterIata(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">ICAO Code</Label>
                  <Input placeholder="Enter ICAO Code (e.g., VGHS)" value={advFilterIcao} onChange={e => setAdvFilterIcao(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-primary">Station Name</Label>
                  <Input placeholder="Search by station name" value={advFilterName} onChange={e => setAdvFilterName(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={clearAdvancedFilters}>Clear</Button>
                <Button size="sm" onClick={() => setShowAdvancedFilters(false)}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs - Domestic / International only */}
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

        {/* Toolbar - tighter spacing */}
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
                {paginatedStations.map((station, index) => (
                  <TableRow key={station.id}>
                    <TableCell className="font-medium text-primary">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    {visibleColumns.map(col => (
                      <TableCell key={col.key}>
                        {col.key === 'iata_code' ? <span className="font-semibold text-primary">{station.iata_code}</span>
                          : col.key === 'type' ? <Badge variant="outline" className={getTypeBadgeStyle(station.type)}>{station.type}</Badge>
                          : col.key === 'status' ? <Badge className={station.status === 'Active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted text-muted-foreground'}>{station.status}</Badge>
                          : station[col.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(station)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(station.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedStations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">No stations found</TableCell>
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
            Showing {filteredStations.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredStations.length)} of {filteredStations.length}
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

      {/* Add Station Dialog */}
      <AddStationDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Edit Station Dialog */}
      <Dialog open={!!editStation} onOpenChange={(open) => !open && setEditStation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Station</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Col 1 */}
            <div className="space-y-2">
              <Label>Station Type <span className="text-destructive">*</span></Label>
              <MultiSelectDropdown
                label=""
                options={STATION_TYPES}
                selected={editFormData.stationType}
                onChange={(s) => setEditFormData({ ...editFormData, stationType: s })}
                placeholder="Select station type(s)"
                searchable
              />
            </div>
            <div className="space-y-2">
              <Label>IATA Code <span className="text-destructive">*</span></Label>
              <Input placeholder="E.G., DAC" value={editFormData.iataCode} onChange={e => setEditFormData({ ...editFormData, iataCode: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
            <div className="space-y-2">
              <Label>Station Name <span className="text-destructive">*</span></Label>
              <Input placeholder="Enter station name" value={editFormData.stationName} onChange={e => setEditFormData({ ...editFormData, stationName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>ICAO Code <span className="text-destructive">*</span></Label>
              <Input placeholder="E.G., VGZR" value={editFormData.icaoCode} onChange={e => setEditFormData({ ...editFormData, icaoCode: e.target.value.toUpperCase() })} maxLength={4} />
            </div>
            <SearchableSelect
              label="Country"
              required
              options={COUNTRIES}
              value={editFormData.country}
              onChange={v => setEditFormData({ ...editFormData, country: v })}
              placeholder="Select country"
            />
            <div className="space-y-2">
              <Label>Region <span className="text-destructive">*</span></Label>
              <Select value={editFormData.region} onValueChange={v => setEditFormData({ ...editFormData, region: v })}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStation(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
