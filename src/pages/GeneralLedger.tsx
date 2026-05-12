import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Edit2, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const accountTypes = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];
const currencyOptions = ['BDT', 'USD', 'EUR', 'GBP', 'SGD', 'INR'];
const reconForOptions = ['GL', 'Bank', 'Cash'];

const initialFormData = {
  parentGLCode: '',
  parentGLName: '',
  accountType: '',
  currency: 'BDT',
  reconAccount: 'no' as 'yes' | 'no',
  reconGLFor: '',
  isCashLedger: 'no' as 'yes' | 'no',
  description: '',
  glCode: '',
  glName: '',
  glLevel: '',
  manualTransaction: 'no' as 'yes' | 'no',
  autoTransaction: 'yes' as 'yes' | 'no',
  status: true,
};

export default function GeneralLedger() {
  const { glEntries, addGLEntry } = useApp();

  const filteredGLEntries = glEntries;
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [colFilters, setColFilters] = useState({
    glName: '',
    glCode: '',
    glType: '',
    currency: '',
    parentGLCode: '',
    isReconGL: '',
    reconGLFor: '',
    status: '',
  });
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.parentGLCode || !formData.glCode || !formData.glName || !formData.accountType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.reconAccount === 'yes' && !formData.reconGLFor) {
      toast.error('Please select Recon GL For');
      return;
    }

    addGLEntry({
      glName: formData.glName,
      glCode: `${formData.parentGLCode}${formData.glCode}`,
      glType: formData.accountType,
      currency: formData.currency,
      parentGLCode: formData.parentGLCode,
      isReconGL: formData.reconAccount === 'yes',
      reconGLFor: formData.reconAccount === 'yes' ? formData.reconGLFor : '',
      status: formData.status ? 'active' : 'inactive',
      branchConsolidation: 'consolidate',
      ledgerScope: 'both',
    });

    toast.success('GL Entry created successfully');
    handleClear();
    setShowForm(false);
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">GL Module</span> / General Ledger
            </nav>
            <h1 className="text-2xl font-bold">General Ledger {showForm ? '/ Create' : '/ List'}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="icon" onClick={() => setShowSearch((s) => !s)} title="Filter"><Filter className="h-4 w-4" /></Button>
            {!showForm && (
              <Button variant="default" size="icon" onClick={() => setShowForm(true)} title="Add"><Plus className="h-4 w-4" /></Button>
            )}
            {showForm && (
              <Button variant="destructive" size="icon" onClick={() => { handleClear(); setShowForm(false); }} title="Close"><X className="h-4 w-4" /></Button>
            )}
          </div>
        </div>

        {showForm ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Parent GL Code<span className="text-destructive">*</span></Label>
                    <div className="flex gap-0">
                      <Input
                        placeholder="Enter Parent GL code"
                        value={formData.parentGLCode}
                        onChange={(e) => setFormData({ ...formData, parentGLCode: e.target.value })}
                        className="rounded-r-none"
                      />
                      <Button type="button" variant="default" className="rounded-l-none px-3">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Parent GL Name</Label>
                    <Input
                      placeholder="Parent GL Name"
                      value={formData.parentGLName}
                      className="bg-muted"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Account Type<span className="text-destructive">*</span></Label>
                    <Select value={formData.accountType} onValueChange={(value) => setFormData({ ...formData, accountType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Currency<span className="text-destructive">*</span></Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Recon Account<span className="text-destructive">*</span></Label>
                    <RadioGroup
                      value={formData.reconAccount}
                      onValueChange={(value: 'yes' | 'no') => setFormData({ ...formData, reconAccount: value, reconGLFor: value === 'yes' ? formData.reconGLFor : '' })}
                      className="flex h-10 items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="recon-yes" />
                        <Label htmlFor="recon-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="recon-no" />
                        <Label htmlFor="recon-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.reconAccount === 'yes' && (
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                      <Label className="text-right">Recon For<span className="text-destructive">*</span></Label>
                      <Select value={formData.reconGLFor} onValueChange={(value) => setFormData({ ...formData, reconGLFor: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Recon Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reconForOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right font-semibold">Is Cash Ledger</Label>
                    <RadioGroup
                      value={formData.isCashLedger}
                      onValueChange={(value: 'yes' | 'no') => setFormData({ ...formData, isCashLedger: value })}
                      className="flex h-10 items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="cash-yes" />
                        <Label htmlFor="cash-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="cash-no" />
                        <Label htmlFor="cash-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-start gap-3">
                    <Label className="text-right pt-2">Description</Label>
                    <Textarea
                      placeholder="Enter Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">GL Code<span className="text-destructive">*</span></Label>
                    <div className="flex gap-0">
                      <div className="flex items-center justify-center min-w-[64px] px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-primary text-sm font-mono">
                        {formData.parentGLCode || '—'}
                      </div>
                      <Input
                        placeholder="Enter Suffix"
                        value={formData.glCode}
                        onChange={(e) => setFormData({ ...formData, glCode: e.target.value })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Actual GL Code<span className="text-destructive">*</span></Label>
                    <Input
                      value={`${formData.parentGLCode}${formData.glCode}`}
                      className="bg-muted"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">GL Name<span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="Enter GL Name"
                      value={formData.glName}
                      onChange={(e) => setFormData({ ...formData, glName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">GL Level</Label>
                    <Input
                      placeholder="GL Level"
                      value={formData.glLevel}
                      onChange={(e) => setFormData({ ...formData, glLevel: e.target.value })}
                      className="bg-muted"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Manual Transaction<span className="text-destructive">*</span></Label>
                    <RadioGroup
                      value={formData.manualTransaction}
                      onValueChange={(value: 'yes' | 'no') => setFormData({ ...formData, manualTransaction: value })}
                      className="flex h-10 items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="manual-yes" />
                        <Label htmlFor="manual-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="manual-no" />
                        <Label htmlFor="manual-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Auto Transaction<span className="text-destructive">*</span></Label>
                    <RadioGroup
                      value={formData.autoTransaction}
                      onValueChange={(value: 'yes' | 'no') => setFormData({ ...formData, autoTransaction: value })}
                      className="flex h-10 items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="auto-yes" />
                        <Label htmlFor="auto-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="auto-no" />
                        <Label htmlFor="auto-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <Label className="text-right">Status<span className="text-destructive">*</span></Label>
                    <div className="flex h-10 items-center space-x-2">
                      <Checkbox
                        id="status"
                        checked={formData.status}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })}
                      />
                      <Label htmlFor="status">Active</Label>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 flex justify-center gap-4 pt-4">
                  <Button type="button" variant="destructive" onClick={handleClear} className="px-8">Clear</Button>
                  <Button type="submit" className="px-8">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader><CardTitle>General Ledger List</CardTitle></CardHeader>
          <CardContent>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="text-table-header-foreground font-semibold">GL Name</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">GL Code</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">GL Type</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Currency</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Parent GL Code</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Is Recon GL</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Recon GL For</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold text-center">Action</TableHead>
                </TableRow>
                {showSearch && (
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.glName} onChange={e => setColFilters({ ...colFilters, glName: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.glCode} onChange={e => setColFilters({ ...colFilters, glCode: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.glType} onChange={e => setColFilters({ ...colFilters, glType: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.currency} onChange={e => setColFilters({ ...colFilters, currency: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.parentGLCode} onChange={e => setColFilters({ ...colFilters, parentGLCode: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1">
                      <Select value={colFilters.isReconGL} onValueChange={v => setColFilters({ ...colFilters, isReconGL: v })}>
                        <SelectTrigger className="h-8 bg-background text-foreground text-xs"><SelectValue placeholder="-- Select --" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableHead>
                    <TableHead className="p-1"><Input placeholder="Search..." value={colFilters.reconGLFor} onChange={e => setColFilters({ ...colFilters, reconGLFor: e.target.value })} className="h-8 bg-background text-foreground text-xs" /></TableHead>
                    <TableHead className="p-1">
                      <Select value={colFilters.status} onValueChange={v => setColFilters({ ...colFilters, status: v })}>
                        <SelectTrigger className="h-8 bg-background text-foreground text-xs"><SelectValue placeholder="-- Select --" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {filteredGLEntries
                  .filter(g => {
                    const f = colFilters;
                    const isRecon = g.isReconGL ? 'yes' : 'no';
                    return (!f.glName || g.glName.toLowerCase().includes(f.glName.toLowerCase()))
                      && (!f.glCode || g.glCode.toLowerCase().includes(f.glCode.toLowerCase()))
                      && (!f.glType || g.glType.toLowerCase().includes(f.glType.toLowerCase()))
                      && (!f.currency || (g.currency || '').toLowerCase().includes(f.currency.toLowerCase()))
                      && (!f.parentGLCode || (g.parentGLCode || '').toLowerCase().includes(f.parentGLCode.toLowerCase()))
                      && (!f.isReconGL || f.isReconGL === 'all' || isRecon === f.isReconGL)
                      && (!f.reconGLFor || (g.reconGLFor || '').toLowerCase().includes(f.reconGLFor.toLowerCase()))
                      && (!f.status || f.status === 'all' || g.status === f.status);
                  })
                  .map((gl) => (
                  <TableRow key={gl.id}>
                    <TableCell>{gl.glName}</TableCell>
                    <TableCell className="font-mono">{gl.glCode}</TableCell>
                    <TableCell>{gl.glType}</TableCell>
                    <TableCell>{gl.currency || 'BDT'}</TableCell>
                    <TableCell>{gl.parentGLCode || '-'}</TableCell>
                    <TableCell>{gl.isReconGL ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{gl.reconGLFor || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${gl.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{gl.status}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}