import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewMaterialIssueReturn() {
  return (
    <EntryFormScaffold
      title="New Material Issue Return"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/material-issue-return"
      sections={[
        {
          title: 'Issue Return Header',
          fields: [
            { name: 'returnNo', label: 'Return No', required: true },
            { name: 'returnDate', label: 'Return Date', type: 'date', required: true },
            { name: 'miRef', label: 'Against MI', type: 'select', required: true, options: ['MI-2026-0001', 'MI-2026-0002'] },
            { name: 'department', label: 'From Department', type: 'select', options: ['Engineering', 'Operations', 'Catering'] },
            { name: 'toWarehouse', label: 'To Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare'] },
            { name: 'reason', label: 'Reason', type: 'select', options: ['Excess', 'Wrong Item', 'Unused', 'Defective'] },
            { name: 'returnedBy', label: 'Returned By' },
            { name: 'receivedBy', label: 'Received By' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Returned Items',
        columns: [
          { name: 'item', label: 'Item / Part' },
          { name: 'uom', label: 'UOM' },
          { name: 'issuedQty', label: 'Issued Qty', type: 'number' },
          { name: 'returnQty', label: 'Return Qty', type: 'number' },
          { name: 'condition', label: 'Condition', type: 'select', options: ['Good / Reusable', 'Damaged', 'Scrap'] },
          { name: 'location', label: 'To Bin' },
        ],
      }}
      submitLabel="Confirm Return"
    />
  );
}