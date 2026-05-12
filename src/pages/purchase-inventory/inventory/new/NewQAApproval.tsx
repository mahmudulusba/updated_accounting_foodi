import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewQAApproval() {
  return (
    <EntryFormScaffold
      title="New QA / Inspection"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/qa-approval"
      sections={[
        {
          title: 'QA Header',
          fields: [
            { name: 'qaNo', label: 'QA Reference No', required: true },
            { name: 'qaDate', label: 'Inspection Date', type: 'date', required: true },
            { name: 'poRef', label: 'Against PO / Shipment', type: 'select', options: ['PO-2026-0001', 'FPO-2026-0001'] },
            { name: 'vendor', label: 'Vendor', type: 'select', options: ['Vendor A', 'Boeing', 'Airbus'] },
            { name: 'inspector', label: 'Inspector / QA Officer', required: true },
            { name: 'method', label: 'Inspection Method', type: 'select', options: ['Visual', 'Sampling', '100%', 'Destructive', 'Non-Destructive'] },
            { name: 'overallStatus', label: 'Overall Result', type: 'select', required: true, options: ['Approved', 'Rejected', 'Partial Accept', 'Hold'] },
            { name: 'remarks', label: 'Inspection Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Inspected Items',
        columns: [
          { name: 'item', label: 'Item / Part' },
          { name: 'received', label: 'Received Qty', type: 'number' },
          { name: 'sampled', label: 'Sampled Qty', type: 'number' },
          { name: 'accepted', label: 'Accepted Qty', type: 'number' },
          { name: 'rejected', label: 'Rejected Qty', type: 'number' },
          { name: 'reason', label: 'Reject Reason' },
          { name: 'status', label: 'Status', type: 'select', options: ['Approved', 'Rejected', 'Hold'] },
        ],
      }}
      submitLabel="Submit QA Result"
    />
  );
}