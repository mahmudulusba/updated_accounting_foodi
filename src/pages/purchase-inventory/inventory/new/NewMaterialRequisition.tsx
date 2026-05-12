import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewMaterialRequisition() {
  return (
    <EntryFormScaffold
      title="New Material Requisition (MR)"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/material-requisition"
      sections={[
        {
          title: 'MR Header',
          fields: [
            { name: 'mrNo', label: 'MR No', required: true },
            { name: 'mrDate', label: 'MR Date', type: 'date', required: true },
            { name: 'requestedBy', label: 'Requested By', required: true },
            { name: 'department', label: 'Department', type: 'select', required: true, options: ['Engineering', 'Operations', 'Catering', 'GSE', 'IT', 'Admin'] },
            { name: 'fromWarehouse', label: 'Issuing Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare', 'ZYL Catering'] },
            { name: 'requiredBy', label: 'Required By', type: 'date' },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Normal', 'High', 'AOG (Aircraft on Ground)'] },
            { name: 'purpose', label: 'Purpose', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Requested Items',
        columns: [
          { name: 'itemCode', label: 'Item Code' },
          { name: 'itemName', label: 'Item Name' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'MTR', 'BOX'] },
          { name: 'availableQty', label: 'Available Qty', type: 'number' },
          { name: 'requestedQty', label: 'Requested Qty', type: 'number' },
          { name: 'remarks', label: 'Remarks' },
        ],
      }}
      submitLabel="Submit MR"
    />
  );
}