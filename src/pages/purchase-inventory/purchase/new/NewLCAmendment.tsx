import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewLCAmendment() {
  return (
    <EntryFormScaffold
      title="New LC Amendment"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/lc-amendment"
      sections={[
        {
          title: 'Amendment Header',
          fields: [
            { name: 'amdNo', label: 'Amendment No', required: true },
            { name: 'amdDate', label: 'Amendment Date', type: 'date', required: true },
            { name: 'lcRef', label: 'LC Reference', type: 'select', required: true, options: ['LC-2026-0001', 'LC-2026-0002'] },
            { name: 'amdType', label: 'Amendment Type', type: 'select', required: true, options: ['Increase Amount', 'Decrease Amount', 'Extend Expiry', 'Extend Shipment', 'Change Terms', 'Other'] },
          ],
        },
        {
          title: 'Amendment Details (Old vs New)',
          fields: [
            { name: 'oldAmount', label: 'Old LC Amount', type: 'number' },
            { name: 'newAmount', label: 'New LC Amount', type: 'number' },
            { name: 'oldExpiry', label: 'Old Expiry Date', type: 'date' },
            { name: 'newExpiry', label: 'New Expiry Date', type: 'date' },
            { name: 'oldShipment', label: 'Old Last Shipment', type: 'date' },
            { name: 'newShipment', label: 'New Last Shipment', type: 'date' },
            { name: 'reason', label: 'Reason for Amendment', type: 'textarea', colSpan: 3 },
            { name: 'amdCharges', label: 'Amendment Charges', type: 'number' },
            { name: 'swift', label: 'SWIFT Charges', type: 'number' },
          ],
        },
      ]}
      submitLabel="Submit Amendment"
    />
  );
}