import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowLeft, Pencil, Eye, Download, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Rule {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleType: 'Depreciation' | 'Amortization';
  assetCategory: string;
  method: string;
  rate: number;
  usefulLife: string;
  residualValue: string;
  fiscalYear: string;
  status: 'Active' | 'Inactive';
}

const defaultRules: Rule[] = [
  { id: '1', ruleId: 'DEP-001', ruleName: 'SLM Laptop Depreciation', ruleType: 'Depreciation', assetCategory: 'IT Equipment', method: 'SLM', rate: 25, usefulLife: '4 Years', residualValue: '5%', fiscalYear: 'FY 2024-25', status: 'Active' },
  { id: '2', ruleId: 'DEP-002', ruleName: 'WDV Vehicle Depreciation', ruleType: 'Depreciation', assetCategory: 'Vehicles', method: 'WDV', rate: 15, usefulLife: '8 Years', residualValue: '10%', fiscalYear: 'FY 2024-25', status: 'Active' },
  { id: '3', ruleId: 'AMR-001', ruleName: 'Software Amortization', ruleType: 'Amortization', assetCategory: 'Intangible Assets', method: 'Straight Line', rate: 0, usefulLife: '36 Months', residualValue: '0', fiscalYear: 'FY 2024-25', status: 'Active' },
];

const formulaByMethod: Record<string, { formula: string; fields: string[] }> = {
  slm: { formula: '(Cost − Residual Value) ÷ Useful Life', fields: ['Useful Life', 'Residual Value'] },
  wdv: { formula: 'Book Value × Depreciation Rate %', fields: ['Depreciation Rate', 'Useful Life'] },
  uop: { formula: '((Cost − Residual) ÷ Total Units) × Units Used', fields: ['Total Units', 'Residual Value'] },
  ddb: { formula: '2 × (1 ÷ Useful Life) × Book Value', fields: ['Useful Life'] },
  custom: { formula: 'Custom formula provided by user', fields: ['Formula Expression'] },
  sl: { formula: '(Cost − Residual) ÷ Amortization Period', fields: ['Amortization Period', 'Residual Value'] },
};

export default function ValueAdjustmentRules() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeTab, setActiveTab] = useState('depreciation');
  const [rules] = useState<Rule[]>(defaultRules);
  const [depMethod, setDepMethod] = useState('slm');
  const [amrMethod, setAmrMethod] = useState('sl');

  const handleSave = () => { toast.success('Rule saved successfully'); setView('list'); };

  const renderMethodFields = (method: string) => {
    const cfg = formulaByMethod[method];
    if (!cfg) return null;
    return (
      <div className="rounded-md border bg-muted/30 p-3 space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <Info size={14} className="mt-0.5 text-primary" />
          <div>
            <div className="font-medium">Calculation Formula</div>
            <div className="font-mono text-xs text-muted-foreground mt-1">{cfg.formula}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cfg.fields.map(f => (
            <div key={f}>
              <Label className="text-xs">{f} *</Label>
              <Input placeholder={`Enter ${f}`} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Depreciation Rules</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Create</Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Rule ID</TableHead>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Rule Type</TableHead>
                    <TableHead>Asset Group</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Rate / Life</TableHead>
                    <TableHead>Fiscal Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule, i) => (
                    <TableRow key={rule.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono">{rule.ruleId}</TableCell>
                      <TableCell>{rule.ruleName}</TableCell>
                      <TableCell><Badge variant={rule.ruleType === 'Depreciation' ? 'default' : 'secondary'}>{rule.ruleType}</Badge></TableCell>
                      <TableCell>{rule.assetCategory}</TableCell>
                      <TableCell>{rule.method}</TableCell>
                      <TableCell>{rule.rate > 0 ? `${rule.rate}%` : rule.usefulLife}</TableCell>
                      <TableCell>{rule.fiscalYear}</TableCell>
                      <TableCell><Badge variant={rule.status === 'Active' ? 'default' : 'secondary'}>{rule.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Pencil size={14} /></Button>
                          <Button variant="ghost" size="icon"><Eye size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Create Adjustment Rule</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList><TabsTrigger value="depreciation">Depreciation</TabsTrigger><TabsTrigger value="amortization">Amortization</TabsTrigger></TabsList>
            <TabsContent value="depreciation">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Rule Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Rule ID</Label><Input disabled placeholder="Auto-generated" /></div>
                    <div><Label>Rule Name *</Label><Input placeholder="e.g. SLM Laptop Depreciation" /></div>
                    <div><Label>Asset Group *</Label><Select><SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger><SelectContent><SelectItem value="it">IT Equipment</SelectItem><SelectItem value="furniture">Furniture</SelectItem><SelectItem value="vehicle">Vehicles</SelectItem></SelectContent></Select></div>
                    <div><Label>Fiscal Year *</Label><Select defaultValue="2024-25"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2023-24">FY 2023-24</SelectItem><SelectItem value="2024-25">FY 2024-25</SelectItem><SelectItem value="2025-26">FY 2025-26</SelectItem></SelectContent></Select></div>
                    <p className="text-xs text-muted-foreground">Effective date is automatically taken from the asset registration date.</p>
                    <div className="flex items-center gap-2"><Label>Active</Label><Switch defaultChecked /></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Accounting Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Depreciation Expense Account *</Label><Input placeholder="GL Lookup" /></div>
                    <div><Label>Accumulated Depreciation Account *</Label><Input placeholder="GL Lookup" /></div>
                    <div><Label>Gain/Loss Account *</Label><Input placeholder="GL Lookup" /></div>
                    <div><Label>Posting Type *</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="auto">Auto</SelectItem><SelectItem value="manual">Manual</SelectItem></SelectContent></Select></div>
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader><CardTitle className="text-base">Depreciation Method</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Method *</Label>
                        <Select value={depMethod} onValueChange={setDepMethod}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slm">Straight Line Method (SLM)</SelectItem>
                            <SelectItem value="wdv">Written Down Value (WDV)</SelectItem>
                            <SelectItem value="ddb">Double Declining Balance</SelectItem>
                            <SelectItem value="uop">Units of Production</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {renderMethodFields(depMethod)}
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 mt-6"><Button onClick={handleSave}>Submit</Button><Button variant="outline">Clear</Button></div>
            </TabsContent>
            <TabsContent value="amortization">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Amortization Rule Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Rule Name *</Label><Input /></div>
                    <div><Label>Asset Group *</Label><Select><SelectTrigger><SelectValue placeholder="Intangible Assets only" /></SelectTrigger><SelectContent><SelectItem value="intangible">Intangible Assets</SelectItem></SelectContent></Select></div>
                    <div><Label>Fiscal Year *</Label><Select defaultValue="2024-25"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2023-24">FY 2023-24</SelectItem><SelectItem value="2024-25">FY 2024-25</SelectItem><SelectItem value="2025-26">FY 2025-26</SelectItem></SelectContent></Select></div>
                    <p className="text-xs text-muted-foreground">Effective date is automatically taken from the asset registration date.</p>
                    <div className="flex items-center gap-2"><Label>Active</Label><Switch defaultChecked /></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Accounting Setup</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Amortization Expense Account *</Label><Input placeholder="GL Lookup" /></div>
                    <div><Label>Accumulated Amortization Account *</Label><Input placeholder="GL Lookup" /></div>
                    <div><Label>Posting Type</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="auto">Auto</SelectItem><SelectItem value="manual">Manual</SelectItem></SelectContent></Select></div>
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader><CardTitle className="text-base">Amortization Method</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Method *</Label>
                        <Select value={amrMethod} onValueChange={setAmrMethod}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sl">Straight Line</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {renderMethodFields(amrMethod)}
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 mt-6"><Button onClick={handleSave}>Submit</Button><Button variant="outline">Clear</Button></div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
}
