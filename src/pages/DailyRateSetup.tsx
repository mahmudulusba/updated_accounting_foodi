import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Save, History, Calendar, ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface DailyRate {
  bankRate: number;       // 1 USD (Bank) = X in functional currency
  iataRate: number;       // 1 USD (IATA) = X in functional currency
  bankRateBDT: number;    // 1 USD (Bank) = X BDT (system currency)
  iataRateBDT: number;    // 1 USD (IATA) = X BDT (system currency)
}

interface DailyRateRecord {
  id: string;
  date: string;
  bankRate: number;
  iataRate: number;
  bankRateBDT: number;
  iataRateBDT: number;
  functionalCurrency: string;
  savedAt: string;
  savedBy: string;
  locked: boolean;
}

// Mock historical data
const initialHistory: DailyRateRecord[] = [
  {
    id: '1',
    date: '2026-03-15',
    bankRate: 121.50,
    iataRate: 111.00,
    bankRateBDT: 121.50,
    iataRateBDT: 111.00,
    functionalCurrency: 'BDT',
    savedAt: '2026-03-15T10:30:00',
    savedBy: 'Farzana Islam',
    locked: true,
  },
  {
    id: '2',
    date: '2026-03-14',
    bankRate: 121.00,
    iataRate: 110.50,
    bankRateBDT: 121.00,
    iataRateBDT: 110.50,
    functionalCurrency: 'BDT',
    savedAt: '2026-03-14T09:15:00',
    savedBy: 'Farzana Islam',
    locked: true,
  },
  {
    id: '3',
    date: '2026-03-13',
    bankRate: 120.75,
    iataRate: 110.25,
    bankRateBDT: 120.75,
    iataRateBDT: 110.25,
    functionalCurrency: 'BDT',
    savedAt: '2026-03-13T09:45:00',
    savedBy: 'Farzana Islam',
    locked: true,
  },
];

const currencySymbols: Record<string, string> = {
  BDT: '৳',
  USD: '$',
  SGD: 'S$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

export default function DailyRateSetup() {
  const { selectedBranch } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [currentDate, setCurrentDate] = useState(today);
  const [history, setHistory] = useState<DailyRateRecord[]>(initialHistory);

  const systemCurrency = 'BDT';
  const functionalCurrency = selectedBranch?.baseCurrency || 'BDT';
  const foreignCurrency = 'USD';
  const isFunctionalBDT = functionalCurrency === systemCurrency;

  const funcSymbol = currencySymbols[functionalCurrency] || functionalCurrency;
  const sysSymbol = currencySymbols[systemCurrency];

  const todayRecord = useMemo(() => history.find(h => h.date === currentDate), [history, currentDate]);
  const isLocked = todayRecord?.locked ?? false;

  const getDefaultRates = (): DailyRate => {
    if (functionalCurrency === 'BDT') return { bankRate: 122.00, iataRate: 111.50, bankRateBDT: 122.00, iataRateBDT: 111.50 };
    if (functionalCurrency === 'SGD') return { bankRate: 1.34, iataRate: 1.31, bankRateBDT: 122.00, iataRateBDT: 111.50 };
    if (functionalCurrency === 'INR') return { bankRate: 83.50, iataRate: 81.00, bankRateBDT: 122.00, iataRateBDT: 111.50 };
    if (functionalCurrency === 'EUR') return { bankRate: 0.92, iataRate: 0.90, bankRateBDT: 122.00, iataRateBDT: 111.50 };
    if (functionalCurrency === 'GBP') return { bankRate: 0.79, iataRate: 0.77, bankRateBDT: 122.00, iataRateBDT: 111.50 };
    return { bankRate: 1, iataRate: 1, bankRateBDT: 122.00, iataRateBDT: 111.50 };
  };

  const getLatestRates = (): DailyRate => {
    if (todayRecord) return { bankRate: todayRecord.bankRate, iataRate: todayRecord.iataRate, bankRateBDT: todayRecord.bankRateBDT, iataRateBDT: todayRecord.iataRateBDT };
    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
    if (sorted.length > 0) return { bankRate: sorted[0].bankRate, iataRate: sorted[0].iataRate, bankRateBDT: sorted[0].bankRateBDT, iataRateBDT: sorted[0].iataRateBDT };
    return getDefaultRates();
  };

  const [rates, setRates] = useState<DailyRate>(getLatestRates);

  // Derived: Functional to BDT cross rate
  const funcToBDT_bank = rates.bankRate > 0 ? (rates.bankRateBDT / rates.bankRate) : 0;
  const funcToBDT_iata = rates.iataRate > 0 ? (rates.iataRateBDT / rates.iataRate) : 0;

  const handleSave = () => {
    if (isLocked) {
      toast.error('Rates for this date are already locked');
      return;
    }
    if (rates.bankRate <= 0 || rates.iataRate <= 0) {
      toast.error('Please enter valid functional currency rates');
      return;
    }
    if (!isFunctionalBDT && (rates.bankRateBDT <= 0 || rates.iataRateBDT <= 0)) {
      toast.error('Please enter valid BDT rates');
      return;
    }

    const newRecord: DailyRateRecord = {
      id: Date.now().toString(),
      date: currentDate,
      bankRate: rates.bankRate,
      iataRate: rates.iataRate,
      bankRateBDT: isFunctionalBDT ? rates.bankRate : rates.bankRateBDT,
      iataRateBDT: isFunctionalBDT ? rates.iataRate : rates.iataRateBDT,
      functionalCurrency,
      savedAt: new Date().toISOString(),
      savedBy: 'Current User',
      locked: true,
    };

    setHistory(prev => [newRecord, ...prev.filter(h => h.date !== currentDate)]);
    toast.success(`Rates saved & locked for ${format(parseISO(currentDate), 'dd-MMM-yyyy')}`);
  };

  const loadRecord = (record: DailyRateRecord) => {
    setCurrentDate(record.date);
    setRates({ bankRate: record.bankRate, iataRate: record.iataRate, bankRateBDT: record.bankRateBDT, iataRateBDT: record.iataRateBDT });
  };

  const formatDateDisplay = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'dd-MMM-yyyy'); } catch { return dateStr; }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Configuration</span> / Daily Rate Setup
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Daily Rate Setup</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <Label className="text-sm font-medium">Date:</Label>
              <Input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  setCurrentDate(e.target.value);
                  const existing = history.find(h => h.date === e.target.value);
                  if (existing) {
                    setRates({ bankRate: existing.bankRate, iataRate: existing.iataRate, bankRateBDT: existing.bankRateBDT, iataRateBDT: existing.iataRateBDT });
                  } else {
                    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
                    if (sorted.length > 0) {
                      setRates({ bankRate: sorted[0].bankRate, iataRate: sorted[0].iataRate, bankRateBDT: sorted[0].bankRateBDT, iataRateBDT: sorted[0].iataRateBDT });
                    }
                  }
                }}
                className="w-40 h-8"
              />
            </div>
            {isLocked ? (
              <div className="flex items-center gap-1.5 text-sm text-warning bg-warning/10 border border-warning/30 px-3 py-1.5 rounded-md">
                <Lock size={14} /> Locked
              </div>
            ) : (
              <Button onClick={handleSave} className="gap-2" size="sm">
                <Save size={14} /> Save & Lock
              </Button>
            )}
          </div>
        </div>

        {/* Currency Context Info */}
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">System Currency:</span>
                <Badge variant="secondary" className="font-mono">{systemCurrency} ({sysSymbol})</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Functional Currency:</span>
                <Badge variant="outline" className="font-mono border-primary text-primary">
                  {functionalCurrency} ({funcSymbol})
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Foreign Currency:</span>
                <Badge className="font-mono bg-accent text-accent-foreground">{foreignCurrency} ($)</Badge>
              </div>
              {!isFunctionalBDT && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <Info size={12} />
                  <span>Non-BDT functional currency — BDT conversion rates required</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rate Entry */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">
              Exchange Rate — {formatDateDisplay(currentDate)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-12">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Rate Type</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center">From</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center w-8"></TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center">To</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center">Rate</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Row 1: Bank Rate → Functional */}
                  <TableRow>
                    <TableCell className="font-medium">1</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        Bank Rate
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium">1 USD ($)</TableCell>
                    <TableCell className="text-center"><ArrowRight size={16} className="text-muted-foreground mx-auto" /></TableCell>
                    <TableCell className="text-center font-mono font-medium">{functionalCurrency} ({funcSymbol})</TableCell>
                    <TableCell>
                      <Input
                        type="number" step="0.01"
                        value={rates.bankRate || ''}
                        onChange={(e) => setRates(prev => ({ ...prev, bankRate: parseFloat(e.target.value) || 0 }))}
                        className="w-32 text-right mx-auto h-8 font-mono"
                        disabled={isLocked} placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell><span className="text-xs text-muted-foreground">General payments, Bank transactions</span></TableCell>
                  </TableRow>

                  {/* Row 2: IATA Rate → Functional */}
                  <TableRow className="bg-table-row-alt">
                    <TableCell className="font-medium">2</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                        IATA Rate
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium">1 USD ($)</TableCell>
                    <TableCell className="text-center"><ArrowRight size={16} className="text-muted-foreground mx-auto" /></TableCell>
                    <TableCell className="text-center font-mono font-medium">{functionalCurrency} ({funcSymbol})</TableCell>
                    <TableCell>
                      <Input
                        type="number" step="0.01"
                        value={rates.iataRate || ''}
                        onChange={(e) => setRates(prev => ({ ...prev, iataRate: parseFloat(e.target.value) || 0 }))}
                        className="w-32 text-right mx-auto h-8 font-mono"
                        disabled={isLocked} placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell><span className="text-xs text-muted-foreground">IATA payments & transactions only</span></TableCell>
                  </TableRow>

                  {/* Row 3 & 4: BDT conversion (only for non-BDT functional currency) */}
                  {!isFunctionalBDT && (
                    <>
                      <TableRow className="border-t-2 border-dashed border-primary/20">
                        <TableCell className="font-medium">3</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              Bank Rate
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">BDT</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono font-medium">1 USD ($)</TableCell>
                        <TableCell className="text-center"><ArrowRight size={16} className="text-muted-foreground mx-auto" /></TableCell>
                        <TableCell className="text-center font-mono font-medium">BDT ({sysSymbol})</TableCell>
                        <TableCell>
                          <Input
                            type="number" step="0.01"
                            value={rates.bankRateBDT || ''}
                            onChange={(e) => setRates(prev => ({ ...prev, bankRateBDT: parseFloat(e.target.value) || 0 }))}
                            className="w-32 text-right mx-auto h-8 font-mono"
                            disabled={isLocked} placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">System currency conversion</span></TableCell>
                      </TableRow>

                      <TableRow className="bg-table-row-alt">
                        <TableCell className="font-medium">4</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                              IATA Rate
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">BDT</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono font-medium">1 USD ($)</TableCell>
                        <TableCell className="text-center"><ArrowRight size={16} className="text-muted-foreground mx-auto" /></TableCell>
                        <TableCell className="text-center font-mono font-medium">BDT ({sysSymbol})</TableCell>
                        <TableCell>
                          <Input
                            type="number" step="0.01"
                            value={rates.iataRateBDT || ''}
                            onChange={(e) => setRates(prev => ({ ...prev, iataRateBDT: parseFloat(e.target.value) || 0 }))}
                            className="w-32 text-right mx-auto h-8 font-mono"
                            disabled={isLocked} placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">IATA system currency conversion</span></TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </TableWithSearch>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-muted/40 border-t">
              <div className="flex items-start gap-2 mb-2">
                <Info size={14} className="text-muted-foreground mt-0.5" />
                <span className="text-xs font-medium text-muted-foreground">Rate Preview</span>
              </div>
              <div className={`grid gap-3 ${!isFunctionalBDT ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {/* Functional rates */}
                <div className="flex items-center gap-2 text-sm bg-background rounded-md p-2.5 border">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">Bank</Badge>
                  <span className="font-mono">1 USD = {funcSymbol}{rates.bankRate.toLocaleString('en-US', { minimumFractionDigits: 2 })} {functionalCurrency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-background rounded-md p-2.5 border">
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs">IATA</Badge>
                  <span className="font-mono">1 USD = {funcSymbol}{rates.iataRate.toLocaleString('en-US', { minimumFractionDigits: 2 })} {functionalCurrency}</span>
                </div>

                {/* BDT rates (non-BDT functional currency) */}
                {!isFunctionalBDT && (
                  <>
                    <div className="flex items-center gap-2 text-sm bg-background rounded-md p-2.5 border">
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">Bank</Badge>
                      <span className="font-mono">1 USD = {sysSymbol}{rates.bankRateBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-background rounded-md p-2.5 border">
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs">IATA</Badge>
                      <span className="font-mono">1 USD = {sysSymbol}{rates.iataRateBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT</span>
                    </div>
                    {/* Cross rate */}
                    <div className="flex items-center gap-2 text-sm bg-primary/5 rounded-md p-2.5 border border-primary/20">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">Cross</Badge>
                      <span className="font-mono text-xs">
                        1 {functionalCurrency} = {sysSymbol}{funcToBDT_bank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} BDT (Bank)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History size={16} /> Rate History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-semibold">Date</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold text-right">Bank ({funcSymbol})</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold text-right">IATA ({funcSymbol})</TableHead>
                      {!isFunctionalBDT && (
                        <>
                          <TableHead className="text-table-header-foreground font-semibold text-right">Bank ({sysSymbol})</TableHead>
                          <TableHead className="text-table-header-foreground font-semibold text-right">IATA ({sysSymbol})</TableHead>
                        </>
                      )}
                      <TableHead className="text-table-header-foreground font-semibold">Saved By</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Saved At</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold text-center">Status</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record, idx) => (
                      <TableRow key={record.id} className={idx % 2 === 1 ? 'bg-table-row-alt' : ''}>
                        <TableCell className="font-medium">{formatDateDisplay(record.date)}</TableCell>
                        <TableCell className="text-right font-mono">
                          {funcSymbol}{record.bankRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {funcSymbol}{record.iataRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        {!isFunctionalBDT && (
                          <>
                            <TableCell className="text-right font-mono">
                              {sysSymbol}{record.bankRateBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {sysSymbol}{record.iataRateBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="text-sm">{record.savedBy}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(parseISO(record.savedAt), 'dd MMM yyyy, HH:mm')}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                            <Lock size={10} /> Locked
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => loadRecord(record)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
