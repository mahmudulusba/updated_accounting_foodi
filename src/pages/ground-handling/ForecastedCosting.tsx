import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, Download, ChevronDown, ChevronRight, Plane, DollarSign, TrendingUp, Clock, Eye, Pencil, ClipboardList, Trash2, Search, X, Calculator, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { evaluateServiceRules, type FlightContext, type EvalResult } from '@/lib/pricingEngine';
import type { PricingRule } from '@/components/ground-handling/PricingRulesModal';

// ─── Mock pricing rules for demo ─────────────────────────
const demoRules: Record<string, PricingRule[]> = {
  'Aircraft Handling': [
    {
      id: '1', name: 'Standard B737', priority: 1,
      effectiveFrom: new Date('2026-01-01'), effectiveTo: new Date('2027-12-31'),
      conditions: [{ id: 'c1', field: 'Aircraft Type', operator: '=', value: 'B737-800', logic: 'AND' }],
      rateStructureType: 'Fixed Amount', rate: 1200, perUnit: '', baseServiceRef: '', percentage: 0, slabs: [],
    },
    {
      id: '2', name: 'Wide Body A330', priority: 2,
      effectiveFrom: new Date('2026-01-01'), effectiveTo: new Date('2027-12-31'),
      conditions: [{ id: 'c2', field: 'Aircraft Type', operator: '=', value: 'A330', logic: 'AND' }],
      rateStructureType: 'Fixed Amount', rate: 2800, perUnit: '', baseServiceRef: '', percentage: 0, slabs: [],
    },
    {
      id: '3', name: 'ATR Turboprop', priority: 3,
      conditions: [{ id: 'c3', field: 'Aircraft Type', operator: '=', value: 'ATR', logic: 'AND' }],
      rateStructureType: 'Fixed Amount', rate: 600, perUnit: '', baseServiceRef: '', percentage: 0, slabs: [],
    },
  ],
  'Passenger Handling': [
    {
      id: '4', name: 'Per Pax Rate', priority: 1,
      conditions: [],
      rateStructureType: 'Per Unit', rate: 8, perUnit: 'Pax', baseServiceRef: '', percentage: 0, slabs: [],
    },
  ],
  'Landing Charge': [
    {
      id: '5', name: 'MTOW Slab', priority: 1,
      conditions: [],
      rateStructureType: 'Slab Based', rate: 0, perUnit: '', baseServiceRef: '', percentage: 0,
      slabs: [
        { id: 's1', from: 0, to: 50000, rate: 15, unitScale: 'Per 1000 KG' },
        { id: 's2', from: 50000, to: 100000, rate: 20, unitScale: 'Per 1000 KG' },
        { id: 's3', from: 100000, to: null, rate: 25, unitScale: 'Per 1000 KG' },
      ],
    },
  ],
  'Delay Surcharge': [
    {
      id: '6', name: 'Delay > 60 min', priority: 1,
      conditions: [{ id: 'c4', field: 'Delay Minutes', operator: '>', value: '60', logic: 'AND' }],
      rateStructureType: 'Percentage of Another Service', rate: 0, perUnit: '', baseServiceRef: 'Aircraft Handling', percentage: 25, slabs: [],
    },
  ],
  'Parking Charges': [
    {
      id: '7', name: 'Per Hour Parking', priority: 1,
      conditions: [],
      rateStructureType: 'Per Unit', rate: 50, perUnit: 'Hour', baseServiceRef: '', percentage: 0, slabs: [],
    },
  ],
  'Ground Power Unit': [
    {
      id: '8', name: 'Flat GPU', priority: 1,
      conditions: [],
      rateStructureType: 'One-time', rate: 200, perUnit: '', baseServiceRef: '', percentage: 0, slabs: [],
    },
  ],
  'Security Charges': [
    {
      id: '9', name: 'Annual Security', priority: 1,
      conditions: [],
      rateStructureType: 'Annual', rate: 24000, perUnit: '', baseServiceRef: '', percentage: 0, slabs: [],
    },
  ],
  'Handling Rebate': [
    {
      id: '10', name: 'Volume Rebate 5%', priority: 1,
      conditions: [{ id: 'c5', field: 'Pax Count', operator: '>=', value: '100', logic: 'AND' }],
      rateStructureType: 'Rebate %', rate: 1200, perUnit: '', baseServiceRef: '', percentage: 5, slabs: [],
    },
  ],
};

// ─── Mock flight data with context ───────────────────────
interface FlightForecast {
  id: string;
  flightNo: string;
  date: string;
  station: string;
  aircraft: string;
  reg: string;
  provider: string;
  status: string;
  enteredBy: string;
  context: FlightContext;
  serviceNames: string[];
}

const mockFlights: FlightForecast[] = [
  {
    id: '1', flightNo: 'BS-101', date: '2026-02-05', station: 'DAC', aircraft: 'B737-800', reg: 'S2-AHV',
    provider: 'Biman Ground Handling', status: 'Approved', enteredBy: 'Admin',
    context: { aircraftType: 'B737-800', aircraftCategory: 'Narrow Body', mtow: 78000, seats: 189, paxCount: 156, delayMinutes: 0, cancellationHours: 0, flightType: 'Commercial', isInternational: false, isCargo: false, isCharter: false, turnaroundHours: 1.75, bags: 210 },
    serviceNames: ['Aircraft Handling', 'Passenger Handling', 'Landing Charge', 'Parking Charges', 'Ground Power Unit', 'Security Charges', 'Handling Rebate'],
  },
  {
    id: '2', flightNo: 'BS-201', date: '2026-02-06', station: 'DXB', aircraft: 'A330', reg: 'S2-AHL',
    provider: 'DNATA', status: 'Submitted', enteredBy: 'Operator1',
    context: { aircraftType: 'A330', aircraftCategory: 'Wide Body', mtow: 120000, seats: 300, paxCount: 245, delayMinutes: 90, cancellationHours: 0, flightType: 'Commercial', isInternational: true, isCargo: false, isCharter: false, turnaroundHours: 2.25, bags: 380 },
    serviceNames: ['Aircraft Handling', 'Passenger Handling', 'Landing Charge', 'Delay Surcharge', 'Parking Charges', 'Ground Power Unit'],
  },
  {
    id: '3', flightNo: 'BS-301', date: '2026-02-07', station: 'SIN', aircraft: 'B787', reg: 'S2-AHM',
    provider: 'SATS', status: 'Draft', enteredBy: 'Operator2',
    context: { aircraftType: 'B787', aircraftCategory: 'Wide Body', mtow: 110000, seats: 280, paxCount: 220, delayMinutes: 15, cancellationHours: 0, flightType: 'Commercial', isInternational: true, isCargo: false, isCharter: false, turnaroundHours: 2.0, bags: 310 },
    serviceNames: ['Aircraft Handling', 'Passenger Handling', 'Landing Charge', 'Parking Charges', 'Ground Power Unit', 'Security Charges'],
  },
  {
    id: '4', flightNo: 'BS-401', date: '2026-02-08', station: 'CCU', aircraft: 'ATR', reg: 'S2-AHN',
    provider: 'AI-SATS', status: 'Approved', enteredBy: 'Admin',
    context: { aircraftType: 'ATR', aircraftCategory: 'Turboprop', mtow: 23000, seats: 72, paxCount: 58, delayMinutes: 0, cancellationHours: 0, flightType: 'Commercial', isInternational: true, isCargo: false, isCharter: false, turnaroundHours: 1.0, bags: 65 },
    serviceNames: ['Aircraft Handling', 'Passenger Handling', 'Landing Charge', 'Parking Charges', 'Ground Power Unit'],
  },
  {
    id: '5', flightNo: 'BS-501', date: '2026-02-09', station: 'BKK', aircraft: 'A330', reg: 'S2-AHP',
    provider: 'BFS Ground', status: 'Submitted', enteredBy: 'Operator1',
    context: { aircraftType: 'A330', aircraftCategory: 'Wide Body', mtow: 120000, seats: 300, paxCount: 275, delayMinutes: 30, cancellationHours: 0, flightType: 'Commercial', isInternational: true, isCargo: false, isCharter: false, turnaroundHours: 2.5, bags: 400 },
    serviceNames: ['Aircraft Handling', 'Passenger Handling', 'Landing Charge', 'Parking Charges', 'Ground Power Unit', 'Security Charges', 'Handling Rebate'],
  },
];

const TIME_FILTERS = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Approved': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{status}</Badge>;
    case 'Submitted': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{status}</Badge>;
    case 'Draft': return <Badge variant="outline" className="text-muted-foreground">{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

// ─── Forecast evaluation ─────────────────────────────────
interface ServiceEval {
  service: string;
  result: EvalResult | null;
}

function evaluateFlight(flight: FlightForecast): { services: ServiceEval[]; total: number } {
  // First pass: evaluate non-dependent rules
  const resolvedAmounts: Record<string, number> = {};
  const results: ServiceEval[] = [];

  // Two-pass: first non-dependent, then dependent
  for (const svc of flight.serviceNames) {
    const rules = demoRules[svc];
    if (!rules) {
      results.push({ service: svc, result: null });
      continue;
    }
    const hasDep = rules.some(r =>
      r.rateStructureType === 'Percentage of Another Service' ||
      r.rateStructureType === 'Cost + %'
    );
    if (hasDep) continue;

    const result = evaluateServiceRules(rules, flight.context);
    results.push({ service: svc, result });
    if (result) resolvedAmounts[svc] = result.amount;
  }

  // Second pass: dependent
  for (const svc of flight.serviceNames) {
    const rules = demoRules[svc];
    if (!rules) continue;
    const hasDep = rules.some(r =>
      r.rateStructureType === 'Percentage of Another Service' ||
      r.rateStructureType === 'Cost + %'
    );
    if (!hasDep) continue;

    const result = evaluateServiceRules(rules, flight.context, (ref) => resolvedAmounts[ref] ?? 0);
    results.push({ service: svc, result });
    if (result) resolvedAmounts[svc] = result.amount;
  }

  const total = results.reduce((sum, r) => sum + (r.result?.amount ?? 0), 0);
  return { services: results, total };
}

export default function ForecastedCosting() {
  const [activeTimeFilter, setActiveTimeFilter] = useState('Today');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('25');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [flightNumber, setFlightNumber] = useState('');
  const [aircraftType, setAircraftType] = useState('all');
  const [serviceProvider, setServiceProvider] = useState('');
  const [currency, setCurrency] = useState('all');
  const [registration, setRegistration] = useState('');
  const [costMin, setCostMin] = useState('0');
  const [costMax, setCostMax] = useState('999999');
  const [enteredBy, setEnteredBy] = useState('all');

  // Evaluate all flights
  const evaluatedFlights = useMemo(() =>
    mockFlights.map(f => ({ ...f, eval: evaluateFlight(f) })),
    []
  );

  const filteredData = evaluatedFlights.filter(item =>
    !search || item.flightNo.toLowerCase().includes(search.toLowerCase()) ||
    item.provider.toLowerCase().includes(search.toLowerCase()) ||
    item.station.toLowerCase().includes(search.toLowerCase())
  );

  const totalCost = filteredData.reduce((s, f) => s + f.eval.total, 0);
  const avgCost = filteredData.length > 0 ? totalCost / filteredData.length : 0;
  const pendingCount = filteredData.filter(f => f.status !== 'Approved').length;

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Forecasted Costing</h1>
              <p className="text-muted-foreground">Auto-evaluated costs using rule-based pricing engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </div>
        </div>

        {/* Time Filter Chips */}
        <div className="flex gap-2">
          {TIME_FILTERS.map(f => (
            <Button key={f} size="sm" variant={activeTimeFilter === f ? 'default' : 'outline'} onClick={() => setActiveTimeFilter(f)}>
              {f}
            </Button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <Label className="font-medium text-sm">From Date</Label>
                  <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">To Date</Label>
                  <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Station</Label>
                  <Select value={stationFilter} onValueChange={setStationFilter}>
                    <SelectTrigger><SelectValue placeholder="All Stations" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Stations</SelectItem>
                      <SelectItem value="DAC">DAC</SelectItem>
                      <SelectItem value="DXB">DXB</SelectItem>
                      <SelectItem value="SIN">SIN</SelectItem>
                      <SelectItem value="CCU">CCU</SelectItem>
                      <SelectItem value="BKK">BKK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Flight Number</Label>
                  <Input placeholder="e.g. BS-101" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Aircraft Type</Label>
                  <Select value={aircraftType} onValueChange={setAircraftType}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="B737-800">B737-800</SelectItem>
                      <SelectItem value="A330">A330</SelectItem>
                      <SelectItem value="ATR">ATR</SelectItem>
                      <SelectItem value="B787">B787</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Service Provider</Label>
                  <Input placeholder="Search provider..." value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-medium text-sm">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="BDT">BDT</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="SGD">SGD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Collapsible open={showAdditional} onOpenChange={setShowAdditional}>
                <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdditional ? '' : '-rotate-90'}`} />
                  Additional Filters
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <Label className="font-medium text-sm">Registration</Label>
                      <Input placeholder="e.g. S2-AHV" value={registration} onChange={e => setRegistration(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-medium text-sm">Cost Min</Label>
                      <Input type="number" value={costMin} onChange={e => setCostMin(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-medium text-sm">Cost Max</Label>
                      <Input type="number" value={costMax} onChange={e => setCostMax(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-medium text-sm">Entered By</Label>
                      <Select value={enteredBy} onValueChange={setEnteredBy}>
                        <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-popover z-[9999]">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Operator1">Operator1</SelectItem>
                          <SelectItem value="Operator2">Operator2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex items-center gap-3">
                <Button className="bg-primary" onClick={() => toast.success('Filters applied')}>Apply</Button>
                <Button variant="outline" onClick={() => toast.info('Filters cleared')}>Clear</Button>
                <Button variant="ghost" onClick={() => toast.success('Preset saved')}>Save Preset</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plane className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Flights</div>
                <div className="text-2xl font-bold">{filteredData.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Forecast Cost</div>
                <div className="text-2xl font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg / Flight</div>
                <div className="text-2xl font-bold">${avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Pending Review</div>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost List Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Forecasted Cost List</h3>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Zap className="h-3 w-3" /> Auto-evaluated
                </Badge>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search all columns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>S/N</TableHead>
                  <TableHead>Flight No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>MTOW</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Forecast Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => {
                  const isExpanded = expandedRows.has(item.id);
                  return (
                    <React.Fragment key={item.id}>
                      <TableRow className={isExpanded ? 'bg-muted/20' : ''}>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpand(item.id)}>
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-primary">{item.flightNo}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell><Badge variant="outline" className="font-mono">{item.station}</Badge></TableCell>
                        <TableCell>{item.aircraft}</TableCell>
                        <TableCell className="text-xs">{item.context.mtow.toLocaleString()} kg</TableCell>
                        <TableCell>{item.context.paxCount}</TableCell>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-primary">{item.eval.services.length}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${item.eval.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded service breakdown */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={13} className="p-0">
                            <div className="bg-muted/10 border-y px-8 py-3">
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                <Zap className="h-3 w-3" /> Service-Level Breakdown — {item.flightNo}
                                {item.context.delayMinutes > 0 && (
                                  <Badge variant="outline" className="ml-2 text-xs text-amber-600 border-amber-300">
                                    Delay: {item.context.delayMinutes} min
                                  </Badge>
                                )}
                              </h4>
                              <TableWithSearch>
                                <TableHeader>
                                  <TableRow className="bg-muted/30">
                                    <TableHead className="text-xs">Service</TableHead>
                                    <TableHead className="text-xs">Matched Rule</TableHead>
                                    <TableHead className="text-xs">Rate Type</TableHead>
                                    <TableHead className="text-xs">Breakdown</TableHead>
                                    <TableHead className="text-xs text-right">Amount</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {item.eval.services.map((svc, si) => (
                                    <TableRow key={si} className="border-muted/30">
                                      <TableCell className="text-xs font-medium">{svc.service}</TableCell>
                                      <TableCell className="text-xs">
                                        {svc.result ? (
                                          <Badge variant="outline" className="text-xs">{svc.result.ruleName}</Badge>
                                        ) : (
                                          <span className="text-muted-foreground italic">No match</span>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground">
                                        {svc.result ? (demoRules[svc.service]?.find(r => r.id === svc.result!.ruleId)?.rateStructureType ?? '-') : '-'}
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground">
                                        {svc.result?.breakdown ?? '-'}
                                      </TableCell>
                                      <TableCell className={`text-xs text-right font-medium ${(svc.result?.amount ?? 0) < 0 ? 'text-emerald-600' : ''}`}>
                                        {svc.result ? `$${svc.result.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className="bg-muted/20">
                                    <TableCell colSpan={4} className="text-xs font-semibold text-right">Total</TableCell>
                                    <TableCell className="text-xs text-right font-bold">
                                      ${item.eval.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </TableWithSearch>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </TableWithSearch>
            <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
              <span>Showing 1 to {filteredData.length} of {filteredData.length} entries</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                    <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button size="sm" className="bg-primary h-8 w-8 p-0">1</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
