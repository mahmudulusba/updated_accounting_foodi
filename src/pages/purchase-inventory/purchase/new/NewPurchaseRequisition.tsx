import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewPurchaseRequisition() {
  return (
    <EntryFormScaffold
      title="New Purchase Requisition (PR)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/requisition"
      sections={[
        {
          title: 'Requisition Header',
          fields: [
            { name: 'prNo', label: 'PR No', required: true, placeholder: 'Auto-generated' },
            { name: 'prDate', label: 'PR Date', type: 'date', required: true },
            { name: 'requiredBy', label: 'Required By Date', type: 'date', required: true },
            { name: 'department', label: 'Department', type: 'select', required: true, options: ['Engineering', 'Operations', 'Finance', 'IT', 'Admin', 'HR'] },
            { name: 'branch', label: 'Branch / Station', type: 'select', options: ['Head Office (DAC)', 'Chittagong (CGP)', 'Sylhet (ZYL)', 'Cox\'s Bazar (CXB)'] },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Normal', 'High', 'Urgent'] },
            { name: 'requestedBy', label: 'Requested By', required: true },
            { name: 'purpose', label: 'Purpose / Justification', type: 'textarea', colSpan: 2 },
          ],
        },
      ]}
      lineItems={{
        title: 'Requested Items',
        columns: [
          { name: 'itemCode', label: 'Item Code' },
          { name: 'itemName', label: 'Item / Description' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'SET'] },
          { name: 'qty', label: 'Quantity', type: 'number' },
          { name: 'estPrice', label: 'Est. Unit Price', type: 'number' },
          { name: 'estTotal', label: 'Est. Total', type: 'number' },
          { name: 'remarks', label: 'Remarks' },
        ],
      }}
      submitLabel="Submit Requisition"
    />
  );
}