import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewLandedCost() {
  return (
    <EntryFormScaffold
      title="New Landed Cost Allocation"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/landed-cost"
      sections={[
        {
          title: 'Landed Cost Header',
          fields: [
            { name: 'lcNo', label: 'Landed Cost No', required: true },
            { name: 'lcDate', label: 'Date', type: 'date', required: true },
            { name: 'mrrRef', label: 'Against MRR / Shipment', type: 'select', required: true, options: ['MRR-2026-0001', 'MRR-2026-0002'] },
            { name: 'fpoRef', label: 'FPO Reference', type: 'select', options: ['FPO-2026-0001'] },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD'] },
            { name: 'baseValue', label: 'Goods Base Value (BDT)', type: 'number' },
            { name: 'allocationMethod', label: 'Allocation Method', type: 'select', required: true, options: ['By Value', 'By Quantity', 'By Weight', 'By Volume'] },
          ],
        },
      ]}
      lineItems={{
        title: 'Cost Components',
        columns: [
          { name: 'costHead', label: 'Cost Head', type: 'select', options: ['Freight', 'Insurance', 'Customs Duty', 'VAT', 'C&F Charges', 'Bank Charges', 'Inland Transport', 'Demurrage', 'Other'] },
          { name: 'invoiceNo', label: 'Invoice / Bill No' },
          { name: 'partyName', label: 'Party / Vendor' },
          { name: 'amount', label: 'Amount (BDT)', type: 'number' },
          { name: 'glAccount', label: 'GL Account' },
          { name: 'remarks', label: 'Remarks' },
        ],
      }}
      submitLabel="Allocate Landed Cost"
    />
  );
}