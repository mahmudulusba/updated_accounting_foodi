import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewSalesLoanRequest() {
  return (
    <EntryFormScaffold
      title="New Sales / Loan Request"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/sales-loan-request"
      sections={[
        {
          title: 'Request Header',
          fields: [
            { name: 'reqNo', label: 'Request No', required: true },
            { name: 'reqDate', label: 'Request Date', type: 'date', required: true },
            { name: 'reqType', label: 'Request Type', type: 'select', required: true, options: ['Sales', 'Loan'] },
            { name: 'party', label: 'Party / Airline', type: 'select', required: true, options: ['Biman', 'NovoAir', 'Air Astra', 'External'] },
            { name: 'returnDate', label: 'Expected Return Date (Loan)', type: 'date' },
            { name: 'fromWarehouse', label: 'From Warehouse', type: 'select', options: ['DAC Main', 'CGP Spare'] },
            { name: 'requestedBy', label: 'Requested By' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 3 },
          ],
        },
      ]}
      lineItems={{
        title: 'Requested Items',
        columns: [
          { name: 'itemCode', label: 'Item / Part Code' },
          { name: 'description', label: 'Description' },
          { name: 'serial', label: 'Serial No' },
          { name: 'qty', label: 'Qty', type: 'number' },
          { name: 'rate', label: 'Rate', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
        ],
      }}
      submitLabel="Submit Request"
    />
  );
}