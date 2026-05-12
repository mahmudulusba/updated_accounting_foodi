import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewQuotation() {
  return (
    <EntryFormScaffold
      title="New Vendor Quotation"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/quotation"
      sections={[
        {
          title: 'Quotation Header',
          fields: [
            { name: 'quotNo', label: 'Quotation No', required: true },
            { name: 'quotDate', label: 'Quotation Date', type: 'date', required: true },
            { name: 'rfqRef', label: 'Against RFQ', type: 'select', options: ['RFQ-2026-0001', 'RFQ-2026-0002'] },
            { name: 'vendor', label: 'Vendor', type: 'select', required: true, options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'validity', label: 'Validity Date', type: 'date' },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD', 'EUR'] },
            { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Cash', 'Net 15', 'Net 30', 'LC at Sight'] },
            { name: 'deliveryTerms', label: 'Delivery Terms', type: 'select', options: ['EXW', 'FOB', 'CIF', 'DDP'] },
            { name: 'leadTime', label: 'Lead Time (days)', type: 'number' },
          ],
        },
      ]}
      lineItems={{
        title: 'Quoted Items',
        columns: [
          { name: 'itemName', label: 'Item / Description' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'SET'] },
          { name: 'qty', label: 'Quantity', type: 'number' },
          { name: 'unitPrice', label: 'Unit Price', type: 'number' },
          { name: 'discount', label: 'Discount %', type: 'number' },
          { name: 'tax', label: 'Tax %', type: 'number' },
          { name: 'total', label: 'Total', type: 'number' },
        ],
      }}
      submitLabel="Save Quotation"
    />
  );
}