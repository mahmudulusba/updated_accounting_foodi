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
import { Printer, FileSpreadsheet, FileText, Settings, Minus, Plus, CalendarIcon, ChevronDown, ChevronRight, ListIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TBNode {
  id: string;
  name: string;
  isLeaf?: boolean;
  opening?: number; openingType?: 'Dr.' | 'Cr.';
  dr: number; cr: number;
  closing?: number; closingType?: 'Dr.' | 'Cr.';
  children?: TBNode[];
}

const data: TBNode[] = [
  { id: 'a', name: 'Assets(10000)', opening: 357345696.37, openingType: 'Dr.', dr: 59607550, cr: 60573970.85, closing: 356379275.52, closingType: 'Dr.', children: [
    { id: 'a1', name: 'Current Assets(11000)', opening: 342573968.37, openingType: 'Dr.', dr: 59607550, cr: 60573970.85, closing: 341607547.52, closingType: 'Dr.', children: [
      { id: 'a11', name: 'Cash & Cash Equivalents(11100)', opening: 48106099.35, openingType: 'Dr.', dr: 41702550, cr: 60544617.85, closing: 29264031.50, closingType: 'Dr.', children: [
        { id: 'a111', name: 'Cash in Hand(11101)', opening: 1479570.50, openingType: 'Dr.', dr: 3812550, cr: 826460, closing: 4465660.50, closingType: 'Dr.', children: [
          { id: 'a1111', name: 'Head Office Cash(11101001)', isLeaf: true, opening: 1479570.50, openingType: 'Dr.', dr: 3812550, cr: 826460, closing: 4465660.50, closingType: 'Dr.' },
        ]},
        { id: 'a112', name: 'Cash at Bank(11102)', opening: 46056203.46, openingType: 'Dr.', dr: 37890000, cr: 59718157.85, closing: 24228045.61, closingType: 'Dr.', children: [
          { id: 'b1', name: 'City Bank A/C: 1233305341001(1102001)', isLeaf: true, opening: 23541132.27, openingType: 'Dr.', dr: 0, cr: 14000000, closing: 9541132.27, closingType: 'Dr.' },
          { id: 'b2', name: 'IBBL Bank A/C: 20501770100479609(1102010)', isLeaf: true, opening: 1059022.27, openingType: 'Dr.', dr: 0, cr: 6700000, closing: 5640977.73, closingType: 'Cr.' },
          { id: 'b3', name: 'SCB Bank A/C: 01357924601(1102011)', isLeaf: true, opening: 6652350.84, openingType: 'Dr.', dr: 0, cr: 3001150, closing: 3651200.84, closingType: 'Dr.' },
          { id: 'b4', name: 'UCB Bank A/C: 0901101000002235(1102012)', isLeaf: true, opening: 11110.53, openingType: 'Dr.', dr: 0, cr: 2900000, closing: 2788889.47, closingType: 'Cr.' },
          { id: 'b5', name: 'SEBL Bank A/C: 002411000008686(1102013)', isLeaf: true, opening: 2000, openingType: 'Dr.', dr: 0, cr: 0, closing: 2000, closingType: 'Dr.' },
          { id: 'b6', name: 'EBL Bank A/C: 1041060491993(1102007)', isLeaf: true, opening: 2634727.27, openingType: 'Dr.', dr: 0, cr: 3800000, closing: 1165272.73, closingType: 'Cr.' },
          { id: 'b7', name: 'Bank Asia A/C: 00333008701(1102008)', isLeaf: true, opening: 7378.33, openingType: 'Dr.', dr: 0, cr: 0, closing: 7378.33, closingType: 'Dr.' },
          { id: 'b8', name: 'DBL [Mohakhali] A/C: 2251500000866(1102009)', isLeaf: true, opening: 1737.71, openingType: 'Dr.', dr: 0, cr: 0, closing: 1737.71, closingType: 'Dr.' },
        ]},
        { id: 'a113', name: 'Cash at MFS(11103)', opening: 319511.33, openingType: 'Cr.', dr: 0, cr: 0, closing: 319511.33, closingType: 'Cr.' },
        { id: 'a114', name: 'Payment Gateway(11104)', opening: 822156.73, openingType: 'Dr.', dr: 0, cr: 0, closing: 822156.73, closingType: 'Dr.' },
        { id: 'a115', name: 'Cash at Foreign Currency(11105)', opening: 67680, openingType: 'Dr.', dr: 0, cr: 0, closing: 67680, closingType: 'Dr.' },
      ]},
      { id: 'a12', name: 'Trade and Other Receivables(11200)', opening: 20001290.02, openingType: 'Dr.', dr: 0, cr: 21520, closing: 19979770.02, closingType: 'Dr.' },
      { id: 'a13', name: 'Advances, Deposits and Prepayments(11300)', opening: 164507569, openingType: 'Dr.', dr: 17905000, cr: 7833, closing: 182404736, closingType: 'Dr.' },
      { id: 'a14', name: 'Investments & Loan(11400)', opening: 109959010, openingType: 'Dr.', dr: 0, cr: 0, closing: 109959010, closingType: 'Dr.' },
    ]},
    { id: 'a2', name: 'Non-Current Asset(12000)', opening: 14771728, openingType: 'Dr.', dr: 0, cr: 0, closing: 14771728, closingType: 'Dr.' },
  ]},
  { id: 'l', name: 'Liabilities(20000)', opening: 655330493.56, openingType: 'Cr.', dr: 5414231.25, cr: 3910509.53, closing: 653826771.84, closingType: 'Cr.' },
  { id: 'e', name: 'Equity(30000)', opening: 297984797.18, openingType: 'Dr.', dr: 0, cr: 0, closing: 297984797.18, closingType: 'Dr.' },
  { id: 'x', name: 'Expenses(50000)', opening: 0, dr: 541309.13, cr: 978610, closing: 437300.87, closingType: 'Cr.' },
];

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TrialBalanceReport = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('both');
  const [reportType, setReportType] = useState<'summary' | 'details'>('summary');
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['a', 'a1', 'a11', 'a111', 'a112']));

  const toggle = (id: string) => setExpanded(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const renderRows = (nodes: TBNode[], depth = 0): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    nodes.forEach(n => {
      const hasKids = n.children && n.children.length > 0;
      const isExp = expanded.has(n.id);
      out.push(
        <TableRow key={n.id}>
          <TableCell className="w-10">
            <div style={{ paddingLeft: `${depth * 16}px` }}>
              {hasKids ? (
                <button onClick={() => toggle(n.id)} className="text-primary">{isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
              ) : <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />}
            </div>
          </TableCell>
          {reportType === 'details' ? (
            <>
              <TableCell className="font-medium">{n.name}</TableCell>
              <TableCell className="text-right">{fmt(n.opening || 0)}{n.opening && n.openingType ? ' ' + n.openingType : ''}</TableCell>
              <TableCell className="text-right">{fmt(n.dr)}</TableCell>
              <TableCell className="text-right">{fmt(n.cr)}</TableCell>
              <TableCell className="text-right">{fmt(n.closing || 0)}{n.closing && n.closingType ? ' ' + n.closingType : ''}</TableCell>
              <TableCell className="text-center">{n.isLeaf && <Button size="icon" variant="ghost" className="h-7 w-7 bg-primary text-primary-foreground"><ListIcon className="h-4 w-4" /></Button>}</TableCell>
            </>
          ) : (
            <>
              <TableCell className="font-medium">{n.name}</TableCell>
              <TableCell className="text-right">{fmt(n.dr || (n.closingType === 'Dr.' ? n.closing || 0 : 0))}</TableCell>
              <TableCell className="text-right">{fmt(n.cr || (n.closingType === 'Cr.' ? n.closing || 0 : 0))}</TableCell>
              <TableCell className="text-center">
                {n.isLeaf && <div className="flex justify-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-primary text-primary-foreground"><ListIcon className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-primary text-primary-foreground"><FileText className="h-4 w-4" /></Button>
                </div>}
              </TableCell>
            </>
          )}
        </TableRow>
      );
      if (hasKids && isExp) out.push(...renderRows(n.children!, depth + 1));
    });
    return out;
  };

  const grandDr = data.reduce((s, n) => s + (n.dr || 0), 0);
  const grandCr = data.reduce((s, n) => s + (n.cr || 0), 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Reports</span> / Trial Balance Report
        </nav>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Trial Balance Report Filters</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(s => !s)}>
              {showFilters ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          {showFilters && (
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">Account Type Details</h4>
                  <RadioGroup value={accountType} onValueChange={setAccountType} className="flex gap-6">
                    <div className="flex items-center gap-2"><RadioGroupItem value="parent" id="t-parent" /><Label htmlFor="t-parent">Parent GL</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="general" id="t-general" /><Label htmlFor="t-general">General Ledger</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="both" id="t-both" /><Label htmlFor="t-both">Both</Label></div>
                  </RadioGroup>
                </div>
                <div>
                  <h4 className="font-bold mb-3">Report Type</h4>
                  <RadioGroup value={reportType} onValueChange={(v: any) => { if (v === 'extended') { navigate('/management/reports/trial-balance-extended'); return; } setReportType(v); }} className="flex gap-6">
                    <div className="flex items-center gap-2"><RadioGroupItem value="summary" id="r-sum" /><Label htmlFor="r-sum">Trial Balance Report</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="extended" id="r-ext" /><Label htmlFor="r-ext">Trial Balance Details Report</Label></div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3">Other Information</h4>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2"><Checkbox id="iz" checked={ignoreZero} onCheckedChange={c => setIgnoreZero(!!c)} /><Label htmlFor="iz">Ignore Zero Balance</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="iy" checked={ignoreYearClosing} onCheckedChange={c => setIgnoreYearClosing(!!c)} /><Label htmlFor="iy">Ignore Year Closing</Label></div>
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
                <div className="font-bold">{reportType === 'details' ? 'Trial Balance Details Report' : 'Trial Balance Report'}</div>
                <div>{fromDate && format(fromDate, 'dd MMM yyyy')} To {toDate && format(toDate, 'dd MMM yyyy')}</div>
              </div>
              <div className="flex items-center justify-between">
                <Button size="icon" className="bg-primary"><Settings className="h-4 w-4" /></Button>
                <Input placeholder="Search all columns..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="border rounded overflow-hidden">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground w-10"></TableHead>
                      {reportType === 'details' ? (
                        <>
                          <TableHead className="text-primary-foreground">Particulars</TableHead>
                          <TableHead className="text-primary-foreground text-right">Opening Balance</TableHead>
                          <TableHead className="text-primary-foreground text-right">Total Dr.</TableHead>
                          <TableHead className="text-primary-foreground text-right">Total Cr.</TableHead>
                          <TableHead className="text-primary-foreground text-right">Closing Balance</TableHead>
                          <TableHead className="text-primary-foreground text-center">Action</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-primary-foreground">Account Information</TableHead>
                          <TableHead className="text-primary-foreground text-right">Dr. Amount</TableHead>
                          <TableHead className="text-primary-foreground text-right">Cr. Amount</TableHead>
                          <TableHead className="text-primary-foreground text-center">Action</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderRows(data)}
                    <TableRow className="bg-muted font-bold">
                      <TableCell></TableCell>
                      <TableCell className="text-right">Grand Total:</TableCell>
                      {reportType === 'details' ? (
                        <>
                          <TableCell></TableCell>
                          <TableCell className="text-right">{fmt(grandDr)}</TableCell>
                          <TableCell className="text-right">{fmt(grandCr)}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-right">{fmt(grandDr)}</TableCell>
                          <TableCell className="text-right">{fmt(grandCr)}</TableCell>
                          <TableCell></TableCell>
                        </>
                      )}
                    </TableRow>
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

export default TrialBalanceReport;