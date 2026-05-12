import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewVendor() {
  return (
    <EntryFormScaffold
      title="Add New Vendor"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/vendor-setup"
      sections={[
        {
          title: 'Vendor Information',
          fields: [
            { name: 'vendorCode', label: 'Vendor Code', required: true, placeholder: 'Auto-generated or enter' },
            { name: 'vendorName', label: 'Vendor Name', required: true },
            { name: 'vendorType', label: 'Vendor Type', type: 'select', required: true, options: ['Local', 'Foreign', 'Service Provider', 'Manufacturer'] },
            { name: 'category', label: 'Vendor Category', type: 'select', options: ['Goods', 'Services', 'Both'] },
            { name: 'taxId', label: 'TIN / BIN' },
            { name: 'vatReg', label: 'VAT Registration No' },
          ],
        },
        {
          title: 'Contact Details',
          fields: [
            { name: 'contactPerson', label: 'Contact Person' },
            { name: 'designation', label: 'Designation' },
            { name: 'phone', label: 'Phone', required: true },
            { name: 'mobile', label: 'Mobile' },
            { name: 'email', label: 'Email' },
            { name: 'website', label: 'Website' },
            { name: 'address', label: 'Address', type: 'textarea', colSpan: 3 },
            { name: 'country', label: 'Country', type: 'select', options: ['Bangladesh', 'India', 'China', 'UAE', 'USA', 'UK', 'Singapore'] },
            { name: 'city', label: 'City' },
            { name: 'postalCode', label: 'Postal Code' },
          ],
        },
        {
          title: 'Banking & Payment',
          fields: [
            { name: 'bankName', label: 'Bank Name' },
            { name: 'branchName', label: 'Branch Name' },
            { name: 'accountNo', label: 'Account No' },
            { name: 'swift', label: 'SWIFT / Routing' },
            { name: 'currency', label: 'Default Currency', type: 'select', options: ['BDT', 'USD', 'EUR', 'GBP', 'INR'] },
            { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Cash', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC'] },
            { name: 'creditLimit', label: 'Credit Limit', type: 'number' },
            { name: 'creditDays', label: 'Credit Days', type: 'number' },
          ],
        },
      ]}
      submitLabel="Save Vendor"
    />
  );
}