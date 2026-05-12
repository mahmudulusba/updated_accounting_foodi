import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewComparativeStatement() {
  return (
    <EntryFormScaffold
      title="New Comparative Statement (CS)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/comparative-statement"
      sections={[
        {
          title: 'CS Header',
          fields: [
            { name: 'csNo', label: 'CS No', required: true },
            { name: 'csDate', label: 'CS Date', type: 'date', required: true },
            { name: 'rfqRef', label: 'RFQ Reference', type: 'select', options: ['RFQ-2026-0001', 'RFQ-2026-0002'] },
            { name: 'preparedBy', label: 'Prepared By' },
            { name: 'recommendedVendor', label: 'Recommended Vendor', type: 'select', options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'recommendationBasis', label: 'Recommendation Basis', type: 'select', options: ['Lowest Price', 'Best Quality', 'Best Lead Time', 'Best Overall'] },
            { name: 'justification', label: 'Justification', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Vendor Comparison',
        columns: [
          { name: 'item', label: 'Item' },
          { name: 'qty', label: 'Qty', type: 'number' },
          { name: 'vendorA', label: 'Vendor A Price', type: 'number' },
          { name: 'vendorB', label: 'Vendor B Price', type: 'number' },
          { name: 'vendorC', label: 'Vendor C Price', type: 'number' },
          { name: 'lowest', label: 'Lowest' },
          { name: 'selected', label: 'Selected Vendor' },
        ],
      }}
      submitLabel="Save CS"
    />
  );
}