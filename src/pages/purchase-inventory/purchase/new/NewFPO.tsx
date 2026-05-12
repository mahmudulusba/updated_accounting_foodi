import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewFPO() {
  return (
    <EntryFormScaffold
      title="New Foreign Purchase Order (FPO)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/foreign-po"
      sections={[
        {
          title: 'FPO Header',
          fields: [
            { name: 'poNo', label: 'PO No', required: true },
            { name: 'poDate', label: 'PO Date', type: 'date', required: true },
            { name: 'vendor', label: 'Foreign Vendor', type: 'select', required: true, options: ['Boeing', 'Airbus', 'GE Aviation', 'Rolls Royce'] },
            { name: 'country', label: 'Country of Origin', type: 'select', options: ['USA', 'France', 'UK', 'Germany', 'Singapore', 'UAE'] },
            { name: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP', 'SGD'] },
            { name: 'exchangeRate', label: 'Exchange Rate', type: 'number' },
            { name: 'incoterms', label: 'Incoterms', type: 'select', options: ['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP'] },
            { name: 'portOfLoading', label: 'Port of Loading' },
            { name: 'portOfDischarge', label: 'Port of Discharge', type: 'select', options: ['Chittagong Port', 'Mongla Port', 'Dhaka Air Cargo'] },
            { name: 'shipMode', label: 'Mode of Shipment', type: 'select', options: ['Sea', 'Air', 'Road', 'Courier'] },
            { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['LC at Sight', 'LC Usance', 'TT Advance', 'TT after Shipment', 'DA', 'DP'] },
            { name: 'expectedShipment', label: 'Expected Shipment Date', type: 'date' },
          ],
        },
      ]}
      lineItems={{
        title: 'FPO Line Items',
        columns: [
          { name: 'partNo', label: 'Part No / Item Code' },
          { name: 'description', label: 'Description' },
          { name: 'hsCode', label: 'HS Code' },
          { name: 'uom', label: 'UOM', type: 'select', options: ['PCS', 'KG', 'LTR', 'SET'] },
          { name: 'qty', label: 'Qty', type: 'number' },
          { name: 'unitPrice', label: 'Unit Price (FCY)', type: 'number' },
          { name: 'total', label: 'Total (FCY)', type: 'number' },
        ],
      }}
      submitLabel="Issue FPO"
    />
  );
}