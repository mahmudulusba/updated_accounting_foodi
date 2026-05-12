import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewSalesOrder() {
  return (
    <EntryFormScaffold
      title="New Sales Order (SO)"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/sales-order"
      sections={[
        {
          title: 'Sales Order Header',
          fields: [
            { name: 'soNo', label: 'SO No', required: true },
            { name: 'soDate', label: 'SO Date', type: 'date', required: true },
            { name: 'customer', label: 'Customer', type: 'select', required: true, options: ['Biman', 'NovoAir', 'Air Astra', 'Walk-in'] },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD'] },
            { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Cash', 'Net 15', 'Net 30', 'Advance'] },
            { name: 'deliveryDate', label: 'Delivery Date', type: 'date' },
            { name: 'shipTo', label: 'Ship To Address', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'SO Line Items',
        columns: [
          { name: 'item', label: 'Item / Description' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'BOX'] },
          { name: 'qty', label: 'Qty', type: 'number' },
          { name: 'rate', label: 'Rate', type: 'number' },
          { name: 'discount', label: 'Disc %', type: 'number' },
          { name: 'vat', label: 'VAT %', type: 'number' },
          { name: 'total', label: 'Total', type: 'number' },
        ],
      }}
      submitLabel="Confirm SO"
    />
  );
}