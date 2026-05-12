import React from 'react';
import EntryFormScaffold from '../../EntryFormScaffold';

export default function NewNoteSheet() {
  return (
    <EntryFormScaffold
      title="New Note Sheet"
      module="Purchase"
      backPath="/management/purchase-inventory/purchase/note-sheet"
      sections={[
        {
          title: 'Note Sheet Header',
          fields: [
            { name: 'nsNo', label: 'Note Sheet No', required: true },
            { name: 'nsDate', label: 'Date', type: 'date', required: true },
            { name: 'csRef', label: 'CS Reference', type: 'select', options: ['CS-2026-0001', 'CS-2026-0002'] },
            { name: 'subject', label: 'Subject', required: true, colSpan: 2 },
            { name: 'amount', label: 'Total Amount', type: 'number' },
            { name: 'currency', label: 'Currency', type: 'select', options: ['BDT', 'USD', 'EUR'] },
            { name: 'recommendedVendor', label: 'Recommended Vendor', type: 'select', options: ['Vendor A', 'Vendor B', 'Vendor C'] },
            { name: 'background', label: 'Background', type: 'textarea', colSpan: 3 },
            { name: 'recommendation', label: 'Recommendation', type: 'textarea', colSpan: 3 },
          ],
        },
        {
          title: 'Approval Routing',
          fields: [
            { name: 'preparedBy', label: 'Prepared By' },
            { name: 'reviewedBy', label: 'Reviewed By' },
            { name: 'approvedBy', label: 'Final Approver' },
          ],
        },
      ]}
      submitLabel="Forward for Approval"
    />
  );
}