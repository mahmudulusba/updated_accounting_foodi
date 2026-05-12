// Ticket Sales Accounting Data - Airport/Station and POS Management

export interface AirportStation {
  id: string;
  airportCode: string; // IATA code (HSIA, CXB, MAA)
  airportName: string;
  city: string;
  country: string;
  branchId: string; // Mandatory - belongs to one Branch
  branchCode: string;
  branchName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface PointOfSale {
  id: string;
  posCode: string;
  posName: string;
  posType: 'Counter' | 'Online' | 'GDS' | 'Agent';
  branchId: string; // Mandatory - belongs to one Branch
  branchCode: string;
  branchName: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface TicketSaleVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: Date;
  posId: string;
  posCode: string;
  posName: string;
  branchId: string; // Auto-derived from POS
  branchCode: string;
  ticketNumber: string;
  passengerName: string;
  amount: number;
  currency: string;
  paymentMode: 'Cash' | 'Bank' | 'Agent Credit';
  revenueStatus: 'Unearned' | 'Earned';
  status: 'draft' | 'submitted' | 'approved';
  // Accounting entries auto-generated
  entries: {
    drAccount: string; // Cash/Bank/Agent
    crAccountAR: string; // A/R POS or Agent
    crAccountClearing: string; // A/R Branch Clearing
  };
}

export interface POSSettlementVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: Date;
  posId: string;
  posCode: string;
  fromDate: Date;
  toDate: Date;
  amount: number;
  currency: string;
  branchId: string;
  branchCode: string;
  status: 'draft' | 'submitted' | 'approved';
  // Auto-entries: Dr A/R POS, Cr Unearned Service Revenue (Branch)
}

export interface FlownRevenueVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: Date;
  flightNumber: string;
  flightDate: Date;
  route: {
    departureAirportId: string;
    departureAirportCode: string;
    arrivalAirportId: string;
    arrivalAirportCode: string;
  };
  branchId: string; // Auto from departure Airport
  branchCode: string;
  ticketIds: string[]; // Linked tickets
  totalRevenue: number;
  embarkationFee: number;
  taxAmount: number;
  netRevenue: number;
  currency: string;
  status: 'system-generated' | 'approved';
  // Auto-entries:
  // Dr Unearned Service Revenue (Branch)
  // Cr Service Revenue (Airport)
  // Cr Embarkation Fee Payable
  // Cr Tax Payable
}

// Ticket sales voucher types
export const TICKET_VOUCHER_TYPES = [
  { value: 'TSV', label: 'Ticket Sales Voucher (TSV)', description: 'POS Level - Revenue Not Recognized' },
  { value: 'PSV', label: 'POS Settlement Voucher (PSV)', description: 'Convert POS receivable to unearned revenue' },
  { value: 'FRV', label: 'Flown Revenue Voucher (FRV)', description: 'System-controlled revenue recognition', systemOnly: true },
];

// POS Types
export const POS_TYPES = ['Counter', 'Online', 'GDS', 'Agent'] as const;

// Payment modes for ticket sales
export const PAYMENT_MODES = ['Cash', 'Bank', 'Agent Credit'] as const;

// Revenue status
export const REVENUE_STATUS = ['Unearned', 'Earned'] as const;

// Ticket sales specific GL accounts
export const TICKET_SALES_GL_ACCOUNTS = {
  // Asset accounts
  cashAccount: { code: '11101001', name: 'Cash Account' },
  bankAccount: { code: '11102001', name: 'Bank Account' },
  arPOS: { code: '11201010', name: 'A/R - POS Receivable' },
  arAgent: { code: '11201011', name: 'A/R - Agent Receivable' },
  arBranchClearing: { code: '11201012', name: 'A/R - Branch Clearing' },
  // Liability accounts
  unearnedRevenue: { code: '22101001', name: 'Unearned Service Revenue' },
  embarkationFeePayable: { code: '22102001', name: 'Embarkation Fee Payable' },
  taxPayable: { code: '22103001', name: 'Tax Payable' },
  // Revenue accounts
  serviceRevenue: { code: '41101010', name: 'Service Revenue - Passenger' },
};

// Mock Airport/Station data
export const mockAirportStations: AirportStation[] = [
  {
    id: '1',
    airportCode: 'HSIA',
    airportName: 'Hazrat Shahjalal International Airport',
    city: 'Dhaka',
    country: 'Bangladesh',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    airportCode: 'CXB',
    airportName: "Cox's Bazar Airport",
    city: "Cox's Bazar",
    country: 'Bangladesh',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    airportCode: 'CGP',
    airportName: 'Shah Amanat International Airport',
    city: 'Chittagong',
    country: 'Bangladesh',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    airportCode: 'MAA',
    airportName: 'Chennai International Airport',
    city: 'Chennai',
    country: 'India',
    branchId: '3',
    branchCode: 'KOL',
    branchName: 'Kolkata',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    airportCode: 'CCU',
    airportName: 'Netaji Subhas Chandra Bose International Airport',
    city: 'Kolkata',
    country: 'India',
    branchId: '3',
    branchCode: 'KOL',
    branchName: 'Kolkata',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    airportCode: 'SIN',
    airportName: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    branchId: '2',
    branchCode: 'SGP',
    branchName: 'Singapore',
    status: 'active',
    createdAt: new Date('2024-02-15'),
  },
];

// Mock POS data
export const mockPointsOfSale: PointOfSale[] = [
  {
    id: '1',
    posCode: 'POS-DHK-001',
    posName: 'Dhaka City Counter',
    posType: 'Counter',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Dhaka City Center',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    posCode: 'POS-DHK-002',
    posName: 'Uttara Sales Point',
    posType: 'Counter',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Uttara, Dhaka',
    status: 'active',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '3',
    posCode: 'POS-DHK-003',
    posName: 'Rajshahi POS',
    posType: 'Counter',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Rajshahi',
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    posCode: 'POS-ONL-001',
    posName: 'Online Booking Portal',
    posType: 'Online',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Web',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    posCode: 'POS-GDS-001',
    posName: 'Amadeus GDS',
    posType: 'GDS',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Global',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    posCode: 'POS-AGT-001',
    posName: 'Travel Agency Partner',
    posType: 'Agent',
    branchId: '1',
    branchCode: 'DHK',
    branchName: 'Dhaka',
    location: 'Multiple',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '7',
    posCode: 'POS-SGP-001',
    posName: 'Singapore Office Counter',
    posType: 'Counter',
    branchId: '2',
    branchCode: 'SGP',
    branchName: 'Singapore',
    location: 'Orchard Road',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '8',
    posCode: 'POS-KOL-001',
    posName: 'Kolkata City Counter',
    posType: 'Counter',
    branchId: '3',
    branchCode: 'KOL',
    branchName: 'Kolkata',
    location: 'Park Street',
    status: 'active',
    createdAt: new Date('2024-02-15'),
  },
];

// Mock ticket sales
export const mockTicketSales: TicketSaleVoucher[] = [
  {
    id: '1',
    voucherNumber: 'TSV-2026-0001',
    voucherDate: new Date('2026-02-01'),
    posId: '3',
    posCode: 'POS-DHK-003',
    posName: 'Rajshahi POS',
    branchId: '1',
    branchCode: 'DHK',
    ticketNumber: 'TKT-001234567',
    passengerName: 'Rahman Ali',
    amount: 12500,
    currency: 'BDT',
    paymentMode: 'Cash',
    revenueStatus: 'Unearned',
    status: 'approved',
    entries: {
      drAccount: '11101001',
      crAccountAR: '11201010',
      crAccountClearing: '11201012',
    },
  },
  {
    id: '2',
    voucherNumber: 'TSV-2026-0002',
    voucherDate: new Date('2026-02-02'),
    posId: '4',
    posCode: 'POS-ONL-001',
    posName: 'Online Booking Portal',
    branchId: '1',
    branchCode: 'DHK',
    ticketNumber: 'TKT-001234568',
    passengerName: 'Sarah Khan',
    amount: 18750,
    currency: 'BDT',
    paymentMode: 'Bank',
    revenueStatus: 'Unearned',
    status: 'approved',
    entries: {
      drAccount: '11102001',
      crAccountAR: '11201010',
      crAccountClearing: '11201012',
    },
  },
];

// Helper function to get airports by branch
export const getAirportsByBranch = (branchId: string): AirportStation[] => {
  return mockAirportStations.filter(a => a.branchId === branchId);
};

// Helper function to get POS by branch
export const getPOSByBranch = (branchId: string): PointOfSale[] => {
  return mockPointsOfSale.filter(p => p.branchId === branchId);
};

// Helper function to get all airports for multiple branches (for consolidated view)
export const getAirportsForBranches = (branchIds: string[]): AirportStation[] => {
  return mockAirportStations.filter(a => branchIds.includes(a.branchId));
};
