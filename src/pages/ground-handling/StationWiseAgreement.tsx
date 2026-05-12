import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { format } from 'date-fns';
import { Calendar, Plus, Search, Upload, Pencil, Trash2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { AddSupplierDialog } from '@/components/ground-handling/AddSupplierDialog';
import { PricingRulesModal, type PricingRule } from '@/components/ground-handling/PricingRulesModal';
import {
  COUNTRIES, SUPPLIER_TYPES, CURRENCIES, mockStations, mockSuppliers,
  SERVICES_BY_SUPPLIER_TYPE
} from '@/lib/groundHandlingData';

interface ServiceRate {
  id: number;
  service: string;
  qty: number;
  amountLocal: number;
  vatPercent: number;
  tax: number;
  amount: number;
  inclVatAmount: number;
  pricingRules: PricingRule[];
}

const isRowFilled = (rate: ServiceRate) => rate.service !== '';

export default function StationWiseAgreement() {
  const [formData, setFormData] = useState({
    country: '',
    station: '',
    currency: '',
    supplierType: '',
    supplierName: '',
    authorityName: '',
    manager: '',
    paymentPeriod: '',
    securityMoney: '',
    validFrom: undefined as Date | undefined,
    validTo: undefined as Date | undefined,
    termsText: '',
  });

  const [serviceRates, setServiceRates] = useState<ServiceRate[]>([
    { id: 1, service: '', qty: 0, amountLocal: 0, vatPercent: 0, tax: 0, amount: 0, inclVatAmount: 0, pricingRules: [] }
  ]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // Pricing rules modal state
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null);

  const filteredStations = formData.country ? mockStations.filter(s => s.country === formData.country) : [];

  const filteredSuppliers = useMemo(() => {
    if (!formData.supplierType) return [];
    return mockSuppliers.filter(s => s.type === formData.supplierType);
  }, [formData.supplierType]);

  const availableServices = useMemo(() => {
    if (!formData.supplierType) return [];
    return SERVICES_BY_SUPPLIER_TYPE[formData.supplierType] || [];
  }, [formData.supplierType]);

  const displayedServices = useMemo(() => {
    if (!serviceSearch) return availableServices;
    return availableServices.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()));
  }, [availableServices, serviceSearch]);

  // All selected services (for base service reference in pricing rules)
  const allSelectedServices = serviceRates.filter(r => r.service).map(r => r.service);

  const handleAddService = () => {
    const newId = Math.max(...serviceRates.map(r => r.id), 0) + 1;
    setServiceRates([...serviceRates, { id: newId, service: '', qty: 0, amountLocal: 0, vatPercent: 0, tax: 0, amount: 0, inclVatAmount: 0, pricingRules: [] }]);
  };

  const handleRemoveService = (id: number) => {
    if (serviceRates.length > 1) setServiceRates(serviceRates.filter(r => r.id !== id));
  };

  const handleServiceRateChange = (id: number, field: keyof ServiceRate, value: string | number) => {
    setServiceRates(serviceRates.map(rate => {
      if (rate.id !== id) return rate;
      const updated = { ...rate, [field]: value };
      if (field === 'amountLocal' || field === 'vatPercent' || field === 'qty' || field === 'tax') {
        const amountLocal = Number(updated.amountLocal) || 0;
        const vatPercent = Number(updated.vatPercent) || 0;
        const qty = Number(updated.qty) || 1;
        const tax = Number(updated.tax) || 0;
        const baseAmount = amountLocal * qty;
        const vatAmount = baseAmount * (vatPercent / 100);
        updated.amount = baseAmount;
        updated.inclVatAmount = baseAmount + vatAmount + tax;
      }
      return updated;
    }));
  };

  const handleOpenRulesModal = (serviceId: number) => {
    setActiveServiceId(serviceId);
    setRulesModalOpen(true);
  };

  const handleSaveRules = (rules: PricingRule[]) => {
    if (activeServiceId === null) return;
    setServiceRates(serviceRates.map(r =>
      r.id === activeServiceId ? { ...r, pricingRules: rules } : r
    ));
  };

  const activeServiceRate = serviceRates.find(r => r.id === activeServiceId);

  const handleSubmit = () => {
    if (!formData.country || !formData.station || !formData.supplierType) { toast.error('Please fill in all required fields'); return; }
    toast.success('Agreement saved successfully');
  };

  const handleFileUpload = () => { toast.info('File upload coming soon'); };

  const isLastRow = (id: number) => serviceRates[serviceRates.length - 1].id === id;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Agreement</h1>
          <p className="text-muted-foreground">Create and manage agreements</p>
        </div>

        {/* Top Row: Country, Station, Currency */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SearchableSelect label="Country" required options={COUNTRIES} value={formData.country} onChange={(v) => setFormData({ ...formData, country: v, station: '' })} placeholder="Select Country" />
              <div className="space-y-2">
                <Label>Station <span className="text-destructive">*</span></Label>
                <Select value={formData.station} onValueChange={(v) => setFormData({ ...formData, station: v })} disabled={!formData.country}>
                  <SelectTrigger><SelectValue placeholder="Select Station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {filteredStations.map(s => <SelectItem key={s.id} value={s.iataCode}>{s.iataCode} - {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!formData.country && <p className="text-xs text-muted-foreground">Select a country first</p>}
              </div>
              <div className="space-y-2">
                <Label>Currency <span className="text-destructive">*</span></Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Information Group */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Supplier Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Supplier Type <span className="text-destructive">*</span></Label>
                  <Select value={formData.supplierType} onValueChange={(v) => setFormData({ ...formData, supplierType: v, supplierName: '' })}>
                    <SelectTrigger><SelectValue placeholder="Select Supplier Type" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Authority <span className="text-destructive">*</span></Label>
                  <Input placeholder="Enter authority name" value={formData.authorityName} onChange={(e) => setFormData({ ...formData, authorityName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Manager <span className="text-destructive">*</span></Label>
                  <Input placeholder="Enter manager name" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Period</Label>
                  <Select value={formData.paymentPeriod} onValueChange={(v) => setFormData({ ...formData, paymentPeriod: v })}>
                    <SelectTrigger><SelectValue placeholder="Select payment period" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Security Money</Label>
                  <Input type="number" placeholder="Enter amount in local currency" value={formData.securityMoney} onChange={(e) => setFormData({ ...formData, securityMoney: e.target.value })} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Supplier Name <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <Select value={formData.supplierName} onValueChange={(v) => setFormData({ ...formData, supplierName: v })} disabled={!formData.supplierType}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder={formData.supplierType ? 'Search suppliers...' : 'Select supplier type first'} /></SelectTrigger>
                      <SelectContent className="bg-popover z-[9999]">
                        {filteredSuppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={() => setShowAddSupplier(true)} title="Add new supplier">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Validity Period <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">From</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.validFrom ? format(formData.validFrom, 'PPP') : 'Select'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                          <EnhancedCalendar mode="single" selected={formData.validFrom} onSelect={(d) => setFormData({ ...formData, validFrom: d })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">To</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.validTo ? format(formData.validTo, 'PPP') : 'Select'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                          <EnhancedCalendar mode="single" selected={formData.validTo} onSelect={(d) => setFormData({ ...formData, validTo: d })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services & Rates */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Services & Rates</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search services..." value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">S/N</TableHead>
                  <TableHead className="min-w-[200px]">Service</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-28">Rate</TableHead>
                  <TableHead className="w-20">VAT %</TableHead>
                  <TableHead className="w-20">Tax</TableHead>
                  <TableHead className="w-24">Amount</TableHead>
                  <TableHead className="w-28">Incl. VAT Amount</TableHead>
                  <TableHead className="w-36">Pricing Rules</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRates.map((rate, index) => (
                  <TableRow key={rate.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Select value={rate.service} onValueChange={(v) => handleServiceRateChange(rate.id, 'service', v)}>
                        <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        <SelectContent className="bg-popover z-[9999] max-h-60">
                          {displayedServices.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input type="number" value={rate.qty} onChange={(e) => handleServiceRateChange(rate.id, 'qty', Number(e.target.value))} className="w-16" /></TableCell>
                    <TableCell><Input type="number" value={rate.amountLocal} onChange={(e) => handleServiceRateChange(rate.id, 'amountLocal', Number(e.target.value))} className="w-24" /></TableCell>
                    <TableCell><Input type="number" value={rate.vatPercent} onChange={(e) => handleServiceRateChange(rate.id, 'vatPercent', Number(e.target.value))} className="w-16" /></TableCell>
                    <TableCell><Input type="number" value={rate.tax} onChange={(e) => handleServiceRateChange(rate.id, 'tax', Number(e.target.value))} className="w-20" /></TableCell>
                    <TableCell><Input type="number" value={rate.amount.toFixed(2)} readOnly className="w-20 bg-muted" /></TableCell>
                    <TableCell><Input type="number" value={rate.inclVatAmount.toFixed(2)} readOnly className="w-24 bg-muted" /></TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => handleOpenRulesModal(rate.id)}
                        disabled={!rate.service}
                      >
                        <Settings2 className="h-3 w-3" />
                        Manage Rules
                        {rate.pricingRules.length > 0 && (
                          <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                            {rate.pricingRules.length}
                          </Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                        {serviceRates.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveService(rate.id)}><Trash2 className="h-3 w-3" /></Button>
                        )}
                        {isLastRow(rate.id) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={handleAddService}><Plus className="h-3 w-3" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        {/* Terms & Conditions + Attachment */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Terms & Conditions</h2>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span><Upload className="h-4 w-4 mr-2" />Upload Attachment</span>
                </Button>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <Textarea placeholder="Enter terms and conditions..." value={formData.termsText} onChange={(e) => setFormData({ ...formData, termsText: e.target.value })} rows={4} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary" onClick={handleSubmit}>Save Agreement</Button>
        </div>
      </div>

      <AddSupplierDialog open={showAddSupplier} onOpenChange={setShowAddSupplier} />

      {/* Pricing Rules Modal */}
      <PricingRulesModal
        open={rulesModalOpen}
        onOpenChange={setRulesModalOpen}
        serviceName={activeServiceRate?.service || ''}
        rules={activeServiceRate?.pricingRules || []}
        onSave={handleSaveRules}
        allServices={allSelectedServices}
      />
    </DashboardLayout>
  );
}
