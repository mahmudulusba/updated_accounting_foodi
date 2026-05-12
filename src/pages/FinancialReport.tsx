import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Printer, FileSpreadsheet, FileText, Settings, Minus, Plus, CalendarIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Node { id: string; name: string; amount: number; type: 'Dr.' | 'Cr.'; comparative?: number; children?: Node[]; }

const bsData: Node[] = [
  { id: 'a', name: 'Assets(10000)', amount: 356379275.52, type: 'Dr.', comparative: 0 },
  { id: 'l', name: 'Liabilities(20000)', amount: 653926771.84, type: 'Cr.', comparative: 0 },
  { id: 'e', name: 'Equity(30000)', amount: 297547496.31, type: 'Dr.', comparative: 0 },
];

const isData: Node[] = [
  { id: 'x', name: 'Expenses(50000)', amount: 437300.87, type: 'Cr.', comparative: 0, children: [
    { id: 'x1', name: 'Expenses(51000)', amount: 437300.87, type: 'Cr.', comparative: 0 },
  ]},
];

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FinancialReport = () => {
  const [tab, setTab] = useState<'bs' | 'is'>('bs');
  const [ignoreZero, setIgnoreZero] = useState(true);
  const [ignoreYearClosing, setIgnoreYearClosing] = useState(false);
  const [sbu, setSbu] = useState(''); const [city, setCity] = useState('');
  const [hub, setHub] = useState(''); const [dept, setDept] = useState('');
  const [asOnDate, setAsOnDate] = useState<Date | undefined>(new Date(2026, 3, 30));
  const [comparativeDate, setComparativeDate] = useState<Date | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(2026, 3, 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 3, 30));
  const [compFrom, setCompFrom] = useState<Date | undefined>();
  const [compTo, setCompTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showReport, setShowReport] = useState(true);
  const [search, setSearch] = useState('');
  const [reportMode, setReportMode] = useState<'summary' | 'details'>('summary');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['x']));

  const monthCols = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

  interface DetailNode { id: string; name: string; bold?: boolean; children?: DetailNode[]; }
  const bsDetailTree: DetailNode[] = [
    { id: 'a', name: 'Assets(10000)', bold: true, children: [
      { id: 'a1', name: 'Cash & Cash Equivalents' },
      { id: 'a2', name: 'Accounts Receivable' },
      { id: 'a3', name: 'Inventory' },
      { id: 'a4', name: 'Property, Plant & Equipment' },
      { id: 'a5', name: 'Intangible Assets' },
    ]},
    { id: 'l', name: 'Liabilities(20000)', bold: true, children: [
      { id: 'l1', name: 'Accounts Payable' },
      { id: 'l2', name: 'Short-term Debt' },
      { id: 'l3', name: 'Long-term Debt' },
    ]},
    { id: 'e', name: 'Equity(30000)', bold: true, children: [
      { id: 'e1', name: 'Share Capital' },
      { id: 'e2', name: 'Retained Earnings' },
    ]},
  ];
  const isDetailTree: DetailNode[] = [
    { id: 'x', name: 'Expenses(50000)', bold: true, children: [
      { id: 'x1', name: 'Expenses(51000)' },
    ]},
  ];

  const toggle = (id: string) => setExpanded(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const renderRows = (nodes: Node[], depth = 0): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    nodes.forEach(n => {
      const hasKids = n.children && n.children.length > 0;
      const isExp = expanded.has(n.id);
      out.push(
        <TableRow key={n.id}>
          <TableCell className="w-10">
            <div style={{ paddingLeft: `${depth * 16}px` }}>
              {hasKids ? (
                <button onClick={() => toggle(n.id)}>{isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
              ) : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </TableCell>
          <TableCell className="font-medium">{n.name}</TableCell>
          <TableCell className="text-right">{fmt(n.amount)} {n.type}</TableCell>
          <TableCell className="text-right">{fmt(n.comparative || 0)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      );
      if (hasKids && isExp) out.push(...renderRows(n.children!, depth + 1));
    });
    return out;
  };

  const data = tab === 'bs' ? bsData : isData;
  const previewTitle = tab === 'bs'
    ? `Statement of Financial Position As on ${asOnDate ? format(asOnDate, 'dd MMM yyyy') : ''}`
    : `Statement of Profit or Loss and Other Comprehensive Income for the period from ${fromDate ? format(fromDate, 'dd MMM yyyy') : ''} to ${toDate ? format(toDate, 'dd MMM yyyy') : ''}`;
  const amountColLabel = tab === 'bs'
    ? `Amount(As On ${asOnDate ? format(asOnDate, 'dd MMM yyyy') : ''})`
    : `Amount(${fromDate ? format(fromDate, 'dd MMM yyyy') : ''} To ${toDate ? format(toDate, 'dd MMM yyyy') : ''})`;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <nav className="text-sm text-muted-foreground"><span className="text-primary font-medium">Reports</span> / Financial Statement Report</nav>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Financial Report Filters</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(s => !s)}>{showFilters ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
          </div>
          {showFilters && (
            <CardContent className="p-6">
              <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
                <TabsList>
                  <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                  <TabsTrigger value="is">Income Statement</TabsTrigger>
                </TabsList>

                <TabsContent value="bs" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3">Others</h4>
                      <div className="flex items-center gap-2"><Checkbox id="bs-iz" checked={ignoreZero} onCheckedChange={c => setIgnoreZero(!!c)} /><Label htmlFor="bs-iz">Ignore Zero Balance</Label></div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3">As On Date</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2"><Label className="min-w-[100px]">Current Year <span className="text-destructive">*</span></Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{asOnDate ? format(asOnDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={asOnDate} onSelect={setAsOnDate} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                        <div className="flex items-center gap-2"><Label className="min-w-[120px]">Comparative Year</Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{comparativeDate ? format(comparativeDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={comparativeDate} onSelect={setComparativeDate} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="is" className="space-y-6 mt-4">
                  <div>
                    <h4 className="font-bold mb-3">Others</h4>
                    <div className="flex gap-6 mb-4">
                      <div className="flex items-center gap-2"><Checkbox id="is-iz" checked={ignoreZero} onCheckedChange={c => setIgnoreZero(!!c)} /><Label htmlFor="is-iz">Ignore Zero Balance</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="is-iy" checked={ignoreYearClosing} onCheckedChange={c => setIgnoreYearClosing(!!c)} /><Label htmlFor="is-iy">Ignore Year Closing</Label></div>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3">Current Year</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Label className="min-w-[60px]">From <span className="text-destructive">*</span></Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{fromDate ? format(fromDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                        <div className="flex items-center gap-3"><Label className="min-w-[60px]">To <span className="text-destructive">*</span></Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{toDate ? format(toDate, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3">Comparative Year</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Label className="min-w-[60px]">From</Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{compFrom ? format(compFrom, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={compFrom} onSelect={setCompFrom} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                        <div className="flex items-center gap-3"><Label className="min-w-[60px]">To</Label>
                          <Popover><PopoverTrigger asChild><Button variant="outline" className="flex-1 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{compTo ? format(compTo, "dd MMM yyyy") : "dd MMM yyyy"}</Button></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={compTo} onSelect={setCompTo} className="pointer-events-auto" /></PopoverContent></Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-center gap-3 mt-6">
                <Button variant="destructive" onClick={() => setShowReport(false)}>Clear</Button>
                <Button className="bg-primary" onClick={() => setShowReport(true)}>Generate Report</Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">Financial Report Preview</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPreview(s => !s)}>{showPreview ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
          </div>
          {showPreview && showReport && (
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-end gap-2">
                <Button size="icon" className="bg-primary"><Printer className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-destructive hover:bg-destructive/90"><FileText className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700"><FileSpreadsheet className="h-4 w-4" /></Button>
              </div>
              <div className="border rounded text-center py-3 font-bold">{previewTitle}</div>

              <div className="flex items-center gap-6 px-2">
                <Label className="font-semibold">Report Type:</Label>
                <RadioGroup value={reportMode} onValueChange={(v: any) => setReportMode(v)} className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><RadioGroupItem value="summary" id="rm-sum" /><Label htmlFor="rm-sum">Summary</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="details" id="rm-det" /><Label htmlFor="rm-det">Details (Monthly)</Label></div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Button size="icon" className="bg-primary"><Settings className="h-4 w-4" /></Button>
                <Input placeholder="Search all columns..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              {reportMode === 'summary' ? (
                <div className="border rounded overflow-hidden">
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground w-10">&gt;</TableHead>
                        <TableHead className="text-primary-foreground">Account Information</TableHead>
                        <TableHead className="text-primary-foreground text-right">{amountColLabel}</TableHead>
                        <TableHead className="text-primary-foreground text-right">Amount</TableHead>
                        <TableHead className="text-primary-foreground text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renderRows(data)}
                      {tab === 'is' && (
                        <TableRow className="bg-muted font-bold">
                          <TableCell></TableCell>
                          <TableCell>Net Profit / Loss :</TableCell>
                          <TableCell className="text-right">437,300.87 Cr.</TableCell>
                          <TableCell className="text-right">0.00 Dr.</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableWithSearch>
                </div>
              ) : (
                <div className="border rounded overflow-x-auto">
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground w-10 sticky left-0 bg-primary z-10">&gt;</TableHead>
                        <TableHead className="text-primary-foreground sticky left-10 bg-primary z-10 min-w-[240px]">Account Information</TableHead>
                        <TableHead className="text-primary-foreground text-right whitespace-nowrap">Current Month Actual</TableHead>
                        <TableHead className="text-primary-foreground text-right whitespace-nowrap">Previous Month Actual</TableHead>
                        {monthCols.map(m => (
                          <TableHead key={m} className="text-primary-foreground text-right">{m}</TableHead>
                        ))}
                        <TableHead className="text-primary-foreground text-right whitespace-nowrap">Full Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tab === 'bs' ? (
                        bsDetailTree.flatMap(parent => {
                          const isExp = expanded.has(parent.id);
                          const rows = [
                            <TableRow key={parent.id} className="font-semibold bg-muted">
                              <TableCell className="sticky left-0 bg-muted z-10">
                                <button onClick={() => toggle(parent.id)}>{isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
                              </TableCell>
                              <TableCell className="sticky left-10 bg-muted z-10 font-medium">{parent.name}</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              {monthCols.map(m => (<TableCell key={m} className="text-right">-</TableCell>))}
                              <TableCell className="text-right">-</TableCell>
                            </TableRow>
                          ];
                          if (isExp && parent.children) {
                            parent.children.forEach(child => {
                              rows.push(
                                <TableRow key={child.id}>
                                  <TableCell className="sticky left-0 bg-background z-10"><ChevronRight className="h-4 w-4 text-muted-foreground ml-4" /></TableCell>
                                  <TableCell className="sticky left-10 bg-background z-10">{child.name}</TableCell>
                                  <TableCell className="text-right">-</TableCell>
                                  <TableCell className="text-right">-</TableCell>
                                  {monthCols.map(m => (<TableCell key={m} className="text-right">-</TableCell>))}
                                  <TableCell className="text-right">-</TableCell>
                                </TableRow>
                              );
                            });
                          }
                          return rows;
                        })
                      ) : (
                        isDetailTree.flatMap(parent => {
                          const isExp = expanded.has(parent.id);
                          const rows = [
                            <TableRow key={parent.id} className="font-semibold bg-muted">
                              <TableCell className="sticky left-0 bg-muted z-10">
                                <button onClick={() => toggle(parent.id)}>{isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
                              </TableCell>
                              <TableCell className="sticky left-10 bg-muted z-10 font-medium">{parent.name}</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              {monthCols.map(m => (<TableCell key={m} className="text-right">-</TableCell>))}
                              <TableCell className="text-right">-</TableCell>
                            </TableRow>
                          ];
                          if (isExp && parent.children) {
                            parent.children.forEach(child => {
                              rows.push(
                                <TableRow key={child.id}>
                                  <TableCell className="sticky left-0 bg-background z-10"><ChevronRight className="h-4 w-4 text-muted-foreground ml-4" /></TableCell>
                                  <TableCell className="sticky left-10 bg-background z-10">{child.name}</TableCell>
                                  <TableCell className="text-right">-</TableCell>
                                  <TableCell className="text-right">-</TableCell>
                                  {monthCols.map(m => (<TableCell key={m} className="text-right">-</TableCell>))}
                                  <TableCell className="text-right">-</TableCell>
                                </TableRow>
                              );
                            });
                          }
                          rows.push(
                            <TableRow key={`${parent.id}-np`} className="font-bold bg-muted">
                              <TableCell className="sticky left-0 bg-muted z-10"></TableCell>
                              <TableCell className="sticky left-10 bg-muted z-10">Net Profit / Loss :</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              {monthCols.map(m => (<TableCell key={m} className="text-right">-</TableCell>))}
                              <TableCell className="text-right">-</TableCell>
                            </TableRow>
                          );
                          return rows;
                        })
                      )}
                    </TableBody>
                  </TableWithSearch>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinancialReport;