import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewMaterialIssue() {
  return (
    <EntryFormScaffold
      title="New Material Issue (MI)"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/material-issue"
      sections={[
        {
          title: 'Issue Header',
          fields: [
            { name: 'miNo', label: 'MI No', required: true },
            { name: 'miDate', label: 'Issue Date', type: 'date', required: true },
            { name: 'mrRef', label: 'Against MR', type: 'select', required: true, options: ['MR-2026-0001', 'MR-2026-0002'] },
            { name: 'fromWarehouse', label: 'From Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare'] },
            { name: 'department', label: 'To Department', type: 'select', options: ['Engineering', 'Operations', 'Catering'] },
            { name: 'issuedBy', label: 'Issued By' },
            { name: 'receivedBy', label: 'Received By' },
            { name: 'aircraftReg', label: 'Aircraft Reg (if applicable)' },
            { name: 'workOrderNo', label: 'Work Order No' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Issued Items',
        columns: [
          { name: 'item', label: 'Item / Part' },
          { name: 'uom', label: 'UOM' },
          { name: 'requestedQty', label: 'Requested Qty', type: 'number' },
          { name: 'issuedQty', label: 'Issued Qty', type: 'number' },
          { name: 'rate', label: 'Rate', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
          { name: 'batch', label: 'Batch / Serial' },
          { name: 'location', label: 'From Bin' },
        ],
      }}
      submitLabel="Issue Material"
    />
  );
}