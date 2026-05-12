import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewProformaInvoice() {
  return (
    <EntryFormScaffold
      title="New Proforma Invoice (PI)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/proforma-invoice"
      sections={[
        {
          title: 'PI Header',
          fields: [
            { name: 'piNo', label: 'PI No', required: true },
            { name: 'piDate', label: 'PI Date', type: 'date', required: true },
            { name: 'vendor', label: 'Vendor / Beneficiary', type: 'select', required: true, options: ['Boeing', 'Airbus', 'GE Aviation'] },
            { name: 'fpoRef', label: 'Against FPO', type: 'select', options: ['FPO-2026-0001', 'FPO-2026-0002'] },
            { name: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP'] },
            { name: 'piAmount', label: 'PI Amount', type: 'number' },
            { name: 'piValidity', label: 'PI Validity', type: 'date' },
            { name: 'expectedShipment', label: 'Expected Shipment', type: 'date' },
            { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['LC', 'TT Advance', 'TT after Shipment'] },
            { name: 'attachedPI', label: 'PI Document', placeholder: 'Upload via attachments below', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'PI Items',
        columns: [
          { name: 'description', label: 'Description' },
          { name: 'qty', label: 'Qty', type: 'number' },
          { name: 'unitPrice', label: 'Unit Price', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
        ],
      }}
      submitLabel="Save PI"
    />
  );
}