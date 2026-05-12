import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Pencil, Trash2, Check, X, Download, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';
import { SUPPLIER_TYPES, UNITS_OF_MEASUREMENT } from '@/lib/groundHandlingData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Service {
  id: string;
  service_code: string | null;
  service_name: string;
  supplier_type: string;
  unit_of_measurement: string;
  description: string | null;
  status: string;
  criteria: string[];
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  // Inline add row
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [newService, setNewService] = useState({ code: '', name: '', supplierType: '', unit: '', criteria: [] as string[] });
  const [newCriterion, setNewCriterion] = useState('');

  const [columnFilters, setColumnFilters] = useState({ code: '', name: '', supplierType: '', unit: '', criteria: '' });

  const fetchServices = async () => {
    setLoading(true);
    // Fetch services with their criteria via the junction table
    const { data: servicesData, error } = await supabase
      .from('gh_services')
      .select('*, gh_service_criteria(criteria_id, gh_criteria(name))')
      .order('service_name');

    if (error) {
      toast.error('Failed to load services');
      setLoading(false);
      return;
    }

    const mapped: Service[] = (servicesData || []).map((s: any) => ({
      id: s.id,
      service_code: s.service_code,
      service_name: s.service_name,
      supplier_type: s.supplier_type,
      unit_of_measurement: s.unit_of_measurement,
      description: s.description,
      status: s.status,
      criteria: (s.gh_service_criteria || [])
        .map((sc: any) => sc.gh_criteria?.name)
        .filter(Boolean),
    }));

    setServices(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (search) {
        const s = search.toLowerCase();
        if (!(service.service_name.toLowerCase().includes(s) || (service.service_code || '').toLowerCase().includes(s))) return false;
      }
      if (typeFilter !== 'all' && service.supplier_type !== typeFilter) return false;
      if (columnFilters.code && !(service.service_code || '').toLowerCase().includes(columnFilters.code.toLowerCase())) return false;
      if (columnFilters.name && !service.service_name.toLowerCase().includes(columnFilters.name.toLowerCase())) return false;
      if (columnFilters.supplierType && !service.supplier_type.toLowerCase().includes(columnFilters.supplierType.toLowerCase())) return false;
      if (columnFilters.unit && !service.unit_of_measurement.toLowerCase().includes(columnFilters.unit.toLowerCase())) return false;
      if (columnFilters.criteria && !service.criteria.some(c => c.toLowerCase().includes(columnFilters.criteria.toLowerCase()))) return false;
      return true;
    });
  }, [services, search, typeFilter, columnFilters]);

  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id: string) => {
    // Delete criteria links first, then the service
    await supabase.from('gh_service_criteria').delete().eq('service_id', id);
    const { error } = await supabase.from('gh_services').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Service deleted successfully');
    fetchServices();
  };

  const handleInlineAdd = async () => {
    if (!newService.name) { toast.error('Service name is required'); return; }
    if (!newService.supplierType) { toast.error('Supplier type is required'); return; }
    if (!newService.unit) { toast.error('Unit of measurement is required'); return; }

    const { error } = await supabase.from('gh_services').insert({
      service_code: newService.code || null,
      service_name: newService.name,
      supplier_type: newService.supplierType,
      unit_of_measurement: newService.unit,
    });

    if (error) { toast.error(error.message); return; }

    setNewService({ code: '', name: '', supplierType: '', unit: '', criteria: [] });
    setShowInlineAdd(false);
    toast.success('Service added');
    fetchServices();
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setNewService({ ...newService, criteria: [...newService.criteria, newCriterion.trim()] });
      setNewCriterion('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage ground handling services ({services.length} total)</p>
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
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant={showFilters || typeFilter !== 'all' ? 'default' : 'outline'} size="icon"><Search className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 bg-popover z-[9999]">
                <div className="space-y-4">
                  <h4 className="font-medium">Filters</h4>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Supplier Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                      <SelectContent className="bg-popover z-[9999]">
                        <SelectItem value="all">All Types</SelectItem>
                        {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setTypeFilter('all'); setShowFilters(false); }}>Clear</Button>
                    <Button size="sm" className="flex-1" onClick={() => setShowFilters(false)}>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
                </div>
              </PopoverContent>
            </Popover>
            <Button variant={showColumnSearch ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setShowColumnSearch(!showColumnSearch)}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="w-12">SL</TableHead>
                  <TableHead>Service Code</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Supplier Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInlineAdd(true)} title="Add new service">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
                {showColumnSearch && (
                  <TableRow className="bg-muted/30">
                    <TableHead />
                    <TableHead className="py-2"><Input placeholder="Search code..." value={columnFilters.code} onChange={(e) => setColumnFilters({ ...columnFilters, code: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search name..." value={columnFilters.name} onChange={(e) => setColumnFilters({ ...columnFilters, name: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search type..." value={columnFilters.supplierType} onChange={(e) => setColumnFilters({ ...columnFilters, supplierType: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search unit..." value={columnFilters.unit} onChange={(e) => setColumnFilters({ ...columnFilters, unit: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search criteria..." value={columnFilters.criteria} onChange={(e) => setColumnFilters({ ...columnFilters, criteria: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead />
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {/* Inline Add Row */}
                {showInlineAdd && (
                  <TableRow className="bg-muted/20">
                    <TableCell />
                    <TableCell>
                      <Input placeholder="Code (optional)" value={newService.code} onChange={(e) => setNewService({ ...newService, code: e.target.value })} className="h-8 text-sm w-24" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Service Name *" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="h-8 text-sm" />
                    </TableCell>
                    <TableCell>
                      <Select value={newService.supplierType} onValueChange={(v) => setNewService({ ...newService, supplierType: v })}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Type *" /></SelectTrigger>
                        <SelectContent className="bg-popover z-[9999]">
                          {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={newService.unit} onValueChange={(v) => setNewService({ ...newService, unit: v })}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Unit *" /></SelectTrigger>
                        <SelectContent className="bg-popover z-[9999]">
                          {UNITS_OF_MEASUREMENT.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input placeholder="Add criterion" value={newCriterion} onChange={(e) => setNewCriterion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCriterion(); } }} className="h-8 text-sm w-28" />
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddCriterion}><Plus className="h-3 w-3" /></Button>
                      </div>
                      {newService.criteria.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {newService.criteria.map((c, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {c}
                              <button onClick={() => setNewService({ ...newService, criteria: newService.criteria.filter((_, j) => j !== i) })} className="ml-1"><X className="h-2 w-2" /></button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={handleInlineAdd}><Check className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setShowInlineAdd(false); setNewService({ code: '', name: '', supplierType: '', unit: '', criteria: [] }); }}><X className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading services...</TableCell>
                  </TableRow>
                ) : paginatedServices.map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium text-primary">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{service.service_code || '-'}</TableCell>
                    <TableCell className="font-semibold">{service.service_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{service.supplier_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50 text-xs">{service.unit_of_measurement}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.criteria.slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                        {service.criteria.length > 2 && <Badge variant="outline" className="text-xs">+{service.criteria.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && paginatedServices.length === 0 && !showInlineAdd && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No services found</TableCell>
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
            Showing {filteredServices.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredServices.length)} of {filteredServices.length}
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
    </DashboardLayout>
  );
}
