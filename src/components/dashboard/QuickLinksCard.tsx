import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccountingMode } from '@/contexts/AccountingModeContext';
import { Link } from 'react-router-dom';
import { FilePlus, Receipt, CreditCard, Banknote, FileBarChart } from 'lucide-react';

export function QuickLinksCard() {
  const { isManagementMode } = useAccountingMode();
  const prefix = isManagementMode ? '/management' : '/tax';
  const links = [
    { label: 'Add Journal Entry', icon: FilePlus, path: `${prefix}/voucher-entry` },
    { label: 'Create Invoice', icon: Receipt, path: `${prefix}/voucher-entry` },
    { label: 'Record Payment', icon: CreditCard, path: `${prefix}/voucher-entry` },
    { label: 'Reconcile Bank', icon: Banknote, path: `${prefix}/fund-transfer` },
    { label: 'Generate Report', icon: FileBarChart, path: `${prefix}/reports/transaction` },
  ];
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.path}
            className="flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <l.icon className="h-3.5 w-3.5" />
            {l.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
