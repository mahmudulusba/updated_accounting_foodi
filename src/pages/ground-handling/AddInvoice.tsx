import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { format } from 'date-fns';
import { Calendar, Plus, Upload, Pencil, Trash2, Save, FileText, Paperclip, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { exchangeRatesToBDT } from '@/lib/reportUtils';
import {
  CURRENCIES,
  mockStations,
  mockSuppliers,
  SERVICES_BY_SUPPLIER_TYPE
} from '@/lib/groundHandlingData';

interface LineItem {
  id: number;
  service: string;
  description: string;
  qty: number;
  unitPrice: number;
  tax: number;
  amount: number;
  rateUSD: number;
  rateBDT: number;
}

export default function AddInvoice() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNo: '',
    supplier: '',
    station: '',
    currency: '',
    invoiceDate: undefined as Date | undefined,
    dueDate: undefined as Date | undefined,
    remarks: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, service: '', description: '', qty: 1, unitPrice: 0, tax: 0, amount: 0, rateUSD: 0, rateBDT: 0 }
  ]);

  const [showOcrReview, setShowOcrReview] = useState(false);
  const [ocrDetectedItems, setOcrDetectedItems] = useState<LineItem[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);

  const selectedSupplier = mockSuppliers.find(s => s.name === formData.supplier);
  const availableServices = useMemo(() => {
    if (!selectedSupplier) return [];
    return SERVICES_BY_SUPPLIER_TYPE[selectedSupplier.type] || [];
  }, [selectedSupplier]);

  const convertToUSD = (amount: number, fromCurrency: string) => {
    const rate = exchangeRatesToBDT[fromCurrency] || 1;
    return (amount * rate) / exchangeRatesToBDT.USD;
  };

  const convertToBDT = (amount: number, fromCurrency: string) => {
    const rate = exchangeRatesToBDT[fromCurrency] || 1;
    return amount * rate;
  };

  const handleAddLineItem = () => {
    const newId = Math.max(...lineItems.map(l => l.id), 0) + 1;
    setLineItems([...lineItems, {
      id: newId, service: '', description: '', qty: 1, unitPrice: 0, tax: 0, amount: 0, rateUSD: 0, rateBDT: 0
    }]);
  };

  const handleRemoveLineItem = (id: number) => {
    if (lineItems.length > 1) setLineItems(lineItems.filter(l => l.id !== id));
  };

  const handleLineItemChange = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'qty' || field === 'unitPrice' || field === 'tax') {
        const qty = Number(updated.qty) || 0;
        const unitPrice = Number(updated.unitPrice) || 0;
        const tax = Number(updated.tax) || 0;
        updated.amount = (qty * unitPrice) + tax;
        // Auto-convert
        const cur = formData.currency || 'USD';
        updated.rateUSD = convertToUSD(updated.amount, cur);
        updated.rateBDT = convertToBDT(updated.amount, cur);
      }
      return updated;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info('Processing document with OCR...');
      setTimeout(() => {
        const cur = formData.currency || 'USD';
        const mockItems: LineItem[] = [
          { id: 100, service: 'Landing Charge- B737', description: 'Landing fee', qty: 1, unitPrice: 500, tax: 50, amount: 550, rateUSD: convertToUSD(550, cur), rateBDT: convertToBDT(550, cur) },
          { id: 101, service: 'Parking Charges', description: 'Aircraft parking', qty: 2, unitPrice: 200, tax: 40, amount: 440, rateUSD: convertToUSD(440, cur), rateBDT: convertToBDT(440, cur) },
          { id: 102, service: 'Ground Power Unit', description: 'GPU service', qty: 1, unitPrice: 150, tax: 15, amount: 165, rateUSD: convertToUSD(165, cur), rateBDT: convertToBDT(165, cur) },
        ];
        setOcrDetectedItems(mockItems);
        setShowOcrReview(true);
      }, 1500);
    }
  };

  const handleOcrConfirm = () => {
    const maxId = Math.max(...lineItems.map(l => l.id), 0);
    const newItems = ocrDetectedItems.map((item, index) => ({ ...item, id: maxId + index + 1 }));
    setLineItems([...lineItems.filter(l => l.service), ...newItems]);
    setShowOcrReview(false);
    toast.success('Line items added from document');
  };

  const handleAttachmentUpload = () => {
    setAttachments([...attachments, `Document_${attachments.length + 1}.pdf`]);
    toast.success('Attachment added');
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = () => {
    if (!formData.invoiceNo || !formData.supplier || !formData.invoiceDate || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Invoice saved successfully');
    navigate('/management/ground-handling/invoice/list');
  };

  const handleSaveDraft = () => toast.success('Draft saved');

  // Determine if + button should be visible (only on last row)
  const isLastRow = (id: number) => lineItems[lineItems.length - 1].id === id;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Invoice</h1>
            <p className="text-muted-foreground">Create a new invoice entry</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />Save Draft
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span><Upload className="h-4 w-4 mr-2" />OCR Upload</span>
              </Button>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" onChange={handleFileUpload} />
            </label>
            <Button variant="outline" onClick={() => navigate('/management/ground-handling/invoice/list')}>Cancel</Button>
            <Button className="bg-primary" onClick={handleSubmit}>Save Invoice</Button>
          </div>
        </div>

        {/* Invoice Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-6">Invoice Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Invoice No <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter invoice number" value={formData.invoiceNo} onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })} />
              </div>
              <SearchableSelect label="Supplier" required options={mockSuppliers.map(s => s.name)} value={formData.supplier} onChange={(value) => setFormData({ ...formData, supplier: value })} placeholder="Select supplier" />
              <div className="space-y-2">
                <Label>Station <span className="text-destructive">*</span></Label>
                <Select value={formData.station} onValueChange={(value) => setFormData({ ...formData, station: value })}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {mockStations.map(s => <SelectItem key={s.id} value={s.iataCode}>{s.iataCode} - {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency <span className="text-destructive">*</span></Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.invoiceDate ? format(formData.invoiceDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                    <EnhancedCalendar mode="single" selected={formData.invoiceDate} onSelect={(date) => setFormData({ ...formData, invoiceDate: date })} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Due Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                    <EnhancedCalendar mode="single" selected={formData.dueDate} onSelect={(date) => setFormData({ ...formData, dueDate: date })} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Line Items</h2>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">S/N</TableHead>
                  <TableHead className="min-w-[200px]">Service</TableHead>
                  <TableHead className="min-w-[120px]">Description</TableHead>
                  <TableHead className="w-16">Qty</TableHead>
                  <TableHead className="w-24">Unit Price</TableHead>
                  <TableHead className="w-20">Tax</TableHead>
                  <TableHead className="w-24">Amount</TableHead>
                  <TableHead className="w-24">Rate (USD)</TableHead>
                  <TableHead className="w-24">Rate (BDT)</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Select value={item.service} onValueChange={(value) => handleLineItemChange(item.id, 'service', value)}>
                        <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        <SelectContent className="bg-popover z-[9999] max-h-60">
                          {availableServices.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Desc." value={item.description} onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)} className="text-sm" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.qty} onChange={(e) => handleLineItemChange(item.id, 'qty', Number(e.target.value))} className="w-14" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(item.id, 'unitPrice', Number(e.target.value))} className="w-20" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.tax} onChange={(e) => handleLineItemChange(item.id, 'tax', Number(e.target.value))} className="w-16" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.amount.toFixed(2)} readOnly className="w-20 bg-muted" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.rateUSD.toFixed(2)} readOnly className="w-20 bg-muted text-xs" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={item.rateBDT.toFixed(2)} readOnly className="w-20 bg-muted text-xs" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                        {lineItems.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveLineItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                        )}
                        {isLastRow(item.id) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={handleAddLineItem}><Plus className="h-3 w-3" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
            <div className="flex justify-end mt-4 text-lg font-semibold">
              Total: {formData.currency || 'USD'} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Invoice Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(() => {
                const cur = formData.currency || 'USD';
                const subtotalLocal = lineItems.reduce((s, i) => s + (i.qty * i.unitPrice), 0);
                const vatLocal = lineItems.reduce((s, i) => s + i.tax, 0);
                const grandLocal = subtotalLocal + vatLocal;
                const subtotalUSD = lineItems.reduce((s, i) => s + convertToUSD(i.qty * i.unitPrice, cur), 0);
                const vatUSD = lineItems.reduce((s, i) => s + convertToUSD(i.tax, cur), 0);
                const grandUSD = subtotalUSD + vatUSD;
                const subtotalBDT = lineItems.reduce((s, i) => s + convertToBDT(i.qty * i.unitPrice, cur), 0);
                const vatBDT = lineItems.reduce((s, i) => s + convertToBDT(i.tax, cur), 0);
                const grandBDT = subtotalBDT + vatBDT;
                const totalLineItems = lineItems.filter(l => l.service).length;
                const uniqueServices = new Set(lineItems.filter(l => l.service).map(l => l.service)).size;
                return (
                  <>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-primary font-medium mb-2">Local Currency Total</p>
                      <div className="flex justify-between text-sm"><span>Subtotal</span><span>{subtotalLocal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span>VAT</span><span>{vatLocal.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t"><span>Grand Total</span><span>{grandLocal.toFixed(2)}</span></div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-primary font-medium mb-2">USD Total</p>
                      <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotalUSD.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span>VAT</span><span>${vatUSD.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t"><span>Grand Total</span><span>${grandUSD.toFixed(2)}</span></div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-primary font-medium mb-2">BDT Total</p>
                      <div className="flex justify-between text-sm"><span>Subtotal</span><span>৳{subtotalBDT.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span>VAT</span><span>৳{vatBDT.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t"><span>Grand Total</span><span>৳{grandBDT.toFixed(2)}</span></div>
                    </div>
                    <div className="col-span-full grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-2xl font-bold">{totalLineItems}</p><p className="text-sm text-primary">Total Line Items</p></div>
                      <div><p className="text-2xl font-bold">{uniqueServices}</p><p className="text-sm text-primary">Total Services</p></div>
                      <div><p className="text-2xl font-bold">{formData.invoiceDate && formData.dueDate ? `${Math.ceil((formData.dueDate.getTime() - formData.invoiceDate.getTime()) / 86400000)} days` : 'Not specified'}</p><p className="text-sm text-primary">Date Range</p></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Compact Attachments & Terms row */}
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Attachments</span>
                {attachments.length > 0 && <Badge variant="outline" className="text-xs">{attachments.length} file(s)</Badge>}
              </div>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span><Upload className="h-3 w-3 mr-1" />Upload</span>
                </Button>
                <input type="file" className="hidden" onChange={handleAttachmentUpload} />
              </label>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Terms & Conditions</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Terms reference dialog coming soon')}>
                <FileText className="h-3 w-3 mr-1" />View
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* OCR Review Dialog */}
        <Dialog open={showOcrReview} onOpenChange={setShowOcrReview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Review Detected Line Items</DialogTitle></DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">The following line items were detected. Review before adding.</p>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ocrDetectedItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.unitPrice}</TableCell>
                      <TableCell>{item.tax}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOcrReview(false)}>Cancel</Button>
              <Button onClick={handleOcrConfirm}>Add Line Items</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
