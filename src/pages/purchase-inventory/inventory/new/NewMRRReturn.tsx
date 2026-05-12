import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewMRRReturn() {
  return (
    <EntryFormScaffold
      title="New MRR Return"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/mrr-return"
      sections={[
        {
          title: 'MRR Return Header',
          fields: [
            { name: 'returnNo', label: 'Return No', required: true },
            { name: 'returnDate', label: 'Return Date', type: 'date', required: true },
            { name: 'mrrRef', label: 'Against MRR', type: 'select', required: true, options: ['MRR-2026-0001', 'MRR-2026-0002'] },
            { name: 'vendor', label: 'Vendor', type: 'select', options: ['Vendor A', 'Boeing'] },
            { name: 'returnReason', label: 'Reason', type: 'select', required: true, options: ['Defective', 'Wrong Item', 'Excess', 'Quality Issue', 'Damaged'] },
            { name: 'warehouse', label: 'From Warehouse', type: 'select', options: ['DAC Main', 'CGP Spare'] },
            { name: 'gatePassNo', label: 'Gate Pass No' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Returned Items',
        columns: [
          { name: 'item', label: 'Item / Description' },
          { name: 'uom', label: 'UOM' },
          { name: 'receivedQty', label: 'MRR Qty', type: 'number' },
          { name: 'returnQty', label: 'Return Qty', type: 'number' },
          { name: 'rate', label: 'Rate', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
          { name: 'reason', label: 'Reason' },
        ],
      }}
      submitLabel="Confirm Return"
    />
  );
}