import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Printer, FileSpreadsheet, FileText, Settings, Minus, Plus, CalendarIcon, ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { format } from 'date-fns';

// Drill-down structure for leaf accounts (POS / Department / Branch)
interface DrillNode { name: string; dr?: number; cr?: number; children?: DrillNode[]; }
// SBU -> Department -> City hierarchy under each leaf ledger
const leafDrillDown: DrillNode[] = [
  { name: 'Foodi', children: [
    { name: 'Accounts', children: [
      { name: 'Dhaka', dr: 1850000, cr: 0 },
      { name: 'Rajshahi', dr: 920000, cr: 0 },
    ]},
    { name: 'Marketing', children: [
      { name: 'Dhaka', dr: 540000, cr: 0 },
      { name: 'Rajshahi', dr: 310000, cr: 0 },
    ]},
  ]},
  { name: 'Mart', children: [
    { name: 'Accounts', children: [
      { name: 'Dhaka', dr: 480000, cr: 0 },
      { name: 'Rajshahi', dr: 175000, cr: 0 },
    ]},
    { name: 'Marketing', children: [
      { name: 'Dhaka', dr: 215000, cr: 0 },
      { name: 'Rajshahi', dr: 95000, cr: 0 },
    ]},
  ]},
  { name: 'Shop', children: [
    { name: 'Accounts', children: [
      { name: 'Dhaka', dr: 100660.50, cr: 0 },
      { name: 'Rajshahi', dr: 30000, cr: 0 },
    ]},
    { name: 'Marketing', children: [
      { name: 'Dhaka', dr: 20000, cr: 0 },
      { name: 'Rajshahi', dr: 0, cr: 0 },
    ]},
  ]},
];

interface Row { seq: string; no: string; name: string; dr: number; cr: number; sbu?: string; city?: string; hub?: string; dept?: string; zone?: string; bold?: boolean; }

const rows: Row[] = [
  { seq: '10000', no: '10000', name: 'Assets(10000)', dr: 375240862.87, cr: 18861587.35, bold: true },
  { seq: '10000 > 11000', no: '11000', name: 'Current Assets(11000)', dr: 360469134.87, cr: 18861587.35, bold: true },
  { seq: '10000 > 11000 > 11100', no: '11100', name: 'Cash & Cash Equivalents(11100)', dr: 47875618.85, cr: 18611587.35, bold: true },
  { seq: '10000 > 11000 > 11100 > 11101', no: '11101', name: 'Cash in Hand(11101)', dr: 4465660.50, cr: 0, bold: true },
  { seq: '10000 > 11000 > 11100 > 11101 > 11101001', no: '11101001', name: 'Head Office Cash(11101001)', dr: 4465660.50, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102', no: '11102', name: 'Cash at Bank(11102)', dr: 42462490.23, cr: 18234444.62, bold: true },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102001', no: '11102001', name: 'City Bank A/C: 1233305341001(11102001)', dr: 9541132.27, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102010', no: '11102010', name: 'IBBL Bank A/C: 20501770100479609(11102010)', dr: 0, cr: 5640977.73 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102011', no: '11102011', name: 'SCB Bank A/C: 01357924601(11102011)', dr: 3651200.84, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102012', no: '11102012', name: 'UCB Bank A/C: 0901101000002235(11102012)', dr: 0, cr: 2788889.47 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102013', no: '11102013', name: 'SEBL Bank A/C: 0024111000008686(11102013)', dr: 2000, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102002', no: '11102002', name: 'Brac Bank A/C: 2052735250001(11102002)', dr: 29259041.08, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102003', no: '11102003', name: 'FSIB Bank A/C: 028111800000025(11102003)', dr: 0, cr: 103672 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102004', no: '11102004', name: 'MTB Bank A/C: 1301000137197(11102004)', dr: 0, cr: 581917.50 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102005', no: '11102005', name: 'DBBL Bank A/C: 147-110-18527(11102005)', dr: 0, cr: 7803059.64 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102006', no: '11102006', name: 'DBL [Baridhara] A/C: 218-100-0006443(11102006)', dr: 0, cr: 150655.55 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102007', no: '11102007', name: 'EBL Bank A/C: 1041060491993(11102007)', dr: 0, cr: 1165272.73 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102008', no: '11102008', name: 'Bank Asia A/C: 00333008701(11102008)', dr: 1737.71, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11102 > 11102009', no: '11102009', name: 'DBL [Mohakhali] A/C: 2251500000866(11102009)', dr: 0, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11103', no: '11103', name: 'Cash at MFS(11103)', dr: 7.23, cr: 319518.56, bold: true },
  { seq: '10000 > 11000 > 11100 > 11103 > 11103001', no: '11103001', name: 'Bkash A/C No.01730785685(11103001)', dr: 0, cr: 20910.68 },
  { seq: '10000 > 11000 > 11100 > 11103 > 11103002', no: '11103002', name: 'Nagad A/C No.01730785685(11103002)', dr: 0, cr: 249107.85 },
  { seq: '10000 > 11000 > 11100 > 11103 > 11103004', no: '11103004', name: 'Bkash A/C No.01730785686(11103004)', dr: 7.23, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11103 > 11103005', no: '11103005', name: 'Nagad A/C No.01730785686(11103005)', dr: 0, cr: 49500.03 },
  { seq: '10000 > 11000 > 11100 > 11104', no: '11104', name: 'Payment Gateway(11104)', dr: 879780.90, cr: 57624.17, bold: true },
  { seq: '10000 > 11000 > 11100 > 11104 > 11104014', no: '11104014', name: 'EBL Gateway New(11104014)', dr: 821215.73, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11104 > 11104001', no: '11104001', name: 'Brac Gateway(11104001)', dr: 0, cr: 17953.07 },
  { seq: '10000 > 11000 > 11100 > 11104 > 11104002', no: '11104002', name: 'Bkash Gateway A/C No.01730785702(11104002)', dr: 31881.17, cr: 0 },
  { seq: '10000 > 11000 > 11100 > 11104 > 11104003', no: '11104003', name: 'Nagad Gateway A/C No.01730785702(11104003)', dr: 0, cr: 39653.11 },
];

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TrialBalanceExtendedReport = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('both');
  const [reportType, setReportType] = useState('extended');
  const [ignoreZero, setIgnoreZero] = useState(true);
  const [ignoreYearClosing, setIgnoreYearClosing] = useState(false);
  const [sbu, setSbu] = useState(''); const [city, setCity] = useState('');
  const [hub, setHub] = useState(''); const [dept, setDept] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(2026, 3, 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 3, 30));
  const [showFilters, setShowFilters] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showReport, setShowReport] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    rows.forEach(r => { init[r.seq] = true; });
    return init;
  });
  const [drillOpen, setDrillOpen] = useState<Record<string, boolean>>({});
  const [drillNodeOpen, setDrillNodeOpen] = useState<Record<string, boolean>>({});

  const toggle = (seq: string) => setExpanded(p => ({ ...p, [seq]: !p[seq] }));
  const toggleDrill = (seq: string) => setDrillOpen(p => ({ ...p, [seq]: !p[seq] }));
  const toggleDrillNode = (key: string) => setDrillNodeOpen(p => ({ ...p, [key]: !p[key] }));

  const isLeafRow = (idx: number) => {
    const cur = rows[idx]; const next = rows[idx + 1];
    if (!next) return true;
    return !next.seq.startsWith(cur.seq + ' >');
  };
  const parentVisible = (seq: string) => {
    const parts = seq.split(' > ');
    for (let i = 1; i < parts.length; i++) {
      const parent = parts.slice(0, i).join(' > ');
      if (expanded[parent] === false) return false;
    }
    return true;
  };

  const filtered = rows.map((r, i) => ({ ...r, idx: i }))
    .filter(r => parentVisible(r.seq))
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.no.includes(search));

  const renderDrillTree = (nodes: DrillNode[], parentKey: string, depth: number): React.ReactNode => (
    <div className="space-y-1 mt-1">
      {nodes.map((n, i) => {
        const key = `${parentKey}/${i}-${n.name}`;
        const hasChildren = !!n.children?.length;
        const open = drillNodeOpen[key];
        return (
          <div key={key}>
            <div className="flex items-center gap-1 text-xs" style={{ paddingLeft: depth * 14 }}>
              {hasChildren ? (
                <button onClick={() => toggleDrillNode(key)} className="text-foreground">
                  {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
              ) : <span className="w-3 inline-block" />}
              <span className="font-semibold">&gt;&gt; {n.name}</span>
              {!hasChildren && (n.dr !== undefined || n.cr !== undefined) && (
                <span className="ml-2 text-muted-foreground font-normal">Dr {fmt(n.dr || 0)} | Cr {fmt(n.cr || 0)}</span>
              )}
            </div>
            {hasChildren && open && renderDrillTree(n.children!, key, depth + 1)}
          </div>
        );
      })}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <nav className="text-sm text-muted-foreground"><span className="text-primary font-medium">Reports</span> / Trial Balance Details Report</nav>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Trial Balance Report Filters</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(s => !s)}>{showFilters ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
          </div>
          {showFilters && (
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">Account Type Details</h4>
                  <RadioGroup value={accountType} onValueChange={setAccountType} className="flex gap-6">
                    <div className="flex items-center gap-2"><RadioGroupItem value="parent" id="te-parent" /><Label htmlFor="te-parent">Parent GL</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="general" id="te-general" /><Label htmlFor="te-general">General Ledger</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="both" id="te-both" /><Label htmlFor="te-both">Both</Label></div>
                  </RadioGroup>
                </div>
                <div>
                  <h4 className="font-bold mb-3">Report Type</h4>
                  <RadioGroup value={reportType} onValueChange={(v) => { if (v === 'summary') { navigate('/management/reports/trial-balance'); return; } setReportType(v); }} className="flex gap-6">
                    <div className="flex items-center gap-2"><RadioGroupItem value="summary" id="re-sum" /><Label htmlFor="re-sum">Trial Balance Report</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="extended" id="re-ext" /><Label htmlFor="re-ext">Trial Balance Details Report</Label></div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3">Other Information</h4>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2"><Checkbox id="ize" checked={ignoreZero} onCheckedChange={c => setIgnoreZero(!!c)} /><Label htmlFor="ize">Ignore Zero Balance</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="iye" checked={ignoreYearClosing} onCheckedChange={c => setIgnoreYearClosing(!!c)} /><Label htmlFor="iye">Ignore Year Closing</Label></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[{l:'SBU',v:sbu,s:setSbu},{l:'City',v:city,s:setCity},{l:'Hub',v:hub,s:setHub},{l:'Department',v:dept,s:setDept}].map(f => (
                    <div key={f.l} className="space-y-2">
                      <Label className="text-center block">{f.l}</Label>
                      <Select value={f.v} onValueChange={f.s}>
                        <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3">Date Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3"><Label className="min-w-[80px]">From Date <span className="text-destructive">*</span></Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{fromDate ? format(fromDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} className="pointer-events-auto" /></PopoverContent></Popover>
                  </div>
                  <div className="flex items-center gap-3"><Label className="min-w-[80px]">To Date <span className="text-destructive">*</span></Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{toDate ? format(toDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} className="pointer-events-auto" /></PopoverContent></Popover>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="destructive" onClick={() => setShowReport(false)}>Clear</Button>
                <Button className="bg-primary" onClick={() => setShowReport(true)}>Generate Report</Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Trial Balance Report Preview</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPreview(s => !s)}>{showPreview ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
          </div>
          {showPreview && showReport && (
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-end gap-2">
                <Button size="icon" className="bg-primary"><Printer className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-destructive hover:bg-destructive/90"><FileText className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700"><FileSpreadsheet className="h-4 w-4" /></Button>
              </div>
              <div className="border rounded text-center py-3">
                <div className="font-bold">Trial Balance Details Report</div>
                <div>{fromDate && format(fromDate, 'dd MMM yyyy')} To {toDate && format(toDate, 'dd MMM yyyy')}</div>
              </div>
              <div className="flex items-center justify-between">
                <Button size="icon" className="bg-primary"><Settings className="h-4 w-4" /></Button>
                <Input placeholder="Search all columns..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="border rounded overflow-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground min-w-[360px]">Account Details</TableHead>
                      <TableHead className="text-primary-foreground">Account No</TableHead>
                      <TableHead className="text-primary-foreground">Account Name</TableHead>
                      <TableHead className="text-primary-foreground text-right">Dr. Amount</TableHead>
                      <TableHead className="text-primary-foreground text-right">Cr. Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => {
                      const depth = r.seq.split(' > ').length - 1;
                      const leaf = isLeafRow(r.idx);
                      const isOpen = expanded[r.seq] !== false;
                      const drilled = drillOpen[r.seq];
                      return (
                        <React.Fragment key={r.seq}>
                          <TableRow className={r.bold ? 'bg-muted/30 font-semibold' : ''}>
                            <TableCell className="text-sm">
                              <div className="flex items-center" style={{ paddingLeft: depth * 20 }}>
                                {!leaf ? (
                                  <button onClick={() => toggle(r.seq)} className="mr-2 text-destructive">
                                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  </button>
                                ) : (
                                  <button onClick={() => toggleDrill(r.seq)} className="mr-2 text-blue-600" title="Drill down">
                                    <Circle className="h-2.5 w-2.5 fill-current" />
                                  </button>
                                )}
                                <span>{r.name}</span>
                              </div>
                              {leaf && drilled && (
                                <div className="ml-8 mt-2 border-l-2 border-dashed border-muted-foreground/40 pl-3 bg-yellow-50 dark:bg-yellow-950/20 rounded p-2">
                                  {renderDrillTree(leafDrillDown, r.seq, 0)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{r.no}</TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell className="text-right">{fmt(r.dr)}</TableCell>
                            <TableCell className="text-right">{fmt(r.cr)}</TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </TableWithSearch>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TrialBalanceExtendedReport;