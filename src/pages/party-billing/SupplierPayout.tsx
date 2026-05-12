import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Eye, CreditCard, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Row { id: number; statementNo: string; code: string; name: string; shop: string; opening: number; statement: number; paid: number; pre: number; closing: number; status: 'Pending' | 'Partially Paid' | 'Paid' | 'Adjusted'; cycle: string; }

const seed: Row[] = [
  { id: 1, statementNo: 'BAT-2604272123509065169', code: 'SLC00009688', name: 'Fahmida Islam', shop: 'Sugarblush', opening: 0, statement: 2778.42, paid: 2778.42, pre: 0, closing: 0, status: 'Paid', cycle: '20-Apr-2026 - 26-Apr-2026' },
  { id: 2, statementNo: 'BAT-2604272123566959854', code: 'SLC00009470', name: 'Khan Nazmul Islam', shop: 'Digital Pack', opening: 0, statement: -92, paid: 0, pre: 0, closing: -92, status: 'Pending', cycle: '20-Apr-2026 - 26-Apr-2026' },
  { id: 3, statementNo: 'BAT-2604272123509065170', code: 'SLC00009656', name: 'Fahmida Islam', shop: 'Lucky Dragon', opening: 0, statement: 1500, paid: 800, pre: 0, closing: 700, status: 'Partially Paid', cycle: '20-Apr-2026 - 26-Apr-2026' },
  { id: 4, statementNo: 'BAT-2604272123509065171', code: 'SLC00009704', name: 'Maksura Rahman', shop: 'Ki ki lagbe', opening: 100, statement: 950, paid: 950, pre: 0, closing: 100, status: 'Adjusted', cycle: '13-Apr-2026 - 19-Apr-2026' },
];

const statusBadge = (s: Row['status']) => {
  if (s === 'Paid') return 'default';
  if (s === 'Pending') return 'secondary';
  if (s === 'Partially Paid') return 'outline';
  return 'outline';
};

export default function SupplierPayout() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [method, setMethod] = useState<'Auto' | 'Manual'>('Auto');

  const filtered = seed.filter(r => {
    if (tab !== 'all' && r.status.toLowerCase().replace(' ', '-') !== tab) return false;
    if (search && !r.code.toLowerCase().includes(search.toLowerCase()) && !r.statementNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Home / Supplier Billing / <span className="text-primary font-medium">Supplier Payout</span> / List
        </nav>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Supplier Payout List</h2>
              <div className="inline-flex rounded-md border">
                <Button size="sm" variant={method === 'Auto' ? 'default' : 'ghost'} onClick={() => setMethod('Auto')}>Auto</Button>
                <Button size="sm" variant={method === 'Manual' ? 'default' : 'ghost'} onClick={() => setMethod('Manual')}>Manual</Button>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="partially-paid">Partially Paid</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="adjusted">Adjusted</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-2 mb-3 items-center">
              <Input type="date" className="w-44" />
              <Input type="date" className="w-44" />
              <Button variant="outline" size="sm">Search</Button>
              <div className="flex-1" />
              <Input placeholder="Search by Statement No, Supplier..." value={search} onChange={e => setSearch(e.target.value)} className="w-72" />
              <Button variant="outline" onClick={() => setSearch('')}>Reset</Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Button variant="outline" size="sm"><CreditCard className="h-4 w-4 mr-1" />Bulk Payment</Button>
              <Button variant="outline" size="sm">Payment History</Button>
              <Button variant="outline" size="sm">Bulk Export</Button>
              <Button variant="outline" size="sm">Export History</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-10"><Checkbox /></TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Statement No</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Shop Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Opening</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Statement Amt</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Paid</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Pre Pay</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Closing</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{r.statementNo}</TableCell>
                      <TableCell>{r.code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.shop}</TableCell>
                      <TableCell className="text-right">{r.opening.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{r.statement.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{r.paid.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{r.pre.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{r.closing.toFixed(2)}</TableCell>
                      <TableCell><Badge variant={statusBadge(r.status) as any}>{r.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" title="View" onClick={() => navigate(`/management/party-billing/supplier-payout/view/${r.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Pay" onClick={() => navigate(`/management/party-billing/supplier-payout/pay/${r.id}`)}>
                            <CreditCard className="h-4 w-4" />
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