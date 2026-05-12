import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewWarehouseLocation() {
  return (
    <EntryFormScaffold
      title="Add Warehouse Location / Bin"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/warehouse-location"
      sections={[
        {
          title: 'Location Details',
          fields: [
            { name: 'warehouse', label: 'Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare', 'ZYL Catering'] },
            { name: 'locCode', label: 'Location Code', required: true },
            { name: 'locName', label: 'Location Name', required: true },
            { name: 'zone', label: 'Zone' },
            { name: 'aisle', label: 'Aisle' },
            { name: 'rack', label: 'Rack' },
            { name: 'shelf', label: 'Shelf' },
            { name: 'bin', label: 'Bin' },
            { name: 'capacity', label: 'Capacity', type: 'number' },
            { name: 'uom', label: 'Capacity UOM', type: 'select', options: ['CBM', 'PCS', 'PALLET', 'KG'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Blocked'] },
          ],
        },
      ]}
      submitLabel="Save Location"
    />
  );
}