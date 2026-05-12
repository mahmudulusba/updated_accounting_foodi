import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search } from 'lucide-react';

const scheduleData = [
  { particulars: 'Land & Land Dev.', costOpening: 787034317, costAddition: 516055344, costDisposal: 0, costClosing: 1303089661, depRate: '-', depOpening: 0, depCharged: 0, depDisposal: 0, depClosing: 0, wdv: 1303089661 },
  { particulars: 'Building', costOpening: 14118070580, costAddition: 7801245, costDisposal: 0, costClosing: 14125871825, depRate: '2.50%', depOpening: 3109036131, depCharged: 275420892, depDisposal: 0, depClosing: 3384457023, wdv: 10741414801 },
  { particulars: 'Office Equipment', costOpening: 693947197, costAddition: 17865061, costDisposal: 0, costClosing: 711812258, depRate: '20.00%', depOpening: 288313007, depCharged: 84699850, depDisposal: 0, depClosing: 373012857, wdv: 338799400 },
  { particulars: 'Furniture & Fixture', costOpening: 839215013, costAddition: 400605943, costDisposal: 0, costClosing: 1239820956, depRate: '5.00%', depOpening: 381935891, depCharged: 42894253, depDisposal: 0, depClosing: 424830144, wdv: 814990811 },
  { particulars: 'Vehicles', costOpening: 580222837, costAddition: 87660965, costDisposal: 0, costClosing: 667883802, depRate: '10.00%', depOpening: 357788322, depCharged: 31009548, depDisposal: 0, depClosing: 388797870, wdv: 279085932 },
];

export default function AssetScheduleReport() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Schedule Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filtering Criteria</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fiscal Year *</Label><Select><SelectTrigger><SelectValue placeholder="Select Fiscal Year" /></SelectTrigger><SelectContent><SelectItem value="2024-25">2024-25</SelectItem><SelectItem value="2023-24">2023-24</SelectItem><SelectItem value="2022-23">2022-23</SelectItem></SelectContent></Select></div>
              <div><Label>Month</Label><Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="jul">July</SelectItem><SelectItem value="aug">August</SelectItem></SelectContent></Select></div>
            </div>
            <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Reset</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="border-r">Particulars</TableHead>
                  <TableHead colSpan={4} className="text-center border-r">Cost</TableHead>
                  <TableHead className="border-r">Rate</TableHead>
                  <TableHead colSpan={4} className="text-center border-r">Depreciation</TableHead>
                  <TableHead>WDV</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Opening</TableHead>
                  <TableHead>Addition</TableHead>
                  <TableHead>Disposal</TableHead>
                  <TableHead className="border-r">Closing</TableHead>
                  <TableHead className="border-r">Dep. Rate</TableHead>
                  <TableHead>Opening</TableHead>
                  <TableHead>Charged</TableHead>
                  <TableHead>Disposal</TableHead>
                  <TableHead className="border-r">Closing</TableHead>
                  <TableHead>Written Down Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium border-r">{r.particulars}</TableCell>
                    <TableCell className="text-right">{r.costOpening.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.costAddition.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.costDisposal.toLocaleString()}</TableCell>
                    <TableCell className="text-right border-r font-medium">{r.costClosing.toLocaleString()}</TableCell>
                    <TableCell className="text-center border-r">{r.depRate}</TableCell>
                    <TableCell className="text-right">{r.depOpening.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.depCharged.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.depDisposal.toLocaleString()}</TableCell>
                    <TableCell className="text-right border-r font-medium">{r.depClosing.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">{r.wdv.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted font-bold">
                  <TableCell className="border-r">Total</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.costOpening, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.costAddition, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.costDisposal, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right border-r">{scheduleData.reduce((s, r) => s + r.costClosing, 0).toLocaleString()}</TableCell>
                  <TableCell className="border-r"></TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.depOpening, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.depCharged, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.depDisposal, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right border-r">{scheduleData.reduce((s, r) => s + r.depClosing, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{scheduleData.reduce((s, r) => s + r.wdv, 0).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
