import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GLSearchDialog } from '@/components/GLSearchDialog';

interface FCYGLMapping {
  id: string;
  currency: string;
  spotExchangeGLCode: string;
  spotExchangeGLName: string;
  gainLossGLCode: string;
  gainLossGLName: string;
}

export default function ForeignCurrencyExchangeGLSetup() {
  const { glEntries } = useApp();

  const [mappings, setMappings] = useState<FCYGLMapping[]>([
    {
      id: '1',
      currency: 'USD',
      spotExchangeGLCode: '42101001',
      spotExchangeGLName: 'USD-BDT Spot Exchange',
      gainLossGLCode: '42201001',
      gainLossGLName: 'Exchange Gain/Loss',
    },
  ]);

  const [formData, setFormData] = useState({
    currency: '',
    spotExchangeGLCode: '',
    spotExchangeGLName: '',
    gainLossGLCode: '',
    gainLossGLName: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [glSearchTarget, setGlSearchTarget] = useState<'spot' | 'gainLoss' | null>(null);
  const [isGLSearchOpen, setIsGLSearchOpen] = useState(false);

  // Table controls
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  const handleGLSearchOpen = (target: 'spot' | 'gainLoss') => {
    setGlSearchTarget(target);
    setIsGLSearchOpen(true);
  };

  const handleGLSelect = (entry: { glCode: string; glName: string }) => {
    if (glSearchTarget === 'spot') {
      setFormData(prev => ({ ...prev, spotExchangeGLCode: entry.glCode, spotExchangeGLName: entry.glName }));
    } else if (glSearchTarget === 'gainLoss') {
      setFormData(prev => ({ ...prev, gainLossGLCode: entry.glCode, gainLossGLName: entry.glName }));
    }
    setIsGLSearchOpen(false);
    setGlSearchTarget(null);
  };

  const handleSave = () => {
    if (!formData.currency || !formData.spotExchangeGLCode || !formData.gainLossGLCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setMappings(prev => prev.map(m =>
        m.id === editingId
          ? { ...m, ...formData }
          : m
      ));
      toast.success('Mapping updated successfully');
      setEditingId(null);
    } else {
      const exists = mappings.find(m => m.currency === formData.currency);
      if (exists) {
        toast.error('Mapping for this currency already exists');
        return;
      }
      setMappings(prev => [...prev, { id: crypto.randomUUID(), ...formData }]);
      toast.success('Mapping saved successfully');
    }

    handleReset();
  };

  const handleEdit = (mapping: FCYGLMapping) => {
    setEditingId(mapping.id);
    setFormData({
      currency: mapping.currency,
      spotExchangeGLCode: mapping.spotExchangeGLCode,
      spotExchangeGLName: mapping.spotExchangeGLName,
      gainLossGLCode: mapping.gainLossGLCode,
      gainLossGLName: mapping.gainLossGLName,
    });
  };

  const handleDelete = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
    toast.success('Mapping deleted');
  };

  const handleReset = () => {
    setFormData({ currency: '', spotExchangeGLCode: '', spotExchangeGLName: '', gainLossGLCode: '', gainLossGLName: '' });
    setEditingId(null);
  };

  const filteredMappings = mappings.filter(m =>
    !searchTerm ||
    m.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.spotExchangeGLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.gainLossGLName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'THB', name: 'Thai Baht' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary">Central Configuration</span> » Foreign Currency Exchange GL Code Setup
        </nav>

        {/* Form Section */}
        <Card>
          <CardContent className="pt-6">
            <fieldset className="border border-border rounded-md p-4">
              <legend className="text-sm font-semibold text-primary px-2 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">i</span>
                Foreign Currency Exchange Related Policy Setup
              </legend>
              <div className="space-y-4">
                {/* Currency */}
                <div className="grid grid-cols-[180px_1fr] items-center gap-3">
                  <Label className="text-right">Currency <span className="text-destructive">*</span></Label>
                  <Select value={formData.currency} onValueChange={v => setFormData(prev => ({ ...prev, currency: v }))}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="--Please Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((c: any) => (
                        <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Spot Exchange-FCY */}
                <div className="flex items-center gap-3">
                  <Label className="w-[180px] text-right shrink-0">Spot Exchange-FCY <span className="text-destructive">*</span></Label>
                  <Input
                    value={formData.spotExchangeGLCode}
                    onChange={e => setFormData(prev => ({ ...prev, spotExchangeGLCode: e.target.value }))}
                    placeholder="Enter GL Code"
                    className="w-60"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleGLSearchOpen('spot')}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-[180px] shrink-0" />
                  <Input value={formData.spotExchangeGLName} readOnly className="bg-muted w-72" />
                </div>

                {/* Gain / Loss Spot Exchange */}
                <div className="flex items-center gap-3">
                  <Label className="w-[180px] text-right shrink-0">Gain / Loss Spot Exchange <span className="text-destructive">*</span></Label>
                  <Input
                    value={formData.gainLossGLCode}
                    onChange={e => setFormData(prev => ({ ...prev, gainLossGLCode: e.target.value }))}
                    placeholder="Enter GL Code"
                    className="w-60"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleGLSearchOpen('gainLoss')}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-[180px] shrink-0" />
                  <Input value={formData.gainLossGLName} readOnly className="bg-muted w-72" />
                </div>
              </div>
            </fieldset>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleReset}>Reset</Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); handleReset(); }}>Cancel Edit</Button>
              )}
              <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Mapped GL Code Details */}
        <Card>
          <CardContent className="pt-6">
            <fieldset className="border border-border rounded-md p-4">
              <legend className="text-sm font-semibold text-primary px-2 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">i</span>
                Mapped GL Code Details
              </legend>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  Show
                  <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                    <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  entries
                </div>
                <div className="flex items-center gap-2 text-sm">
                  Search:
                  <Input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="h-8 w-48"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-semibold">Currency</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Spot Exchange-FCY</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Gain / Loss Spot Exchange</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMappings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No mappings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMappings.slice(0, parseInt(entriesPerPage)).map(mapping => (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-medium">{mapping.currency}</TableCell>
                          <TableCell>{mapping.spotExchangeGLName}</TableCell>
                          <TableCell>{mapping.gainLossGLName}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEdit(mapping)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(mapping.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </TableWithSearch>
              </div>
            </fieldset>
          </CardContent>
        </Card>
      </div>

      <GLSearchDialog open={isGLSearchOpen} onOpenChange={setIsGLSearchOpen} glEntries={glEntries} onSelect={handleGLSelect} />
    </DashboardLayout>
  );
}
