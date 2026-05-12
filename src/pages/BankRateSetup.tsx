import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BankRate {
  id: string;
  effectiveDate: string;
  currency: string;
  bankRate: number;
  status: 'active' | 'inactive';
  updatedBy: string;
  updatedAt: string;
}

const mockRates: BankRate[] = [
  { id: '1', effectiveDate: '2026-02-01', currency: 'BDT', bankRate: 110.50, status: 'active', updatedBy: 'Admin', updatedAt: '2026-02-01' },
  { id: '2', effectiveDate: '2026-01-15', currency: 'BDT', bankRate: 109.80, status: 'active', updatedBy: 'Admin', updatedAt: '2026-01-15' },
  { id: '3', effectiveDate: '2026-02-01', currency: 'SGD', bankRate: 0.75, status: 'active', updatedBy: 'Admin', updatedAt: '2026-02-01' },
  { id: '4', effectiveDate: '2026-02-01', currency: 'INR', bankRate: 83.50, status: 'active', updatedBy: 'Admin', updatedAt: '2026-02-01' },
  { id: '5', effectiveDate: '2025-12-01', currency: 'BDT', bankRate: 108.00, status: 'inactive', updatedBy: 'Admin', updatedAt: '2025-12-01' },
];

export default function BankRateSetup() {
  const [rates, setRates] = useState<BankRate[]>(mockRates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<BankRate | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ effectiveDate: format(new Date(), 'yyyy-MM-dd'), currency: 'BDT', bankRate: '' });

  const filteredRates = rates.filter(r => {
    const matchSearch = r.currency.toLowerCase().includes(searchTerm.toLowerCase()) || r.effectiveDate.includes(searchTerm);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredRates.length / pageSize);
  const paginatedRates = filteredRates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const currencies = ['BDT', 'SGD', 'INR', 'EUR', 'GBP', 'AED', 'MYR', 'THB'];

  const openAddDialog = () => { setEditingRate(null); setFormData({ effectiveDate: format(new Date(), 'yyyy-MM-dd'), currency: 'BDT', bankRate: '' }); setShowDialog(true); };
  const openEditDialog = (rate: BankRate) => { setEditingRate(rate); setFormData({ effectiveDate: rate.effectiveDate, currency: rate.currency, bankRate: rate.bankRate.toString() }); setShowDialog(true); };

  const handleSave = () => {
    if (!formData.bankRate) { toast.error('Please fill in all required fields'); return; }
    if (editingRate) {
      setRates(rates.map(r => r.id === editingRate.id ? { ...r, effectiveDate: formData.effectiveDate, currency: formData.currency, bankRate: parseFloat(formData.bankRate), updatedAt: format(new Date(), 'yyyy-MM-dd') } : r));
      toast.success('Bank rate updated successfully');
    } else {
      setRates([{ id: Date.now().toString(), effectiveDate: formData.effectiveDate, currency: formData.currency, bankRate: parseFloat(formData.bankRate), status: 'active', updatedBy: 'Admin', updatedAt: format(new Date(), 'yyyy-MM-dd') }, ...rates]);
      toast.success('Bank rate added successfully');
    }
    setShowDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Configuration</span> / Bank Rate Setup
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Bank Rate Setup</h1>
          <Button onClick={openAddDialog} className="gap-2"><Plus size={16} /> Add Rate</Button>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
          <p className="font-semibold text-primary">Bank Rate (USD Rate)</p>
          <p>Default exchange rate for all general (non-IATA) payments and transactions.</p>
          <p className="text-muted-foreground mt-1">All rates are expressed as: 1 USD = [Currency Amount]</p>
        </div>

        <div className="flex items-center gap-4 bg-card border rounded-lg p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by currency or date..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(s => (
              <Button key={s} variant={filterStatus === s ? 'default' : 'outline'} size="sm" onClick={() => { setFilterStatus(s); setCurrentPage(1); }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <TableWithSearch>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="text-table-header-foreground font-semibold w-12 text-center">SL</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">Effective Date</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">Currency</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-right">Bank Rate (1 USD =)</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-center">Status</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">Updated By</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRates.map((rate, idx) => (
                <TableRow key={rate.id}>
                  <TableCell className="text-center">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell>{rate.effectiveDate}</TableCell>
                  <TableCell className="font-medium">{rate.currency}</TableCell>
                  <TableCell className="text-right font-mono">{rate.bankRate.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${rate.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>{rate.status}</span>
                  </TableCell>
                  <TableCell>{rate.updatedBy}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(rate)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setRates(rates.filter(r => r.id !== rate.id)); toast.success('Deleted'); }}><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedRates.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No rates found</TableCell></TableRow>}
            </TableBody>
          </TableWithSearch>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">{[10, 20, 50].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
            </Select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></Button>
            <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingRate ? 'Edit Bank Rate' : 'Add New Bank Rate'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Effective Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Currency <span className="text-destructive">*</span></Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Bank Rate (1 USD = {formData.currency}) <span className="text-destructive">*</span></Label>
              <Input type="number" step="0.01" placeholder="e.g., 110.50" value={formData.bankRate} onChange={(e) => setFormData({ ...formData, bankRate: e.target.value })} />
              <p className="text-xs text-muted-foreground">Default rate for all non-IATA transactions</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingRate ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
