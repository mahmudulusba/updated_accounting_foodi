import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar as Calendar } from '@/components/ui/enhanced-calendar';
import { CalendarIcon, Eye, Download, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ReconciliationReport() {
  const [fiscalYear, setFiscalYear] = useState('');
  const [station, setStation] = useState('');
  const [supplier, setSupplier] = useState('');
  const [supplierType, setSupplierType] = useState('');
  const [service, setService] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [reconStatus, setReconStatus] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reconciliation Report</h1>
          <p className="text-muted-foreground">Compare Supplier Invoiced Amount vs System Expected Amount and highlight variances</p>
        </div>

        <Card>
          <CardContent className="py-6">
            <h3 className="font-semibold mb-4">Report Filters</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <Label className="font-medium text-sm">Fiscal Year</Label>
                <Select value={fiscalYear} onValueChange={setFiscalYear}>
                  <SelectTrigger><SelectValue placeholder="Select fiscal year" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="2025-26">2025-26</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">Station</Label>
                <Select value={station} onValueChange={setStation}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="DAC">DAC</SelectItem>
                    <SelectItem value="DXB">DXB</SelectItem>
                    <SelectItem value="SIN">SIN</SelectItem>
                    <SelectItem value="CCU">CCU</SelectItem>
                    <SelectItem value="BKK">BKK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">Supplier</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="biman">Biman GH</SelectItem>
                    <SelectItem value="dnata">DNATA</SelectItem>
                    <SelectItem value="sats">SATS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">Supplier Type</Label>
                <Select value={supplierType} onValueChange={setSupplierType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="gh">Ground Handling</SelectItem>
                    <SelectItem value="aa">Airport Authority</SelectItem>
                    <SelectItem value="cargo">Cargo</SelectItem>
                    <SelectItem value="overfly">OverFly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <Label className="font-medium text-sm">Service / Item</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger><SelectValue placeholder="Select services" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="landing">Landing Fee</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="handling">Aircraft Handling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">Invoice No (Optional)</Label>
                <Input placeholder="Search invoice..." value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">Reconciliation Status</Label>
                <Select value={reconStatus} onValueChange={setReconStatus}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="variance">Variance</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium text-sm">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]"><Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} /></PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="space-y-1">
                <Label className="font-medium text-sm">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]"><Calendar mode="single" selected={dateTo} onSelect={setDateTo} /></PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-primary" onClick={() => toast.success('Generating preview...')}><SearchIcon className="h-4 w-4 mr-2" />Preview</Button>
              <Button variant="outline" onClick={() => toast.success('Downloading PDF...')}><Download className="h-4 w-4 mr-2" />PDF Download</Button>
              <Button variant="outline" onClick={() => toast.success('Downloading CSV...')}><Download className="h-4 w-4 mr-2" />CSV Download</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
