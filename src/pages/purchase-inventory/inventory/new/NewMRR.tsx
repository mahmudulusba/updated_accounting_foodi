import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewMRR() {
  return (
    <EntryFormScaffold
      title="New Material Receive Requisition (MRR)"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/mrr"
      sections={[
        {
          title: 'MRR Header',
          fields: [
            { name: 'mrrNo', label: 'MRR No', required: true },
            { name: 'mrrDate', label: 'Receive Date', type: 'date', required: true },
            { name: 'poRef', label: 'Against PO / FPO', type: 'select', required: true, options: ['PO-2026-0001', 'FPO-2026-0001'] },
            { name: 'vendor', label: 'Vendor', type: 'select', required: true, options: ['Vendor A', 'Boeing', 'Airbus'] },
            { name: 'invoiceNo', label: 'Vendor Invoice No' },
            { name: 'invoiceDate', label: 'Invoice Date', type: 'date' },
            { name: 'challanNo', label: 'Challan / DC No' },
            { name: 'warehouse', label: 'Receiving Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare', 'Bonded Warehouse'] },
            { name: 'qaRef', label: 'QA Reference', type: 'select', options: ['QA-2026-0001', 'QA-2026-0002'] },
            { name: 'receivedBy', label: 'Received By' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Received Items',
        columns: [
          { name: 'itemCode', label: 'Item Code' },
          { name: 'description', label: 'Description' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'BOX', 'SET'] },
          { name: 'orderedQty', label: 'Ordered Qty', type: 'number' },
          { name: 'receivedQty', label: 'Received Qty', type: 'number' },
          { name: 'acceptedQty', label: 'Accepted Qty', type: 'number' },
          { name: 'rate', label: 'Unit Rate', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
          { name: 'batch', label: 'Batch / Serial' },
          { name: 'location', label: 'Bin / Location' },
        ],
      }}
      submitLabel="Save MRR"
    />
  );
}