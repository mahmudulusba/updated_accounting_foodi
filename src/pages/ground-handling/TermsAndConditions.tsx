import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Eye, Pencil, Trash2, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Payment', 'Dispute Resolution', 'Liability', 'Cancellation', 'Service Level', 'Compliance'];

const mockTerms = [
  { id: '1', title: 'General Payment Terms', category: 'Payment', effectiveDate: '2024-01-01', expiryDate: '-', status: 'Active', createdBy: 'Admin' },
  { id: '2', title: 'Service Dispute Resolution', category: 'Dispute Resolution', effectiveDate: '2024-01-01', expiryDate: '-', status: 'Active', createdBy: 'Admin' },
  { id: '3', title: 'Ground Handling Liability', category: 'Liability', effectiveDate: '2024-01-01', expiryDate: '-', status: 'Active', createdBy: 'Admin' },
  { id: '4', title: 'Cancellation Policy', category: 'Cancellation', effectiveDate: '2024-01-01', expiryDate: '-', status: 'Active', createdBy: 'Admin' },
];

export default function TermsAndConditions() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newEffDate, setNewEffDate] = useState('');
  const [newExpDate, setNewExpDate] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredTerms = mockTerms.filter(t => {
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleAdd = () => {
    if (!newTitle || !newCategory || !newEffDate || !newContent) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Terms added successfully');
    setShowAddDialog(false);
    setNewTitle(''); setNewCategory(''); setNewEffDate(''); setNewExpDate(''); setNewContent('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Terms and Conditions</h1>
            <p className="text-muted-foreground">Manage agreement terms and conditions</p>
          </div>
          <Button className="bg-primary" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Terms
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search terms..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerms.map(term => (
                  <TableRow key={term.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{term.title}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{term.category}</Badge></TableCell>
                    <TableCell>{term.effectiveDate}</TableCell>
                    <TableCell>{term.expiryDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{term.status}</Badge>
                    </TableCell>
                    <TableCell>{term.createdBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Terms & Conditions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-medium">Title *</Label>
                  <Input placeholder="Enter title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium">Category *</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-medium">Effective Date *</Label>
                  <Input type="date" value={newEffDate} onChange={e => setNewEffDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium">Expiry Date</Label>
                  <Input type="date" value={newExpDate} onChange={e => setNewExpDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Content *</Label>
                <Textarea placeholder="Enter terms and conditions content..." value={newContent} onChange={e => setNewContent(e.target.value)} className="min-h-[120px]" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={handleAdd}>Add Terms</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
