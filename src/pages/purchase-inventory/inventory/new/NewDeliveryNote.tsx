import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewDeliveryNote() {
  return (
    <EntryFormScaffold
      title="New Delivery Note (DN)"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/delivery-note"
      sections={[
        {
          title: 'Delivery Note Header',
          fields: [
            { name: 'dnNo', label: 'DN No', required: true },
            { name: 'dnDate', label: 'DN Date', type: 'date', required: true },
            { name: 'soRef', label: 'Against Sales Order', type: 'select', required: true, options: ['SO-2026-0001', 'SO-2026-0002'] },
            { name: 'customer', label: 'Customer', type: 'select', required: true, options: ['Biman', 'NovoAir', 'Air Astra'] },
            { name: 'fromWarehouse', label: 'From Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare'] },
            { name: 'vehicleNo', label: 'Vehicle No' },
            { name: 'driverName', label: 'Driver Name' },
            { name: 'driverPhone', label: 'Driver Phone' },
            { name: 'deliveryAddress', label: 'Delivery Address', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Delivered Items',
        columns: [
          { name: 'item', label: 'Item / Description' },
          { name: 'uom', label: 'UOM' },
          { name: 'orderedQty', label: 'Ordered Qty', type: 'number' },
          { name: 'deliveredQty', label: 'Delivered Qty', type: 'number' },
          { name: 'batchNo', label: 'Batch / Serial' },
          { name: 'remarks', label: 'Remarks' },
        ],
      }}
      submitLabel="Issue Delivery Note"
    />
  );
}