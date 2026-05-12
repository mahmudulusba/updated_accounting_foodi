import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar as Calendar } from '@/components/ui/enhanced-calendar';
import { CalendarIcon, Eye, Download, FileText, ClipboardList, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { COUNTRIES, SERVICES_BY_SUPPLIER_TYPE } from '@/lib/groundHandlingData';
import { toast } from 'sonner';

const mockStationsForCountry: Record<string, string[]> = {
  'Bangladesh': ['DAC - Hazrat Shahjalal', 'CGP - Shah Amanat'],
  'United Arab Emirates': ['DXB - Dubai International'],
  'Singapore': ['SIN - Singapore Changi'],
  'India': ['CCU - Netaji Subhas', 'DEL - Indira Gandhi'],
  'Thailand': ['BKK - Suvarnabhumi'],
  'United Kingdom': ['LHR - London Heathrow'],
};

const BILL_TYPES = ['Ground Handling', 'Airport Authority', 'Cargo', 'OverFly'];

function ServiceMultiSelect({ billType, selectedServices, onChangeServices }: { billType: string; selectedServices: string[]; onChangeServices: (s: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const allServices = useMemo(() => SERVICES_BY_SUPPLIER_TYPE[billType] || [], [billType]);
  const filtered = useMemo(() => !search ? allServices : allServices.filter(s => s.toLowerCase().includes(search.toLowerCase())), [allServices, search]);
  const allSelected = selectedServices.length === allServices.length && allServices.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
          {selectedServices.length > 0 ? `${selectedServices.length} selected` : 'Select Services'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-popover z-[9999]" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 h-8 text-sm" />
          </div>
        </div>
        <div className="p-2 border-b">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <Checkbox checked={allSelected} onCheckedChange={() => onChangeServices(allSelected ? [] : [...allServices])} />
            Select All
          </label>
        </div>
        <div className="max-h-48 overflow-y-auto p-2 space-y-1">
          {filtered.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer text-sm py-1 px-1 hover:bg-muted rounded">
              <Checkbox checked={selectedServices.includes(s)} onCheckedChange={() => {
                onChangeServices(selectedServices.includes(s) ? selectedServices.filter(x => x !== s) : [...selectedServices, s]);
              }} />
              {s}
            </label>
          ))}
        </div>
        {selectedServices.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onChangeServices([])}>Clear selection</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default function StationWiseReport() {
  const [reportType, setReportType] = useState('summary');
  const [country, setCountry] = useState('');
  const [station, setStation] = useState('');
  const [billType, setBillType] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const availableStations = useMemo(() => {
    if (!country) return [];
    return mockStationsForCountry[country] || [];
  }, [country]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Station Wise Report</h1>
          <p className="text-muted-foreground">Generate reports by station with cost summary or breakdown details</p>
        </div>

        {/* Report Type Selection */}
        <Card>
          <CardContent className="py-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Section of Report</div>
            <RadioGroup value={reportType} onValueChange={setReportType} className="flex gap-4">
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer", reportType === 'summary' ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                <RadioGroupItem value="summary" id="summary" className={reportType === 'summary' ? 'border-primary-foreground text-primary-foreground' : ''} />
                <Label htmlFor="summary" className="cursor-pointer font-medium">Total Cost Summary Report</Label>
              </div>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer", reportType === 'breakdown' ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                <RadioGroupItem value="breakdown" id="breakdown" className={reportType === 'breakdown' ? 'border-primary-foreground text-primary-foreground' : ''} />
                <Label htmlFor="breakdown" className="cursor-pointer font-medium">Cost Breakdown Details Report</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filtering Criteria */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Report Filtering Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="font-medium">Country</Label>
                <Select value={country} onValueChange={(v) => { setCountry(v); setStation(''); }}>
                  <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999] max-h-60">
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Station</Label>
                <Select value={station} onValueChange={setStation} disabled={!country}>
                  <SelectTrigger><SelectValue placeholder="Select Station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {availableStations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!country && <p className="text-xs text-primary">Select a country first</p>}
              </div>

              {reportType === 'breakdown' && (
                <>
                  <div className="space-y-2">
                    <Label className="font-medium">Bill Type</Label>
                    <Select value={billType} onValueChange={(v) => { setBillType(v); setSelectedServices([]); }}>
                      <SelectTrigger><SelectValue placeholder="Select Bill Type" /></SelectTrigger>
                      <SelectContent className="bg-popover z-[9999]">
                        {BILL_TYPES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Service Name</Label>
                    {billType ? (
                      <ServiceMultiSelect billType={billType} selectedServices={selectedServices} onChangeServices={setSelectedServices} />
                    ) : (
                      <>
                        <Button variant="outline" className="w-full justify-start text-muted-foreground" disabled>Select Services</Button>
                        <p className="text-xs text-primary">Select a bill type first</p>
                      </>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-primary mb-1 block">From</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover z-[9999]">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-xs text-primary mb-1 block">To</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover z-[9999]">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-16 flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Preview will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="py-4 flex items-center justify-end gap-3">
            <Button className="bg-primary" onClick={() => toast.success('Generating preview...')}><Eye className="h-4 w-4 mr-2" />Preview</Button>
            <Button variant="outline" onClick={() => toast.success('Downloading PDF...')}><Download className="h-4 w-4 mr-2" />PDF Download</Button>
            <Button variant="outline" onClick={() => toast.success('Downloading CSV...')}><Download className="h-4 w-4 mr-2" />CSV Download</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
