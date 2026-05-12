import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Pencil, Trash2, Check, X, Download, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Criterion {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function CriteriaList() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showColumnSearch, setShowColumnSearch] = useState(false);
  const [columnFilters, setColumnFilters] = useState({ name: '', description: '', status: '' });

  // Inline add
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [newCriterion, setNewCriterion] = useState({ name: '', description: '' });

  // Edit dialog
  const [editItem, setEditItem] = useState<Criterion | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const fetchCriteria = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gh_criteria').select('*').order('name');
    if (error) { toast.error('Failed to load criteria'); }
    else { setCriteria(data || []); }
    setLoading(false);
  };

  useEffect(() => { fetchCriteria(); }, []);

  const filteredCriteria = criteria.filter(c => {
    if (search) {
      const s = search.toLowerCase();
      if (!(c.name.toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s))) return false;
    }
    if (columnFilters.name && !c.name.toLowerCase().includes(columnFilters.name.toLowerCase())) return false;
    if (columnFilters.description && !(c.description || '').toLowerCase().includes(columnFilters.description.toLowerCase())) return false;
    if (columnFilters.status && !c.status.toLowerCase().includes(columnFilters.status.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCriteria.length / pageSize);
  const paginated = filteredCriteria.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleInlineAdd = async () => {
    if (!newCriterion.name.trim()) { toast.error('Criterion name is required'); return; }
    const { error } = await supabase.from('gh_criteria').insert({ name: newCriterion.name.trim(), description: newCriterion.description.trim() || null });
    if (error) { toast.error(error.message); return; }
    toast.success('Criterion added');
    setNewCriterion({ name: '', description: '' });
    setShowInlineAdd(false);
    fetchCriteria();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('gh_criteria').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Criterion deleted');
    fetchCriteria();
  };

  const handleEditOpen = (item: Criterion) => {
    setEditItem(item);
    setEditForm({ name: item.name, description: item.description || '' });
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    const { error } = await supabase.from('gh_criteria').update({ name: editForm.name, description: editForm.description || null }).eq('id', editItem.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Criterion updated');
    setEditItem(null);
    fetchCriteria();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Criteria</h1>
            <p className="text-muted-foreground">Manage pricing criteria for services (weight-based, per hour, sunrise/sunset, etc.)</p>
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
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant={showColumnSearch ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setShowColumnSearch(!showColumnSearch)}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search criteria..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="w-12">SL</TableHead>
                  <TableHead>Criterion Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInlineAdd(true)} title="Add new criterion">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
                {showColumnSearch && (
                  <TableRow className="bg-muted/30">
                    <TableHead />
                    <TableHead className="py-2"><Input placeholder="Search name..." value={columnFilters.name} onChange={(e) => setColumnFilters({ ...columnFilters, name: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search description..." value={columnFilters.description} onChange={(e) => setColumnFilters({ ...columnFilters, description: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead className="py-2"><Input placeholder="Search status..." value={columnFilters.status} onChange={(e) => setColumnFilters({ ...columnFilters, status: e.target.value })} className="h-8 text-sm" /></TableHead>
                    <TableHead />
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {showInlineAdd && (
                  <TableRow className="bg-muted/20">
                    <TableCell />
                    <TableCell>
                      <Input placeholder="Criterion Name *" value={newCriterion.name} onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })} className="h-8 text-sm" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Description (optional)" value={newCriterion.description} onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })} className="h-8 text-sm" />
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={handleInlineAdd}><Check className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setShowInlineAdd(false); setNewCriterion({ name: '', description: '' }); }}><X className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : paginated.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-primary">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-semibold">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                    <TableCell>
                      <Badge className={item.status === 'Active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted text-muted-foreground'}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && paginated.length === 0 && !showInlineAdd && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No criteria found</TableCell></TableRow>
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
            Showing {filteredCriteria.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, filteredCriteria.length)} of {filteredCriteria.length}
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

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Criterion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
