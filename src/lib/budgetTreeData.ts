import type { BudgetTreeNode } from '@/components/budget/BudgetTreeReport';

/**
 * Shared dummy budget tree: Budget Head → SBU → Department → Hub → City
 * Leaf (city) values include the metrics used across reports.
 *  - y1 / y2 / y3: allocation across fiscal years
 *  - budget / actual: for variance reports (current FY)
 */
export const budgetTreeData: BudgetTreeNode[] = [
  {
    id: 'bh-1', label: 'Head Office Cash (11101001)', level: 'budget',
    children: [
      {
        id: 'sbu-foodi', label: 'Foodi', level: 'sbu',
        children: [
          {
            id: 'd-foodi-acc', label: 'Accounts', level: 'dept',
            children: [
              {
                id: 'h-foodi-acc-dhk', label: 'Dhaka', level: 'hub',
                children: [
                  { id: 'c-foodi-acc-dhk-dhk', label: 'Dhaka', level: 'city',
                    values: { y1: 800000, y2: 900000, y3: 1000000, budget: 1000000, actual: 920000 } },
                  { id: 'c-foodi-acc-dhk-nrg', label: 'Narayangonj', level: 'city',
                    values: { y1: 300000, y2: 350000, y3: 400000, budget: 400000, actual: 410000 } },
                ],
              },
            ],
          },
          {
            id: 'd-foodi-mkt', label: 'Marketing', level: 'dept',
            children: [
              {
                id: 'h-foodi-mkt-rj', label: 'Rajshahi', level: 'hub',
                children: [
                  { id: 'c-foodi-mkt-rj-rj', label: 'Rajshahi', level: 'city',
                    values: { y1: 200000, y2: 250000, y3: 300000, budget: 300000, actual: 275000 } },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sbu-mart', label: 'Mart', level: 'sbu',
        children: [
          {
            id: 'd-mart-acc', label: 'Accounts', level: 'dept',
            children: [
              {
                id: 'h-mart-acc-dhk', label: 'Dhaka', level: 'hub',
                children: [
                  { id: 'c-mart-acc-dhk-dhk', label: 'Dhaka', level: 'city',
                    values: { y1: 600000, y2: 650000, y3: 700000, budget: 700000, actual: 680000 } },
                ],
              },
              {
                id: 'h-mart-acc-rj', label: 'Rajshahi', level: 'hub',
                children: [
                  { id: 'c-mart-acc-rj-rj', label: 'Rajshahi', level: 'city',
                    values: { y1: 250000, y2: 300000, y3: 350000, budget: 350000, actual: 360000 } },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sbu-shop', label: 'Shop', level: 'sbu',
        children: [
          {
            id: 'd-shop-mkt', label: 'Marketing', level: 'dept',
            children: [
              {
                id: 'h-shop-mkt-dhk', label: 'Dhaka', level: 'hub',
                children: [
                  { id: 'c-shop-mkt-dhk-dhk', label: 'Dhaka', level: 'city',
                    values: { y1: 150000, y2: 180000, y3: 200000, budget: 200000, actual: 195000 } },
                ],
              },
            ],
          },
          {
            id: 'd-shop-acc', label: 'Accounts', level: 'dept',
            children: [
              {
                id: 'h-shop-acc-dhk', label: 'Dhaka', level: 'hub',
                children: [
                  { id: 'c-shop-acc-dhk-dhk', label: 'Dhaka', level: 'city',
                    values: { y1: 400000, y2: 420000, y3: 450000, budget: 450000, actual: 470000 } },
                ],
              },
              {
                id: 'h-shop-acc-rj', label: 'Rajshahi', level: 'hub',
                children: [
                  { id: 'c-shop-acc-rj-rj', label: 'Rajshahi', level: 'city',
                    values: { y1: 180000, y2: 200000, y3: 220000, budget: 220000, actual: 210000 } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
