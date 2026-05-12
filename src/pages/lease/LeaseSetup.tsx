import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';
import { Save, X, Filter, Plus, Minus, ArrowLeft, Pencil, Trash2, Search, RotateCcw, Ban, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';


type Mode = 'rent' | 'lease' | 'both';
type View = 'list' | 'form';
type Status = 'Active' | 'Notice' | 'Closed' | 'Amendment';

interface AmendmentRow {
  id: number;
  initialAmount: string;
  increaseBase: string;
  increasePct: string;
  startDate: string;
  endDate: string;
  leaseAmount: string;
  rentAmount: string;
}

interface FormState {
  agreementType: string;
  leaseRentType: string;
  hubName: string;
  hubManager: string;
  hubOwnerName: string;
  hubAddress: string;
  areaSqft: string;
  rentPerSqft: string;
  rentBdt: string;
  vat: string;
  tds: string;
  cashPayment: string;
  bankPayment: string;
  securityMoney: string;
  advance: string;
  advanceAdjusted: string;
  serviceCharge: string;
  utilityBill: string;
  total: string;
  contractStart: string;
  contractEnd: string;
  tenure: string;
  paymentMode: string;
  bankDetails: string;
  parkingSpace: string;
  remarks: string;
  noticePeriod: string;
  noticeDate: string;
}

const empty: FormState = {
  agreementType: '', leaseRentType: '', hubName: '', hubManager: '', hubOwnerName: '', hubAddress: '',
  areaSqft: '', rentPerSqft: '', rentBdt: '', vat: '', tds: '',
  cashPayment: '', bankPayment: '', securityMoney: '', advance: '',
  advanceAdjusted: '', serviceCharge: '', utilityBill: '', total: '',
  contractStart: '', contractEnd: '', tenure: '', paymentMode: '',
  bankDetails: '', parkingSpace: '', remarks: '', noticePeriod: '', noticeDate: '',
};

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
const hubsByCity: Record<string, string[]> = {
  Dhaka: ['Baridhara Hub Office', 'Dhanmondi Hub', 'Mirpur 10 Hub', 'Khilgaon Hub', 'Jatrabari Hub', 'Uttara Hub', 'Lalbagh Hub', 'Tongi Hub'],
  Chittagong: ['GEC Hub', 'Agrabad Hub'],
  Sylhet: ['Zindabazar Hub'],
  Rajshahi: ['Shaheb Bazar Hub'],
  Khulna: ['Sonadanga Hub'],
};

const allHubs = Object.values(hubsByCity).flat();
const hubManagers: Record<string, string> = {
  'Baridhara Hub Office': 'Md. Rahim Uddin',
  'Dhanmondi Hub': 'Sadia Afroz',
  'Mirpur 10 Hub': 'Anwar Hossain',
  'Khilgaon Hub': 'Tanvir Ahmed',
  'Jatrabari Hub': 'Rakib Hasan',
  'Uttara Hub': 'Nadia Sultana',
  'Lalbagh Hub': 'Imran Khan',
  'Tongi Hub': 'Shahin Alam',
  'GEC Hub': 'Mizanur Rahman',
  'Agrabad Hub': 'Farhana Akter',
  'Zindabazar Hub': 'Kamal Hossain',
  'Shaheb Bazar Hub': 'Rezaul Karim',
  'Sonadanga Hub': 'Salma Begum',
};

interface ListRow {
  id: number;
  agreementType: string;
  hubName: string;
  city: string;
  hubAddress: string;
  areaSqft: number;
  rentPerSqft: number;
  rentBdt: number;
  vat: number;
  tds: number;
  total: number;
  contractStart: string;
  contractEnd: string;
  tenure: string;
  paymentMode: string;
  noticePeriod: string;
  bankPayment: number;
  cashPayment: number;
  type: Mode;
  status: Status;
  advanceSD: number;
  adjustableAmount: number;
  createdBy: string;
  modifiedBy: string;
}

const dummyRows: ListRow[] = [
  { id: 1, agreementType: 'Original', hubName: 'Baridhara Hub Office', city: 'Dhaka', hubAddress: '3rd Floor at AMAYA, House No-27, Road No-13, Baridhara, Dhaka-1212', areaSqft: 2984, rentPerSqft: 88, rentBdt: 250000, vat: 7500, tds: 5000, total: 262500, contractStart: '2025-08-01', contractEnd: '2030-07-31', tenure: '5 Years', paymentMode: 'Cash and Bank', noticePeriod: '3 Months', bankPayment: 45000, cashPayment: 205000, type: 'rent', status: 'Active', advanceSD: 500000, adjustableAmount: 50000, createdBy: 'Farzana Islam', modifiedBy: 'Mahmud' },
  { id: 2, agreementType: 'Renewal', hubName: 'Dhanmondi Hub', city: 'Dhaka', hubAddress: 'House 45, Road 7, Dhanmondi, Dhaka', areaSqft: 2200, rentPerSqft: 95, rentBdt: 209000, vat: 6270, tds: 4180, total: 219450, contractStart: '2024-01-01', contractEnd: '2027-12-31', tenure: '3 Years', paymentMode: 'Bank', noticePeriod: '2 Months', bankPayment: 209000, cashPayment: 0, type: 'rent', status: 'Notice', advanceSD: 418000, adjustableAmount: 41800, createdBy: 'Farzana Islam', modifiedBy: 'Mahmud' },
  { id: 3, agreementType: 'Original', hubName: 'GEC Hub', city: 'Chittagong', hubAddress: 'GEC Circle, Chittagong', areaSqft: 1800, rentPerSqft: 75, rentBdt: 135000, vat: 4050, tds: 2700, total: 141750, contractStart: '2024-06-01', contractEnd: '2029-05-31', tenure: '5 Years', paymentMode: 'Bank', noticePeriod: '3 Months', bankPayment: 135000, cashPayment: 0, type: 'lease', status: 'Active', advanceSD: 270000, adjustableAmount: 27000, createdBy: 'Farzana Islam', modifiedBy: 'Mahmud' },
  { id: 4, agreementType: 'Original', hubName: 'Zindabazar Hub', city: 'Sylhet', hubAddress: 'Zindabazar, Sylhet', areaSqft: 1500, rentPerSqft: 70, rentBdt: 105000, vat: 3150, tds: 2100, total: 110250, contractStart: '2024-03-01', contractEnd: '2027-02-28', tenure: '3 Years', paymentMode: 'Cash', noticePeriod: '2 Months', bankPayment: 0, cashPayment: 105000, type: 'rent', status: 'Closed', advanceSD: 210000, adjustableAmount: 0, createdBy: 'Farzana Islam', modifiedBy: 'Mahmud' },
  { id: 5, agreementType: 'Amendment', hubName: 'Shaheb Bazar Hub', city: 'Rajshahi', hubAddress: 'Shaheb Bazar, Rajshahi', areaSqft: 1300, rentPerSqft: 65, rentBdt: 84500, vat: 2535, tds: 1690, total: 88725, contractStart: '2025-01-01', contractEnd: '2028-12-31', tenure: '4 Years', paymentMode: 'Bank', noticePeriod: '2 Months', bankPayment: 84500, cashPayment: 0, type: 'both', status: 'Amendment', advanceSD: 169000, adjustableAmount: 16900, createdBy: 'Farzana Islam', modifiedBy: 'Mahmud' },
];

const fmt = (n: number) => n === 0 ? '-' : n.toLocaleString('en-US', { maximumFractionDigits: 0 });

const statusBadge = (s: Status) => {
  const map: Record<Status, string> = {
    Active: 'bg-green-600 text-white',
    Notice: 'bg-red-600 text-white',
    Closed: 'bg-black text-white',
    Amendment: 'bg-orange-500 text-white',
  };
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${map[s]}`}>{s}</span>;
};

const dummyNotifications = [
  { id: 1, title: 'Notice Period Starting', message: 'Dhanmondi Hub notice period starts on 2026-10-01 (2 Months notice).', time: '2h ago' },
  { id: 2, title: 'Notice Period Approaching', message: 'Baridhara Hub Office notice period begins on 2030-04-30 (3 Months notice).', time: '1d ago' },
  { id: 3, title: 'Agreement Renewal Due', message: 'Zindabazar Hub closes on 2027-02-28. Plan renewal.', time: '3d ago' },
];

export default function LeaseSetup() {
  const [view, setView] = useState<View>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [mode, setMode] = useState<Mode>('rent');
  const [f, setF] = useState<FormState>(empty);

  const set = (k: keyof FormState, v: string) => setF(s => ({ ...s, [k]: v }));

  const availableHubs = useMemo(() => {
    const src = selectedCities.length > 0 ? selectedCities : cities;
    return src.flatMap(c => hubsByCity[c] || []);
  }, [selectedCities]);

  const filteredRows = useMemo(() => dummyRows.filter(r => {
    const cityOk = selectedCities.length === 0 || selectedCities.includes(r.city);
    const hubOk = selectedHubs.length === 0 || selectedHubs.includes(r.hubName);
    const fromOk = !fromDate || r.contractStart >= fromDate;
    const toOk = !toDate || r.contractStart <= toDate;
    return cityOk && hubOk && fromOk && toOk;
  }), [selectedCities, selectedHubs, fromDate, toDate]);

  const handleSave = () => {
    if (!f.hubName || !f.rentBdt) {
      toast.error('Please fill Hub Name and Rent (BDT)');
      return;
    }
    toast.success(`${mode === 'rent' ? 'Rent' : mode === 'lease' ? 'Lease' : 'Lease & Rent'} record saved`);
    setF(empty);
    setView('list');
  };

  const handleCancel = () => { setF(empty); setView('list'); };

  const handleResetFilters = () => {
    setSelectedCities([]); setSelectedHubs([]); setFromDate(''); setToDate('');
  };

  const [amendments, setAmendments] = useState<AmendmentRow[]>([
    { id: 1, initialAmount: '', increaseBase: '', increasePct: '', startDate: '', endDate: '', leaseAmount: '', rentAmount: '' },
  ]);
  const addAmendment = () => setAmendments(a => [...a, { id: Date.now(), initialAmount: '', increaseBase: '', increasePct: '', startDate: '', endDate: '', leaseAmount: '', rentAmount: '' }]);
  const removeAmendment = (id: number) => setAmendments(a => a.length > 1 ? a.filter(x => x.id !== id) : a);
  const updateAmendment = (id: number, k: keyof AmendmentRow, v: string) =>
    setAmendments(a => a.map(x => x.id === id ? { ...x, [k]: v } : x));

  const handleDiscontinue = (r: ListRow) => {
    setF({ ...empty, hubName: r.hubName, hubAddress: r.hubAddress, agreementType: r.agreementType, areaSqft: String(r.areaSqft), rentPerSqft: String(r.rentPerSqft), rentBdt: String(r.rentBdt), vat: String(r.vat), tds: String(r.tds), total: String(r.total), contractStart: r.contractStart, contractEnd: r.contractEnd, tenure: r.tenure, paymentMode: r.paymentMode, noticePeriod: r.noticePeriod, bankPayment: String(r.bankPayment), cashPayment: String(r.cashPayment) });
    setMode(r.type);
    setView('form');
    toast.warning(`Loaded ${r.hubName} for discontinuation`);
  };

  const label = mode === 'rent' ? 'Rent' : mode === 'lease' ? 'Lease' : 'Lease/Rent';

  if (view === 'form') {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-[1400px] mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Lease / Rent Setup</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setView('list')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 p-4 border rounded-md bg-muted/30">
                <Label className="font-semibold">Type:</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="rent" id="m-rent" />
                    <Label htmlFor="m-rent">Rent</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="lease" id="m-lease" />
                    <Label htmlFor="m-lease">Lease</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="both" id="m-both" />
                    <Label htmlFor="m-both">Both</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Agreement & Hub</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Agreement Type</Label>
                    <Select value={f.agreementType} onValueChange={(v) => set('agreementType', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Original">Original</SelectItem>
                        <SelectItem value="Renewal">Renewal</SelectItem>
                        <SelectItem value="Amendment">Amendment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Lease/Rent Type</Label>
                    <Select value={f.leaseRentType} onValueChange={(v) => set('leaseRentType', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operating">Operating Lease</SelectItem>
                        <SelectItem value="Finance">Finance Lease</SelectItem>
                        <SelectItem value="Short-term">Short-term Rent</SelectItem>
                        <SelectItem value="Long-term">Long-term Rent</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Hub Name *</Label>
                    <Select value={f.hubName} onValueChange={(v) => { set('hubName', v); set('hubManager', hubManagers[v] || ''); }}>
                      <SelectTrigger><SelectValue placeholder="Select Hub" /></SelectTrigger>
                      <SelectContent>
                        {allHubs.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Hub Manager</Label><Input value={f.hubManager} readOnly className="bg-muted" /></div>
                  <div><Label>Hub Owner Name</Label><Input value={f.hubOwnerName} onChange={e => set('hubOwnerName', e.target.value)} /></div>
                  <div className="col-span-3"><Label>Hub Address</Label><Textarea rows={2} value={f.hubAddress} onChange={e => set('hubAddress', e.target.value)} /></div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Area & {label} Amount</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div><Label>Area (Sq. Ft)</Label><Input type="number" value={f.areaSqft} onChange={e => set('areaSqft', e.target.value)} /></div>
                  <div><Label>{label} per Sqft</Label><Input type="number" step="0.01" value={f.rentPerSqft} onChange={e => set('rentPerSqft', e.target.value)} /></div>
                  <div><Label>{label} (BDT) *</Label><Input type="number" value={f.rentBdt} onChange={e => set('rentBdt', e.target.value)} /></div>
                  <div><Label>VAT</Label><Input type="number" value={f.vat} onChange={e => set('vat', e.target.value)} /></div>
                  <div><Label>TDS</Label><Input type="number" value={f.tds} onChange={e => set('tds', e.target.value)} /></div>
                  <div><Label>Service Charge</Label><Input type="number" value={f.serviceCharge} onChange={e => set('serviceCharge', e.target.value)} /></div>
                  <div><Label>Utility Bill</Label><Input type="number" value={f.utilityBill} onChange={e => set('utilityBill', e.target.value)} /></div>
                  <div><Label>Total</Label><Input type="number" value={f.total} onChange={e => set('total', e.target.value)} /></div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Payment Details</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div><Label>Cash Payment</Label><Input type="number" value={f.cashPayment} onChange={e => set('cashPayment', e.target.value)} /></div>
                  <div><Label>Bank Payment</Label><Input type="number" value={f.bankPayment} onChange={e => set('bankPayment', e.target.value)} /></div>
                  <div><Label>Security Money</Label><Input type="number" value={f.securityMoney} onChange={e => set('securityMoney', e.target.value)} /></div>
                  <div><Label>Advance</Label><Input type="number" value={f.advance} onChange={e => set('advance', e.target.value)} /></div>
                  <div className="col-span-2"><Label>Advance Adjusted Amount and Month</Label><Input value={f.advanceAdjusted} onChange={e => set('advanceAdjusted', e.target.value)} /></div>
                  <div>
                    <Label>Payment Mode</Label>
                    <Select value={f.paymentMode} onValueChange={(v) => set('paymentMode', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank">Bank</SelectItem>
                        <SelectItem value="Cash and Bank">Cash and Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4"><Label>Bank Details</Label><Textarea rows={2} value={f.bankDetails} onChange={e => set('bankDetails', e.target.value)} /></div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Contract Period</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div><Label>Contract Start</Label><Input type="date" value={f.contractStart} onChange={e => set('contractStart', e.target.value)} /></div>
                  <div><Label>Contract End</Label><Input type="date" value={f.contractEnd} onChange={e => set('contractEnd', e.target.value)} /></div>
                  <div><Label>Tenure</Label><Input placeholder="e.g. 5 Years" value={f.tenure} onChange={e => set('tenure', e.target.value)} /></div>
                  <div><Label>Notice Period</Label><Input placeholder="e.g. 3 Months" value={f.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} /></div>
                  <div><Label>Notice Date</Label><Input type="date" value={f.noticeDate} onChange={e => set('noticeDate', e.target.value)} /></div>
                  <div><Label>Parking Space</Label><Input value={f.parkingSpace} onChange={e => set('parkingSpace', e.target.value)} /></div>
                </div>
              </div>

              <div>
                <Label>Remarks</Label>
                <Textarea rows={3} value={f.remarks} onChange={e => set('remarks', e.target.value)} />
              </div>


              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">Amendment</h3>
                  <Button size="sm" variant="outline" onClick={addAmendment}>
                    <Plus className="h-4 w-4 mr-1" /> Add Row
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <TableWithSearch className="text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="border w-12">SL</TableHead>
                        <TableHead className="border">Initial Amount</TableHead>
                        <TableHead className="border">Increase Base</TableHead>
                        <TableHead className="border">Increase %</TableHead>
                        <TableHead className="border">Start Date</TableHead>
                        <TableHead className="border">End Date</TableHead>
                        <TableHead className="border">Lease Amount</TableHead>
                        <TableHead className="border">Rent Amount</TableHead>
                        <TableHead className="border w-24 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {amendments.map((a, i) => (
                        <TableRow key={a.id}>
                          <TableCell className="border">{i + 1}</TableCell>
                          <TableCell className="border"><Input type="number" value={a.initialAmount} onChange={e => updateAmendment(a.id, 'initialAmount', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input value={a.increaseBase} onChange={e => updateAmendment(a.id, 'increaseBase', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input type="number" value={a.increasePct} onChange={e => updateAmendment(a.id, 'increasePct', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input type="date" value={a.startDate} onChange={e => updateAmendment(a.id, 'startDate', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input type="date" value={a.endDate} onChange={e => updateAmendment(a.id, 'endDate', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input type="number" value={a.leaseAmount} onChange={e => updateAmendment(a.id, 'leaseAmount', e.target.value)} /></TableCell>
                          <TableCell className="border"><Input type="number" value={a.rentAmount} onChange={e => updateAmendment(a.id, 'rentAmount', e.target.value)} /></TableCell>
                          <TableCell className="border">
                            <div className="flex justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={addAmendment}>
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeAmendment(a.id)} disabled={amendments.length === 1}>
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableWithSearch>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Lease / Rent Setup</CardTitle>
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative" title="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{dummyNotifications.length}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-3 border-b font-semibold text-sm">Notice Period Alerts</div>
                  <div className="max-h-80 overflow-y-auto">
                    {dummyNotifications.map(n => (
                      <div key={n.id} className="p-3 border-b hover:bg-muted/50">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{n.title}</p>
                          <span className="text-xs text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="icon"
                onClick={() => setShowFilters(s => !s)}
                title="Filter"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={() => setView('form')} title="Add New">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <Label>City</Label>
                  <MultiSelectDropdown
                    options={cities}
                    selected={selectedCities}
                    onChange={(v) => { setSelectedCities(v); setSelectedHubs([]); }}
                    placeholder="All Cities"
                  />
                </div>
                <div>
                  <Label>Hub</Label>
                  <MultiSelectDropdown
                    options={availableHubs}
                    selected={selectedHubs}
                    onChange={setSelectedHubs}
                    placeholder="All Hubs"
                  />
                </div>
                <div>
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset
                </Button>
                <Button size="sm">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          )}
          <CardContent>
            <div className="overflow-x-auto">
              <TableWithSearch className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border">SL</TableHead>
                    <TableHead className="border">Agreement Type</TableHead>
                    <TableHead className="border">Hub Name</TableHead>
                    <TableHead className="border">City</TableHead>
                    <TableHead className="border">Hub Address</TableHead>
                    <TableHead className="border text-right">Area (Sq.Ft)</TableHead>
                    <TableHead className="border text-right">Rent/Sqft</TableHead>
                    <TableHead className="border text-right">Rent (BDT)</TableHead>
                    <TableHead className="border text-right">VAT</TableHead>
                    <TableHead className="border text-right">TDS</TableHead>
                    <TableHead className="border text-right">Total</TableHead>
                    <TableHead className="border">Contract Start</TableHead>
                    <TableHead className="border">Contract End</TableHead>
                    <TableHead className="border">Tenure</TableHead>
                    <TableHead className="border">Payment Mode</TableHead>
                    <TableHead className="border">Notice Period</TableHead>
                    <TableHead className="border text-right">Bank Payment</TableHead>
                    <TableHead className="border text-right">Cash Payment</TableHead>
                    <TableHead className="border text-right">Advance / SD</TableHead>
                    <TableHead className="border text-right">Adjustable Amount</TableHead>
                    <TableHead className="border">Created / Modified By</TableHead>
                    <TableHead className="border text-center">Status</TableHead>
                    <TableHead className="border text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={23} className="border text-center text-muted-foreground py-8">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : filteredRows.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell className="border">{i + 1}</TableCell>
                      <TableCell className="border">{r.agreementType}</TableCell>
                      <TableCell className="border">{r.hubName}</TableCell>
                      <TableCell className="border">{r.city}</TableCell>
                      <TableCell className="border max-w-[220px]">{r.hubAddress}</TableCell>
                      <TableCell className="border text-right">{fmt(r.areaSqft)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.rentPerSqft)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.rentBdt)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.vat)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.tds)}</TableCell>
                      <TableCell className="border text-right font-semibold">{fmt(r.total)}</TableCell>
                      <TableCell className="border">{r.contractStart}</TableCell>
                      <TableCell className="border">{r.contractEnd}</TableCell>
                      <TableCell className="border">{r.tenure}</TableCell>
                      <TableCell className="border">{r.paymentMode}</TableCell>
                      <TableCell className="border">{r.noticePeriod}</TableCell>
                      <TableCell className="border text-right">{fmt(r.bankPayment)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.cashPayment)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.advanceSD)}</TableCell>
                      <TableCell className="border text-right">{fmt(r.adjustableAmount)}</TableCell>
                      <TableCell className="border text-xs whitespace-nowrap">
                        <div>Created: {r.createdBy}</div>
                        <div>Modified: {r.modifiedBy}</div>
                      </TableCell>
                      <TableCell className="border text-center">{statusBadge(r.status)}</TableCell>
                      <TableCell className="border">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setView('form'); toast.info('Edit ' + r.hubName); }} title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-600" onClick={() => handleDiscontinue(r)} title="Discontinue">
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => toast.success('Deleted ' + r.hubName)} title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
