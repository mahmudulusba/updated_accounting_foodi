import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewWarehouse() {
  return (
    <EntryFormScaffold
      title="Add New Warehouse"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/warehouse"
      sections={[
        {
          title: 'Warehouse Information',
          fields: [
            { name: 'whCode', label: 'Warehouse Code', required: true },
            { name: 'whName', label: 'Warehouse Name', required: true },
            { name: 'whType', label: 'Warehouse Type', type: 'select', required: true, options: ['Main', 'Sub', 'Bonded', 'Transit', 'Workshop', 'Spare Parts', 'Catering', 'GSE'] },
            { name: 'branch', label: 'Branch / Station', type: 'select', required: true, options: ['DAC - Head Office', 'CGP - Chittagong', 'ZYL - Sylhet', 'CXB - Cox\'s Bazar'] },
            { name: 'inchargeName', label: 'In-charge / Custodian' },
            { name: 'phone', label: 'Phone' },
            { name: 'address', label: 'Address', type: 'textarea', colSpan: 3 },
            { name: 'glAccount', label: 'Linked GL Account', type: 'select', options: ['Inventory - Spare Parts', 'Inventory - Consumables', 'Inventory - Catering'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
          ],
        },
      ]}
      submitLabel="Save Warehouse"
    />
  );
}