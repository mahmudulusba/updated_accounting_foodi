import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save, History, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// All setup currencies
const allCurrencies = [
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

interface CurrencyRate {
  currencyCode: string;
  currencyName: string;
  symbol: string;
  rateToUSD: number;
  rateToIATA: number;
}

interface SavedRateEntry {
  id: string;
  conversionDate: string;
  rates: CurrencyRate[];
  savedAt: Date;
}

export default function CurrencyRateSetup() {
  const { selectedBranch } = useApp();
  const isConsolidated = selectedBranch?.isConsolidated === true;
  const today = new Date();

  const [conversionDate, setConversionDate] = useState(format(today, 'yyyy-MM-dd'));
  const [sameAsPreviousDate, setSameAsPreviousDate] = useState(false);
  const [savedRates, setSavedRates] = useState<SavedRateEntry[]>([]);

  // Initialize rates for all currencies against USD and IATA
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>(() => {
    return allCurrencies.map(c => {
      let defaultUSD = 1;
      let defaultIATA = 1;
      if (c.code === 'BDT') { defaultUSD = 0.0084; defaultIATA = 0.0082; }
      else if (c.code === 'USD') { defaultUSD = 1; defaultIATA = 0.98; }
      else if (c.code === 'SGD') { defaultUSD = 0.78; defaultIATA = 0.76; }
      else if (c.code === 'INR') { defaultUSD = 0.012; defaultIATA = 0.011; }
      else if (c.code === 'EUR') { defaultUSD = 1.08; defaultIATA = 1.06; }
      else if (c.code === 'GBP') { defaultUSD = 1.27; defaultIATA = 1.25; }
      return {
        currencyCode: c.code,
        currencyName: c.name,
        symbol: c.symbol,
        rateToUSD: defaultUSD,
        rateToIATA: defaultIATA,
      };
    });
  });

  const updateRate = (code: string, field: 'rateToUSD' | 'rateToIATA', value: string) => {
    setCurrencyRates(prev => prev.map(rate =>
      rate.currencyCode === code
        ? { ...rate, [field]: parseFloat(value) || 0 }
        : rate
    ));
  };

  const handleSave = () => {
    if (!conversionDate) {
      toast.error('Please select a conversion date');
      return;
    }
    setSavedRates(prev => [{
      id: Date.now().toString(),
      conversionDate,
      rates: [...currencyRates],
      savedAt: new Date(),
    }, ...prev]);
    toast.success('Currency rates saved successfully');
  };

  const handleSameAsPrevious = (checked: boolean) => {
    setSameAsPreviousDate(checked);
    if (checked && savedRates.length > 0) {
      const lastSaved = savedRates[0];
      setConversionDate(lastSaved.conversionDate);
      setCurrencyRates(lastSaved.rates);
      toast.info('Loaded rates from previous date');
    }
  };

  const handleDownload = () => {
    toast.success('Rate report downloaded');
  };

  if (!isConsolidated) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">Central Configuration</span> / Currency Rate Setup
            </nav>
            <h1 className="text-2xl font-bold">Currency Rate Setup</h1>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Currency Rate Setup is available for company-level configuration only.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">Central Configuration</span> / Currency Rate Setup
            </nav>
            <h1 className="text-2xl font-bold">Currency Rate Setup</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Rates
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>Conversion Date<span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={conversionDate}
                  onChange={(e) => setConversionDate(e.target.value)}
                  disabled={sameAsPreviousDate}
                />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox
                  id="sameAsPrevious"
                  checked={sameAsPreviousDate}
                  onCheckedChange={handleSameAsPrevious}
                  disabled={savedRates.length === 0}
                />
                <Label htmlFor="sameAsPrevious" className="cursor-pointer">
                  Same As Previous Date
                </Label>
              </div>
              {savedRates.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="h-4 w-4" />
                  Last saved: {format(savedRates[0].savedAt, 'dd MMM yyyy, HH:mm')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Currency Conversion Rates (All Currencies → USD & IATA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Currency</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Symbol</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center">
                      Rate to USD ($)
                    </TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center">
                      Rate to IATA
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencyRates.map((rate, index) => (
                    <TableRow key={rate.currencyCode} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {rate.currencyCode} - {rate.currencyName}
                      </TableCell>
                      <TableCell className="font-mono text-lg">{rate.symbol}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rate.rateToUSD}
                          onChange={(e) => updateRate(rate.currencyCode, 'rateToUSD', e.target.value)}
                          step="0.0001"
                          className="w-32 text-right mx-auto"
                          disabled={rate.currencyCode === 'USD'}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rate.rateToIATA}
                          onChange={(e) => updateRate(rate.currencyCode, 'rateToIATA', e.target.value)}
                          step="0.0001"
                          className="w-32 text-right mx-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Rate Explanation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Rate to USD:</strong> 1 unit of currency = X USD</li>
                <li>• <strong>Rate to IATA:</strong> 1 unit of currency = X IATA rate</li>
                <li>• All setup currencies are listed for conversion against USD and IATA</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {savedRates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Rate History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedRates.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setConversionDate(entry.conversionDate);
                      setCurrencyRates(entry.rates);
                      toast.info('Loaded historical rates');
                    }}
                  >
                    <div>
                      <span className="font-medium">
                        Conversion Date: {format(new Date(entry.conversionDate), 'dd-MMM-yyyy')}
                      </span>
                      <span className="text-sm text-muted-foreground ml-4">
                        Saved: {format(entry.savedAt, 'dd MMM yyyy, HH:mm')}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">Load</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}