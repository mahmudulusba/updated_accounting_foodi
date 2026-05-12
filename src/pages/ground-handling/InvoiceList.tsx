import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Checkbox } from '@/components/ui/checkbox';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Search, Plus, Eye, Pencil, Download, Trash2, Settings2, ChevronLeft, ChevronRight, LayoutGrid, List, Calendar, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockInvoices, mockStations } from '@/lib/groundHandlingData';
import { toast } from 'sonner';
import { format, differenceInDays, parseISO } from 'date-fns';

type ViewMode = 'list' | 'grid';
type ColumnKey = 'invoiceNo' | 'supplier' | 'station' | 'amount' | 'currency' | 'invoiceDate' | 'dueDate' | 'status';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid': return <Badge className="bg-success/20 text-success border-success/30">{status}</Badge>;
    case 'Pending': return <Badge className="bg-primary/20 text-primary border-primary/30">{status}</Badge>;
    case 'Due Soon': return <Badge className="bg-warning/20 text-warning border-warning/30">{status}</Badge>;
    case 'Overdue': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const getDaysUntilDue = (dueDate: string) => differenceInDays(parseISO(dueDate), new Date());

export default function InvoiceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<ColumnKey, string>>({
    invoiceNo: '', supplier: '', station: '', amount: '', currency: '', invoiceDate: '', dueDate: '', status: '',
  });
  const [columns, setColumns] = useState([
    { key: 'invoiceNo' as ColumnKey, label: 'Invoice No', visible: true },
    { key: 'supplier' as ColumnKey, label: 'Supplier', visible: true },
    { key: 'station' as ColumnKey, label: 'Station', visible: true },
    { key: 'amount' as ColumnKey, label: 'Amount', visible: true },
    { key: 'invoiceDate' as ColumnKey, label: 'Invoice Date', visible: true },
    { key: 'dueDate' as ColumnKey, label: 'Due Date', visible: true },
    { key: 'status' as ColumnKey, label: 'Status', visible: true },
  ]);

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(invoice => {
      if (search) {
        const s = search.toLowerCase();
        if (!(invoice.invoiceNo.toLowerCase().includes(s) || invoice.supplier.toLowerCase().includes(s))) return false;
      }
      if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
      if (stationFilter !== 'all' && invoice.station !== stationFilter) return false;
      for (const col of columns) {
        const fv = columnFilters[col.key];
        if (fv && !String((invoice as any)[col.key] || '').toLowerCase().includes(fv.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, statusFilter, stationFilter, columnFilters, columns]);

  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleColumns = columns.filter(c => c.visible);

  const handleDelete = (id: string) => toast.success('Invoice deleted successfully');

  const renderCellValue = (invoice: typeof mockInvoices[0], key: ColumnKey) => {
    switch (key) {
      case 'invoiceNo': return <span className="font-semibold text-primary">{invoice.invoiceNo}</span>;
      case 'amount': return <span className="font-medium">{invoice.currency} {invoice.amount.toLocaleString()}</span>;
      case 'invoiceDate': return format(parseISO(invoice.invoiceDate), 'dd-MMM-yyyy');
      case 'dueDate': return format(parseISO(invoice.dueDate), 'dd-MMM-yyyy');
      case 'status': return getStatusBadge(invoice.status);
      case 'station': return <span className="font-semibold text-primary">{invoice.station}</span>;
      default: return (invoice as any)[key];
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Manage ground handling invoices</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-[9999]">
                <DropdownMenuItem onClick={() => toast.success('Downloading as Excel')}>Download as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Downloading as PDF')}>Download as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-primary" onClick={() => navigate('/management/ground-handling/invoice/add')}>
              <Plus className="h-4 w-4 mr-2" />Add Invoice
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'Pending', 'Due Soon', 'Overdue', 'Paid'].map(status => (
            <Button key={status} variant={statusFilter === status ? 'default' : 'outline'} size="sm"
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}>
              {status === 'all' ? 'All' : status} ({status === 'all' ? mockInvoices.length : mockInvoices.filter(i => i.status === status).length})
            </Button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {viewMode === 'list' && (
              <>
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
              </>
            )}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant={showFilters || stationFilter !== 'all' ? 'default' : 'outline'} size="sm">
                  <Search className="h-4 w-4 mr-1" />Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 bg-popover z-[9999]">
                <div className="space-y-4">
                  <h4 className="font-medium">Filters</h4>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Station</label>
                    <Select value={stationFilter} onValueChange={setStationFilter}>
                      <SelectTrigger><SelectValue placeholder="All Stations" /></SelectTrigger>
                      <SelectContent className="bg-popover z-[9999]">
                        <SelectItem value="all">All Stations</SelectItem>
                        {mockStations.map(s => <SelectItem key={s.id} value={s.iataCode}>{s.iataCode}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setStationFilter('all'); setShowFilters(false); }}>Clear</Button>
                    <Button size="sm" className="flex-1" onClick={() => setShowFilters(false)}>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
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
                          <Input placeholder="Search..." value={columnFilters[col.key]} onChange={(e) => setColumnFilters({ ...columnFilters, [col.key]: e.target.value })} className="h-8 text-sm" />
                        </TableHead>
                      ))}
                      <TableHead />
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice, index) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-primary">
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      {visibleColumns.map(col => <TableCell key={col.key}>{renderCellValue(invoice, col.key)}</TableCell>)}
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(invoice.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedInvoices.length === 0 && (
                    <TableRow><TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>
                  )}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedInvoices.map(invoice => {
              const daysUntilDue = getDaysUntilDue(invoice.dueDate);
              const isDueSoon = daysUntilDue <= 7 && daysUntilDue > 0;
              return (
                <HoverCard key={invoice.id}>
                  <HoverCardTrigger asChild>
                    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${
                      invoice.status === 'Overdue' ? 'border-destructive/50' : isDueSoon ? 'border-warning/50' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-primary">{invoice.invoiceNo}</h3>
                            <p className="text-sm text-muted-foreground">{invoice.supplier}</p>
                          </div>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Station</span>
                            <span className="font-medium">{invoice.station}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-semibold">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Invoice Date</span>
                            <span>{format(parseISO(invoice.invoiceDate), 'dd-MMM-yyyy')}</span>
                          </div>
                        </div>
                        {isDueSoon && (
                          <div className="mt-3 flex items-center gap-1 text-warning text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Due in {daysUntilDue} days</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-popover z-[9999]">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Due Date:</span>
                        <span className={daysUntilDue < 0 ? 'text-destructive font-semibold' : ''}>
                          {format(parseISO(invoice.dueDate), 'dd-MMM-yyyy')}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1"><Eye className="h-3 w-3 mr-1" />View</Button>
                        <Button size="sm" variant="outline" className="flex-1"><Pencil className="h-3 w-3 mr-1" />Edit</Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover z-[9999]">
              {[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Showing {filteredInvoices.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length}
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
