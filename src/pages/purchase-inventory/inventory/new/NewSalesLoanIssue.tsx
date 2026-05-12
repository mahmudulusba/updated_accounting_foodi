import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewSalesLoanIssue() {
  return (
    <EntryFormScaffold
      title="New Sales / Loan Issue"
      module="Inventory"
      backPath="/management/purchase-inventory/inventory/sales-loan-issue"
      sections={[
        {
          title: 'Issue Header',
          fields: [
            { name: 'issueNo', label: 'Issue No', required: true },
            { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
            { name: 'requestRef', label: 'Against Request', type: 'select', required: true, options: ['SLR-2026-0001', 'SLR-2026-0002'] },
            { name: 'issueType', label: 'Issue Type', type: 'select', required: true, options: ['Sales', 'Loan'] },
            { name: 'party', label: 'Party / Airline', type: 'select', options: ['Biman', 'NovoAir', 'Air Astra'] },
            { name: 'fromWarehouse', label: 'From Warehouse', type: 'select', required: true, options: ['DAC Main', 'CGP Spare'] },
            { name: 'issuedBy', label: 'Issued By' },
            { name: 'receivedBy', label: 'Received By' },
            { name: 'gatePassNo', label: 'Gate Pass No' },
          ],
        },
      ]}
      lineItems={{
        title: 'Issued Items',
        columns: [
          { name: 'itemCode', label: 'Item / Part Code' },
          { name: 'description', label: 'Description' },
          { name: 'serial', label: 'Serial No' },
          { name: 'qty', label: 'Qty Issued', type: 'number' },
          { name: 'rate', label: 'Rate', type: 'number' },
          { name: 'amount', label: 'Amount', type: 'number' },
        ],
      }}
      submitLabel="Confirm Issue"
    />
  );
}