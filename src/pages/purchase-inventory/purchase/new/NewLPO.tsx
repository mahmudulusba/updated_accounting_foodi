import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewLPO() {
  return (
    <EntryFormScaffold
      title="New Local Purchase Order (LPO)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/local-po"
      sections={[
        {
          title: 'LPO Header',
          fields: [
            { name: 'poNo', label: 'PO No', required: true },
            { name: 'poDate', label: 'PO Date', type: 'date', required: true },
            { name: 'vendor', label: 'Vendor', type: 'select', required: true, options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'csRef', label: 'CS Reference', type: 'select', options: ['CS-2026-0001', 'CS-2026-0002'] },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT'] },
            { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Cash', 'Net 15', 'Net 30', 'Net 45'] },
            { name: 'deliveryDate', label: 'Expected Delivery Date', type: 'date' },
            { name: 'deliveryLocation', label: 'Delivery Location', type: 'select', options: ['HO Warehouse', 'CGP Warehouse', 'ZYL Warehouse'] },
            { name: 'shippingTerms', label: 'Shipping / Freight Terms' },
          ],
        },
      ]}
      lineItems={{
        title: 'PO Line Items',
        columns: [
          { name: 'item', label: 'Item / Description' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'SET'] },
          { name: 'qty', label: 'Quantity', type: 'number' },
          { name: 'rate', label: 'Unit Rate', type: 'number' },
          { name: 'discount', label: 'Disc %', type: 'number' },
          { name: 'vat', label: 'VAT %', type: 'number' },
          { name: 'total', label: 'Total', type: 'number' },
        ],
      }}
      submitLabel="Issue LPO"
    />
  );
}