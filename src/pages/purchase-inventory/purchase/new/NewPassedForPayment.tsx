import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewPassedForPayment() {
  return (
    <EntryFormScaffold
      title="New Passed for Payment (PFP)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/passed-for-payment"
      sections={[
        {
          title: 'PFP Header',
          fields: [
            { name: 'pfpNo', label: 'PFP No', required: true },
            { name: 'pfpDate', label: 'PFP Date', type: 'date', required: true },
            { name: 'vendor', label: 'Vendor', type: 'select', required: true, options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'invoiceNo', label: 'Vendor Invoice No', required: true },
            { name: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
            { name: 'poRef', label: 'PO / LPO Reference', type: 'select', options: ['PO-2026-0001', 'LPO-2026-0001'] },
            { name: 'mrrRef', label: 'MRR Reference', type: 'select', options: ['MRR-2026-0001', 'MRR-2026-0002'] },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD', 'EUR'] },
            { name: 'invoiceAmount', label: 'Invoice Amount', type: 'number', required: true },
            { name: 'vatAmount', label: 'VAT Amount', type: 'number' },
            { name: 'tdsAmount', label: 'TDS / Tax Deducted', type: 'number' },
            { name: 'netPayable', label: 'Net Payable', type: 'number' },
            { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Cash', 'Cheque', 'Bank Transfer', 'TT', 'Pay Order'] },
            { name: 'bankAccount', label: 'Bank Account', type: 'select', options: ['City Bank Current', 'EBL USD', 'BRAC BDT'] },
            { name: 'dueDate', label: 'Payment Due Date', type: 'date' },
            { name: 'narration', label: 'Narration / Justification', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      submitLabel="Pass for Payment"
    />
  );
}