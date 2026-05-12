import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Printer, FileSpreadsheet, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranchFilter } from '@/components/ReportBranchFilter';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Input } from '@/components/ui/input';

interface Row {
  sl: number; docNo: string; docType: string; particular: string; bookingCode: string;
  refCode: string; entryDate: string; postingDate: string; docDate: string; amount: number; source: string;
}
const dummy: Row[] = [
  { sl: 1, docNo: 'BP-25-26-14005029', docType: 'Bank Payment (BP)', particular: 'Brac Bank A/C: 2052735250001', bookingCode: 'BK-001', refCode: 'S49606478', entryDate: '01-Apr-2026', postingDate: '01-Apr-2026', docDate: '01-Apr-2026', amount: 57500.00, source: 'Manual' },
  { sl: 2, docNo: 'BR-25-26-15001102', docType: 'Bank Receipt (BR)', particular: 'City Bank A/C: 1254009112001', bookingCode: 'BK-002', refCode: 'NPSB-887', entryDate: '02-Apr-2026', postingDate: '02-Apr-2026', docDate: '02-Apr-2026', amount: 32300.00, source: 'CSV' },
  { sl: 3, docNo: 'JV-25-26-12000044', docType: 'Journal Voucher (JV)', particular: 'Salary Provision - April', bookingCode: '-', refCode: 'JV-APR-01', entryDate: '03-Apr-2026', postingDate: '03-Apr-2026', docDate: '03-Apr-2026', amount: 1500000.00, source: 'Manual' },
  { sl: 4, docNo: 'CP-25-26-11000088', docType: 'Cash Payment (CP)', particular: 'Office Supplies', bookingCode: '-', refCode: 'CP-APR-04', entryDate: '04-Apr-2026', postingDate: '04-Apr-2026', docDate: '04-Apr-2026', amount: 12500.00, source: 'Manual' },
  { sl: 5, docNo: 'BP-25-26-14005030', docType: 'Bank Payment (BP)', particular: 'Vendor Payment - KB Pharma', bookingCode: 'BK-005', refCode: 'S49606512', entryDate: '05-Apr-2026', postingDate: '05-Apr-2026', docDate: '05-Apr-2026', amount: 245000.00, source: 'Manual' },
];

const TransactionReport = () => {
  const { filterBranchCodes } = useBranchFilter();
  const [voucherNo, setVoucherNo] = useState('');
  const [voucherType, setVoucherType] = useState('');
  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 3, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2026, 3, 28));
  const [sbu, setSbu] = useState(''); const [city, setCity] = useState(''); const [hub, setHub] = useState('');
  const [department, setDepartment] = useState(''); const [postingStatus, setPostingStatus] = useState(''); const [user, setUser] = useState('');
  const [refCode, setRefCode] = useState(''); const [narration, setNarration] = useState('');
  const [dataSource, setDataSource] = useState(''); const [orderId, setOrderId] = useState('');
  const [gatewayId, setGatewayId] = useState(''); const [batchNo, setBatchNo] = useState('');
  const [showReport, setShowReport] = useState(false);

  const clear = () => {
    setVoucherNo(''); setVoucherType(''); setSbu(''); setCity(''); setHub('');
    setDepartment(''); setPostingStatus(''); setUser(''); setRefCode(''); setNarration('');
    setDataSource(''); setOrderId(''); setGatewayId(''); setBatchNo(''); setShowReport(false);
  };

  const DateField = ({ value, onChange, label }: { value: Date; onChange: (d: Date) => void; label: string }) => (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd MMM yyyy") : "Select"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={(d) => d && onChange(d)} initialFocus className="pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );

  const Sel = ({ label, value, onChange, placeholder = '--- Select ---', options }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; options?: string[] }) => (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {(options || ['Option 1', 'Option 2']).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
  const Txt = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">{label}</Label>
      <Input className="h-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Reports</span> / Transaction Report
        </nav>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Transaction Report Filters</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Txt label="Voucher No." value={voucherNo} onChange={setVoucherNo} placeholder="Enter Document No." />
              <Sel label="Voucher Type" value={voucherType} onChange={setVoucherType} placeholder="All are selected" options={['Bank Payment (BP)', 'Bank Receipt (BR)', 'Journal Voucher (JV)', 'Cash Payment (CP)']} />
              <DateField label="From Date" value={fromDate} onChange={setFromDate} />
              <DateField label="To Date" value={toDate} onChange={setToDate} />
              <Sel label="SBU" value={sbu} onChange={setSbu} options={['SBU 1', 'SBU 2']} />
              <Sel label="City" value={city} onChange={setCity} options={['Dhaka', 'Chittagong']} />
              <Sel label="Hub" value={hub} onChange={setHub} options={['Hub A', 'Hub B']} />
              <Sel label="Department" value={department} onChange={setDepartment} options={['Finance', 'Operations']} />
              <Sel label="Posting Status" value={postingStatus} onChange={setPostingStatus} options={['Posted', 'Unposted']} />
              <Sel label="User" value={user} onChange={setUser} options={['Foodi Admin', 'M. Hasan']} />
              <Txt label="Reference Code" value={refCode} onChange={setRefCode} placeholder="Enter Reference Code" />
              <Txt label="Narration" value={narration} onChange={setNarration} placeholder="Enter Narration" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-primary">Other Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Sel label="Data Source" value={dataSource} onChange={setDataSource} options={['Manual', 'CSV']} />
                <Txt label="Order ID" value={orderId} onChange={setOrderId} placeholder="Enter Booking Code" />
                <Txt label="Gateway Tracking ID" value={gatewayId} onChange={setGatewayId} placeholder="Enter ID" />
                <Txt label="Batch Number" value={batchNo} onChange={setBatchNo} placeholder="Enter Code" />
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="destructive" onClick={clear}>Clear</Button>
              <Button onClick={() => setShowReport(true)}>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Transaction Report</CardTitle>
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="icon" className="bg-success text-success-foreground"><FileSpreadsheet className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
              <Select defaultValue="per-page"><SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="per-page">One report per page</SelectItem><SelectItem value="all">All in one page</SelectItem></SelectContent></Select>
            </div>
          </CardHeader>
          <CardContent>
            {!showReport ? (
              <div className="text-center py-10 text-muted-foreground">Click "Generate Report" to view the transaction report</div>
            ) : (
              <div className="rounded-md border overflow-hidden overflow-x-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Document Number</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Document Type</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Particular</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Booking Code</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Reference Code</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Entry Date</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Posting Date</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Document Date</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold text-right">Transaction Amount</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Data Source</TableHead>
                      <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummy.map((r, i) => (
                      <TableRow key={r.sl} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                        <TableCell>{r.sl}</TableCell>
                        <TableCell className="font-medium">{r.docNo}</TableCell>
                        <TableCell>{r.docType}</TableCell>
                        <TableCell>{r.particular}</TableCell>
                        <TableCell>{r.bookingCode}</TableCell>
                        <TableCell>{r.refCode}</TableCell>
                        <TableCell>{r.entryDate}</TableCell>
                        <TableCell>{r.postingDate}</TableCell>
                        <TableCell>{r.docDate}</TableCell>
                        <TableCell className="text-right">{r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{r.source}</TableCell>
                        <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionReport;
