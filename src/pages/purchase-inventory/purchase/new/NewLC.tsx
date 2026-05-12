import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewLC() {
  return (
    <EntryFormScaffold
      title="New Letter of Credit (LC)"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/lc"
      sections={[
        {
          title: 'LC Application',
          fields: [
            { name: 'lcNo', label: 'LC No', required: true },
            { name: 'lcDate', label: 'LC Open Date', type: 'date', required: true },
            { name: 'lcType', label: 'LC Type', type: 'select', required: true, options: ['Sight', 'Usance / Deferred', 'Revolving', 'Standby', 'Back-to-Back'] },
            { name: 'piRef', label: 'Against PI', type: 'select', options: ['PI-2026-0001', 'PI-2026-0002'] },
            { name: 'fpoRef', label: 'Against FPO', type: 'select', options: ['FPO-2026-0001', 'FPO-2026-0002'] },
            { name: 'beneficiary', label: 'Beneficiary', type: 'select', required: true, options: ['Boeing', 'Airbus', 'GE Aviation'] },
            { name: 'beneficiaryBank', label: 'Beneficiary Bank' },
            { name: 'issuingBank', label: 'Issuing Bank', type: 'select', required: true, options: ['City Bank', 'EBL', 'BRAC Bank', 'HSBC', 'Standard Chartered'] },
            { name: 'advisingBank', label: 'Advising Bank' },
            { name: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP'] },
            { name: 'lcAmount', label: 'LC Amount', type: 'number', required: true },
            { name: 'tolerance', label: 'Tolerance %', type: 'number' },
            { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
            { name: 'expiryPlace', label: 'Expiry Place' },
            { name: 'lastShipment', label: 'Latest Shipment Date', type: 'date' },
            { name: 'tenor', label: 'Tenor / Usance Days', type: 'number' },
            { name: 'partialShipment', label: 'Partial Shipment', type: 'select', options: ['Allowed', 'Not Allowed'] },
            { name: 'transhipment', label: 'Transhipment', type: 'select', options: ['Allowed', 'Not Allowed'] },
            { name: 'incoterms', label: 'Incoterms', type: 'select', options: ['EXW', 'FOB', 'CIF', 'CFR', 'DDP'] },
          ],
        },
        {
          title: 'Charges & Margin',
          fields: [
            { name: 'marginPct', label: 'LC Margin %', type: 'number' },
            { name: 'marginAmount', label: 'Margin Amount (BDT)', type: 'number' },
            { name: 'commission', label: 'Commission', type: 'number' },
            { name: 'swiftCharge', label: 'SWIFT Charge', type: 'number' },
            { name: 'vat', label: 'VAT', type: 'number' },
            { name: 'otherCharges', label: 'Other Charges', type: 'number' },
          ],
        },
      ]}
      submitLabel="Open LC"
    />
  );
}