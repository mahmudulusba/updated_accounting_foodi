import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewRFQ() {
  return (
    <EntryFormScaffold
      title="New Request for Quotation (RFQ)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/rfq"
      sections={[
        {
          title: 'RFQ Header',
          fields: [
            { name: 'rfqNo', label: 'RFQ No', required: true, placeholder: 'Auto-generated' },
            { name: 'rfqDate', label: 'RFQ Date', type: 'date', required: true },
            { name: 'prRef', label: 'PR Reference', type: 'select', options: ['PR-2026-0001', 'PR-2026-0002', 'PR-2026-0003'] },
            { name: 'dueDate', label: 'Quote Due Date', type: 'date', required: true },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD', 'EUR', 'GBP'] },
            { name: 'mode', label: 'Mode', type: 'select', options: ['Sealed', 'Open', 'Email', 'Portal'] },
            { name: 'subject', label: 'Subject', colSpan: 3 },
            { name: 'terms', label: 'Terms & Conditions', type: 'textarea', colSpan: 3 },
          ],
        },
        {
          title: 'Invited Vendors',
          fields: [
            { name: 'vendor1', label: 'Vendor 1', type: 'select', options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'vendor2', label: 'Vendor 2', type: 'select', options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'vendor3', label: 'Vendor 3', type: 'select', options: ['Vendor A', 'Vendor B', 'Vendor C'] },
          ],
        },
      ]}
      lineItems={{
        title: 'RFQ Line Items',
        columns: [
          { name: 'itemCode', label: 'Item Code' },
          { name: 'itemName', label: 'Item / Description' },
          { name: 'specs', label: 'Specifications' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'SET'] },
          { name: 'qty', label: 'Quantity', type: 'number' },
        ],
      }}
      submitLabel="Issue RFQ"
    />
  );
}