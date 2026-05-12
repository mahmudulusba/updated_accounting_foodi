import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewRoute() {
  return (
    <EntryFormScaffold
      title="Add Inventory Route"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/route"
      sections={[
        {
          title: 'Route Information',
          fields: [
            { name: 'routeCode', label: 'Route Code', required: true },
            { name: 'routeName', label: 'Route Name', required: true },
            { name: 'origin', label: 'Origin Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare'] },
            { name: 'destination', label: 'Destination Warehouse', type: 'select', required: true, options: ['ZYL Catering', 'CXB Spare'] },
            { name: 'transitTime', label: 'Avg Transit Time (hrs)', type: 'number' },
            { name: 'mode', label: 'Mode', type: 'select', options: ['Road', 'Air', 'Sea', 'Courier'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
          ],
        },
      ]}
      submitLabel="Save Route"
    />
  );
}