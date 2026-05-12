import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Plus, Trash2, RotateCcw, Settings, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'number' | 'select' | 'bool';
interface Field {
  key: string;
  label: string;
  type: FieldType;
  value: string;
  options?: string[];
  description?: string;
}
interface Group { title: string; fields: Field[] }
interface Section { id: string; name: string; groups?: Group[]; custom?: 'voucherNumber' }

const yesNo = ['Yes', 'No'];
const trueFalse = ['true', 'false'];

const initialSections: Section[] = [
  {
    id: 'general', name: '1. General',
    groups: [
      { title: 'Company Basic Info', fields: [
        { key: 'companyName', label: 'Company Name', type: 'text', value: 'Al-Arafah Islami Bank' },
        { key: 'companyAddress', label: 'Company Address', type: 'text', value: 'House 40/C, Road No 11 (new)' },
      ]},
      { title: 'Currency', fields: [
        { key: 'defaultCurrency', label: 'Default Currency', type: 'select', value: 'BDT', options: ['BDT', 'USD', 'EUR', 'GBP', 'INR'] },
      ]},
    ],
  },
  {
    id: 'account', name: '2. Account',
    groups: [
      { title: 'Account Settings', fields: [
        { key: 'level', label: 'Level', type: 'select', value: 'All', options: ['All', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'] },
        { key: 'childDepth', label: 'Child Depth (Space)', type: 'number', value: '4' },
        { key: 'uniqAccCode', label: 'Unique Account Code', type: 'select', value: 'true', options: trueFalse },
        { key: 'uniqAccName', label: 'Unique Account Name', type: 'select', value: 'true', options: trueFalse },
        { key: 'shortTermLiab', label: 'Short Term Liabilities Tag With Bank', type: 'select', value: 'true', options: trueFalse },
        { key: 'accApproval', label: 'Account Approval', type: 'select', value: 'No', options: yesNo },
        { key: 'accComboLimit', label: 'Account Combo Limit', type: 'number', value: '500' },
        { key: 'accComboFormat', label: 'Account Combo Format', type: 'text', value: '{number}-{name}' },
        { key: 'chartViewPage', label: 'Chart View Page', type: 'select', value: 'Chart With Grid', options: ['Chart With Grid', 'Chart Only', 'Grid Only'] },
        { key: 'pageLimit', label: 'Page Limit', type: 'number', value: '100' },
        { key: 'accSortingOrder', label: 'Account Sorting Order', type: 'text', value: '' },
        { key: 'transactionDate', label: 'Transaction Date', type: 'select', value: 'Creation Date', options: ['Creation Date', 'Posting Date', 'Effective Date'] },
        { key: 'sortAccLedgers', label: 'Sort Account Ledgers', type: 'select', value: 'Yes', options: yesNo },
      ]},
      { title: 'Default Accounts', fields: [
        { key: 'retainedEarning', label: 'Retained Earning', type: 'text', value: '302-df-Retained Earning' },
        { key: 'depExpense', label: 'Depreciation Expence', type: 'text', value: '509-df-Depreciation Expense' },
        { key: 'salaryExpense', label: 'Salary Expence Acc', type: 'text', value: '501-df-Salary Expense' },
        { key: 'accumDep', label: 'Accumu Depreciation', type: 'text', value: '150-df-Accumulated Deprec' },
        { key: 'payrollPayable', label: 'Payroll Payble Acc', type: 'text', value: '506-df-Payroll Account Payable' },
        { key: 'payrollRefPayable', label: 'Payroll Ref. Payable', type: 'text', value: '507-df-Payroll Refund Account', description: 'Payroll Refund Payable' },
        { key: 'unearnedInt', label: 'Unearned Int.Income', type: 'text', value: '206-df-Unearned Revenue' },
        { key: 'loanFromSH', label: 'Loan From SH', type: 'text', value: '110-df-Loan From Share Holder', description: 'Loan from Share Holder' },
        { key: 'loanToSH', label: 'Loan To Shareholder', type: 'text', value: '110-df-Loan To ShareHolder' },
        { key: 'discount', label: 'Discount', type: 'text', value: '402-df-Discount Earned' },
        { key: 'promoDisGain', label: 'Promo. Dis. Gain', type: 'text', value: '145-df-Promotional Discount', description: 'Promotional Discount Gain' },
        { key: 'discountGain', label: 'Discount Gain', type: 'text', value: '402-df-Discount Earned' },
        { key: 'capital', label: 'Capital', type: 'text', value: '301-df-Capital' },
        { key: 'reconcDisc', label: 'Reconc. Disc.', type: 'text', value: '510-df-Reconciliation Discrepancies', description: 'Reconciliation Discrepancies' },
        { key: 'workInProcess', label: 'Work in Process', type: 'text', value: '13905-Work In Process' },
        { key: 'costCenterMandatory', label: 'Cost Center Mandatory?', type: 'select', value: 'No', options: yesNo },
        { key: 'vat', label: 'VAT', type: 'text', value: '13100-003-Advance VAT Local' },
        { key: 'vatPayable', label: 'VAT Payable', type: 'text', value: '' },
        { key: 'vatReceivable', label: 'VAT Receivable', type: 'text', value: '' },
        { key: 'vatDeposit', label: 'VAT Deposit', type: 'text', value: '' },
        { key: 'ait', label: 'AIT', type: 'text', value: '280-df-Advance Income Tax' },
        { key: 'aitPayable', label: 'AIT Payable', type: 'text', value: '208-df-Tax Payable' },
        { key: 'vatRebate', label: 'VAT Advance(Rebate)', type: 'text', value: '13313-VAT Rebate account' },
        { key: 'commPayable', label: 'Commission Payable', type: 'text', value: '20800-Account Payable(Sup)' },
        { key: 'bankCharge', label: 'Bank Charge', type: 'text', value: '503-df-Expense' },
        { key: 'bankAccount', label: 'Bank Account', type: 'text', value: '' },
        { key: 'fundInTransit', label: 'Fund In Transit', type: 'text', value: '13002-010-Fund In Transit' },
        { key: 'interBranchAdj', label: 'Inter Branch Acc Adjustment', type: 'text', value: '' },
      ]},
      { title: 'Branch / Cash / Bank Control', fields: [
        { key: 'branchWiseCashBank', label: 'Branch Wise Cash/Bank Account', type: 'select', value: 'Yes', options: yesNo },
        { key: 'cashAccCtrl', label: 'Cash Account Control', type: 'select', value: 'All Branches', options: ['All Branches', 'Own Branch', 'Selected Branches'], description: 'This config item will be used only for cash accounts' },
        { key: 'bankAccCtrl', label: 'Bank Account Control', type: 'select', value: 'All Branches', options: ['All Branches', 'Own Branch', 'Selected Branches'] },
      ]},
    ],
  },
  {
    id: 'multicurrency', name: '3. Multi Currency',
    groups: [
      { title: 'Basic Settings', fields: [
        { key: 'mcVoucher', label: 'Voucher', type: 'select', value: 'Yes', options: yesNo },
        { key: 'mcAccount', label: 'Account', type: 'select', value: 'No', options: yesNo },
        { key: 'mcParty', label: 'Party', type: 'select', value: 'No', options: yesNo },
      ]},
    ],
  },
  {
    id: 'voucher', name: '4. Voucher',
    groups: [
      { title: 'General Voucher Settings', fields: [
        { key: 'sameUserCannotApprove', label: 'Same User Cannot Approve Vouchers', type: 'select', value: 'false', options: trueFalse, description: 'Same User Cannot Approve Vouchers' },
        { key: 'tagLedgers', label: 'Tag Ledgers', type: 'select', value: 'false', options: trueFalse, description: 'Tag Ledgers' },
        { key: 'searchByDescription', label: 'Search by Description', type: 'select', value: 'true', options: trueFalse, description: 'Search by Description' },
        { key: 'searchByCreatedBy', label: 'Search by Created By', type: 'select', value: 'true', options: trueFalse, description: 'Search by Created By' },
      ]},
    ],
  },
  { id: 'voucherNumber', name: '5. Voucher Number', custom: 'voucherNumber' },
  {
    id: 'party', name: '6. Party',
    groups: [
      { title: 'Party Combo Service Settings', fields: [
        { key: 'partyComboFormat', label: 'Combo Service Format', type: 'text', value: '{full_name}-{code}', description: '*format pattern: {full_name}-{code}-{mobile}' },
      ]},
    ],
  },
  {
    id: 'customer', name: '7. Customer',
    groups: [
      { title: 'Customer Settings', fields: [
        { key: 'creditDays', label: 'Credit Days', type: 'select', value: 'false', options: trueFalse },
        { key: 'creditLimit', label: 'Credit Limit', type: 'select', value: 'false', options: trueFalse },
      ]},
    ],
  },
  {
    id: 'vendor', name: '8. Vendor',
    groups: [
      { title: 'Vendor Combo Service Settings', fields: [
        { key: 'vendorComboFormat', label: 'Combo Service Format', type: 'text', value: '{full_name}-{code}-{pin_number}', description: '*format pattern: {full_name}-{code}-{pin_number}' },
      ]},
    ],
  },
  { id: 'delivery', name: '9. Delivery', groups: [{ title: 'Delivery Settings', fields: [] }] },
  { id: 'purchaseInvoice', name: '10. Purchase Invoice', groups: [{ title: 'Purchase Invoice Settings', fields: [] }] },
  { id: 'procurement', name: '11. Procurement', groups: [{ title: 'Procurement Settings', fields: [] }] },
  {
    id: 'asset', name: '12. Asset',
    groups: [
      { title: 'Asset Assignment Confirmation', fields: [
        { key: 'assignConfByEmp', label: 'Assignment Confirmation By Employee', type: 'select', value: 'No', options: yesNo },
        { key: 'depFreq', label: 'Asset Depreciation Frequency', type: 'select', value: 'Monthly', options: ['Daily', 'Monthly', 'Quarterly', 'Yearly'] },
        { key: 'depCalcMethod', label: 'Asset Depreciation Calc. Method', type: 'select', value: 'Pro Rata', options: ['Pro Rata', 'Full Month', 'Half Year'] },
        { key: 'assetSerialType', label: 'Asset Serial Type', type: 'select', value: 'Manual', options: ['Manual', 'Auto'] },
        { key: 'depPolicy', label: 'Asset Depreciation Policy', type: 'select', value: 'Straight Line', options: ['Straight Line', 'Declining Balance', 'Sum of Years', 'Units of Production'] },
        { key: 'branchwiseTransfer', label: 'Branchwise Asset Transfer', type: 'select', value: 'No', options: yesNo },
        { key: 'fixAssetHasLoc', label: 'FixAsset HasLocation', type: 'select', value: 'No', options: yesNo },
        { key: 'assignWithICA', label: 'Assignment With ICA', type: 'select', value: 'No', options: yesNo },
        { key: 'userAutoNum', label: 'User Autogenerated Number', type: 'select', value: 'No', options: yesNo },
      ]},
    ],
  },
];

const initialVoucherFormats: { id: string; label: string; value: string }[] = [
  { id: 'acn', label: 'Account Credit Note', value: 'ACN-{seq:1000}' },
  { id: 'adn', label: 'Account Debit Note', value: 'ADN-{seq:1000}' },
  { id: 'arv', label: 'Advance Receive Voucher', value: 'ARV-{seq:1000}' },
  { id: 'asp', label: 'Advanced Salary Payment', value: 'ASP-{seq:1000}' },
  { id: 'po', label: 'Aluminium Purchase Order', value: 'PO-{seq:1000}' },
  { id: 'aaq', label: 'Asset Acquisition', value: 'AAQ-{seq:1000}' },
  { id: 'adv', label: 'Asset Disposal: Asset Disposal', value: 'ADV-{seq:1000}' },
  { id: 'aev', label: 'Asset Expenditure', value: 'AEV-{seq:1000}' },
  { id: 'aev2', label: 'Asset Expenditure: Asset Expenditure', value: 'AEV-{seq:1000}' },
  { id: 'apd', label: 'Asset Purchase Delivery', value: 'APD-{seq:1000}' },
  { id: 'asd', label: 'Asset Sale', value: 'ASD-{seq:1000}' },
  { id: 'bic', label: 'Billet Consumption', value: 'BIC-{seq:1000}' },
  { id: 'bpd', label: 'Billet Production Delivery', value: 'BPD-{seq:1000}' },
  { id: 'blpv', label: 'Business Loan Payment Voucher', value: 'BLPV-{seq:1000}' },
  { id: 'blrv', label: 'Business Loan Receive Voucher', value: 'BLRV-{seq:1000}' },
  { id: 'cnf', label: 'Cnfbill', value: 'CNF-BILL-{seq:1000}' },
  { id: 'eq', label: 'Capital', value: 'EQ-{seq:1000}' },
];

const STORAGE_KEY = 'app-config-v1';

export default function Config() {
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sections) return parsed.sections;
      }
    } catch {}
    return initialSections;
  });
  const [vouchers, setVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.vouchers) return parsed.vouchers;
      }
    } catch {}
    return initialVoucherFormats;
  });
  const [activeId, setActiveId] = useState('general');
  const active = useMemo(() => sections.find(s => s.id === activeId)!, [sections, activeId]);

  const updateField = (groupIdx: number, key: string, value: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== activeId || !s.groups) return s;
      const groups = s.groups.map((g, i) => i !== groupIdx ? g : ({
        ...g, fields: g.fields.map(f => f.key === key ? { ...f, value } : f),
      }));
      return { ...s, groups };
    }));
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sections, vouchers }));
    toast.success(`${active.name.replace(/^\d+\.\s*/, '')} settings saved`);
  };

  const resetVouchers = () => {
    setVouchers(initialVoucherFormats);
    toast.info('Voucher number formats reset to defaults');
  };

  const addVoucher = () => {
    setVouchers((p: typeof initialVoucherFormats) => [...p, { id: Date.now().toString(), label: 'New Voucher Type', value: 'NEW-{seq:1000}' }]);
  };

  const updateVoucher = (id: string, key: 'label' | 'value', val: string) => {
    setVouchers((p: typeof initialVoucherFormats) => p.map(v => v.id === id ? { ...v, [key]: val } : v));
  };

  const removeVoucher = (id: string) => {
    setVouchers((p: typeof initialVoucherFormats) => p.filter(v => v.id !== id));
  };

  const renderField = (f: Field, groupIdx: number) => {
    if (f.type === 'select' && f.options) {
      return (
        <Select value={f.value || undefined} onValueChange={v => updateField(groupIdx, f.key, v)}>
          <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent className="bg-popover z-[9999]">
            {f.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      );
    }
    return (
      <Input
        type={f.type === 'number' ? 'number' : 'text'}
        value={f.value}
        onChange={e => updateField(groupIdx, f.key, e.target.value)}
        className="h-9"
      />
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                System Configuration
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                  <Shield className="h-3 w-3" /> Super Admin
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">Hidden control panel — accessible only via /config URL</p>
            </div>
          </div>
          <Button onClick={save} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r bg-card min-h-[calc(100vh-65px)] p-3 sticky top-[65px] self-start">
          <nav className="space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  'w-full text-left text-sm px-3 py-2 rounded-md transition-colors',
                  activeId === s.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground',
                )}
              >
                {s.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 space-y-6 max-w-6xl">
          {active.custom === 'voucherNumber' ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-primary">Voucher Number Formats</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetVouchers} className="gap-2">
                    <RotateCcw className="h-3.5 w-3.5" /> Reset
                  </Button>
                  <Button size="sm" onClick={addVoucher} className="gap-2">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted/50 p-4 text-xs space-y-1.5">
                  <div className="font-semibold mb-1">Format Options:</div>
                  <div><code className="font-mono">{'{y}'}</code>: 4 digits year. Exp: 2017</div>
                  <div><code className="font-mono">{'{m}'}</code>: 2 digits month. Exp: 08</div>
                  <div><code className="font-mono">{'{d}'}</code>: 2 digits day. Exp: 03</div>
                  <div><code className="font-mono">{'{branch[name]}'}</code>: Branch Name. Exp Usage: <code>{'{branch[name]:.5}'}</code> takes first 5 chars.</div>
                  <div><code className="font-mono">{'{branch[code]}'}</code>: Branch Code. Exp Usage: <code>{'{branch[code]:.3}'}</code> takes first 3 chars.</div>
                  <div><code className="font-mono">{'{seq:0001}'}</code>: Sequential number starting from 0001. Ex: 0045</div>
                  <div><code className="font-mono">{'{rand}'}</code>: a random number. Ex: 5645</div>
                  <div><code className="font-mono">{'{rand:0010-9999}'}</code>: a random number between 0010 and 9999. Ex: 0058</div>
                  <div className="pt-1 text-muted-foreground">• You may delete items those you don't use. Deleting will fall back to default format. • Use Reset to restore all formats.</div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60">
                        <TableHead className="w-12">SL</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-20 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchers.map((v: typeof initialVoucherFormats[number], i: number) => (
                        <TableRow key={v.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            <Input value={v.label} onChange={e => updateVoucher(v.id, 'label', e.target.value)} className="h-9" />
                          </TableCell>
                          <TableCell>
                            <Input value={v.value} onChange={e => updateVoucher(v.id, 'value', e.target.value)} className="h-9 font-mono text-xs" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeVoucher(v.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            active.groups?.map((g, gi) => (
              <Card key={gi}>
                <CardHeader>
                  <CardTitle className="text-primary text-base">{g.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {g.fields.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-6 text-center border-2 border-dashed rounded-md">
                      No configurable items defined yet for this section.
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/60">
                            <TableHead className="w-1/3">Label</TableHead>
                            <TableHead className="w-1/3">Value</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {g.fields.map(f => (
                            <TableRow key={f.key}>
                              <TableCell className="font-medium text-sm">{f.label}</TableCell>
                              <TableCell>{renderField(f, gi)}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{f.description || ''}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={save} size="lg" className="gap-2">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
