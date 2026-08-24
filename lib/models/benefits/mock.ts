// Mock repository: in-memory records standing in for a database. Selected
// when DATA_SOURCE=mock.

import type {
  BalanceSheetDTO,
  BenefitTileDTO,
  CompBreakdownDTO,
  CompScenariosDTO,
  CompTileDTO,
  EquityReportDTO,
  HealthTileDTO,
  NetWorthTileDTO,
  PortfolioTileDTO,
  QuickLinkDTO,
  RetirementTileDTO,
} from '@/lib/types'
import type { BenefitsRepository } from './repository'

const summaryTiles: BenefitTileDTO[] = [
  {
    id: 'total-benefit-value',
    title: 'Total Benefit Value',
    variant: 'description',
    amount: 24850.0,
    description: 'Annual Employer Contribution',
  },
  {
    id: 'utilized',
    title: 'Utilized',
    variant: 'trend',
    amount: 12340.0,
    trendDirection: 'up',
    trendPercent: 64,
  },
  {
    id: 'unclaimed',
    title: 'Unclaimed',
    variant: 'expiry',
    amount: 3210.0,
    expiryDate: '12/31/2026',
  },
  {
    id: 'open-enrollment',
    title: 'Open Enrollment',
    variant: 'date',
    date: '11/01/2026',
    description: 'Next Enrollment Window',
  },
]

const compTiles: CompTileDTO[] = [
  {
    id: 'base-salary',
    title: 'Base Salary',
    variant: 'description',
    amount: 185000.0,
    description: 'Annual',
  },
  {
    id: 'cash-bonus',
    title: 'Cash Bonus',
    variant: 'trend',
    amount: 27750.0,
    trendDirection: 'up',
    trendPercent: 18,
  },
  {
    id: 'pltr-rsu-ytd',
    title: 'PLTR RSU Value (YTD)',
    variant: 'description',
    amount: 94200.0,
    description: 'TBD shared vested',
  },
  {
    id: 'open-enrollment',
    title: 'Open Enrollment',
    variant: 'date-trend',
    date: '11/01/2026',
    trendDirection: 'up',
    trendPercent: 18,
  },
]

const portfolioTiles: PortfolioTileDTO[] = [
  { id: 'net-worth', title: 'NW Worth', description: 'Total Portfolio Value' },
  { id: 'rsu-vest', title: 'RSU Vest', description: 'Next Vest 12/01/2026' },
  { id: 'risk-conc', title: 'Risk Conc.', description: 'Single-Stock Concentration' },
  { id: '401k-match', title: '401K Match', description: 'Annual Employer Contribution' },
]

const quickLinks: QuickLinkDTO[] = [
  { label: 'RSU Vesting', href: '#rsu-vesting' },
  { label: 'Diversification', href: '#diversification' },
  { label: 'Tax Planning', href: '#tax-planning' },
  { label: 'Retirement', href: '#retirement' },
]

const healthTiles: HealthTileDTO[] = [
  {
    id: 'medical',
    title: 'Medical Insurance',
    status: 'ACTIVE',
    description:
      'Palantir covers 100% premium for employee + family. Anthem Blue Cross PPO, $500 deductible.',
    utilization: 100,
    stat: '$0 PREMIUM',
  },
  {
    id: 'dental',
    title: 'Dental Insurance',
    status: 'ACTIVE',
    description:
      'In-network annual maximum preventive care 100% covered. Orthodontics 50% up to $1500.',
    utilization: 45,
    stat: '$2000/YEAR',
  },
  {
    id: 'vision',
    title: 'Vision Insurance',
    status: 'ACTIVE',
    description: 'Frames + contacts allowance. Annual eye exam covered. VSP network.',
    utilization: 0,
    stat: '$500/YEAR',
  },
  {
    id: 'hsa-match',
    title: 'HSA Employer Match',
    status: 'UNCLAIMED',
    description:
      '50% employer match on up to $4800 HSA contribution. You have contributed $0 this year. Expires Dec 31.',
    utilization: 0,
    stat: '$2400',
  },
  {
    id: 'commuter',
    title: 'Commuter Benefits',
    status: 'PARTIAL',
    description:
      '$200/mo pre-tax commuter benefit. Currently using $65/mo - $420 unclaimed this year.',
    utilization: 82,
    stat: '$420 UNCLAIMED',
  },
  {
    id: 'dependent-care-fsa',
    title: 'Dependent Care FSA',
    status: 'ENROLLED',
    description:
      'Fully enrolled. $3200 remaining for 2026. Use for childcare, after-school programs.',
    utilization: 36,
    stat: '$5000',
  },
]

const retirementTiles: RetirementTileDTO[] = [
  {
    id: '401k-fidelity',
    title: '401K - Fidelity Net Benefits',
    variant: 'detail',
    contributions: [
      { contributionPercent: 8, contributionAmount: 14800 },
      { contributionPercent: 6, contributionAmount: 11100 },
    ],
    contributedAmount: 14800,
    irsLimit: 23000,
    percentSpent: 64,
    infoCategory: 'Tip',
    infoType: 'Opportunity',
    infoDescription:
      'You can contribute $82,200 more this year to reach the IRS maximum and maximize tax-advantage growth.',
  },
  {
    id: 'pltr-rsu',
    title: 'PLTR RSU Program - Morgan Stanley',
    variant: 'description',
    amount: 42300.0,
    description: 'Annual Employer Contribution',
  },
]

const networthTiles: NetWorthTileDTO[] = [
  {
    id: 'net-worth',
    title: 'Net Worth',
    valueText: '$1.24M',
    description: '12.4 TYD',
    descriptionTone: 'green',
  },
  {
    id: 'pltr-equity-value',
    title: 'PLTR Equity Value',
    valueText: '$842K',
    description: '68% Conc.',
    descriptionTone: 'plain',
  },
  {
    id: 'total-compensation',
    title: 'Total Compensation',
    valueText: '$312K',
    description: '2024 annual total',
    descriptionTone: 'plain',
  },
  {
    id: 'unclaimed-benefits',
    title: 'Unclaimed Benefits',
    valueText: '$4,820',
    actionLabel: 'claim now',
    actionHref: '#claim',
  },
]

const equityReport: EquityReportDTO = {
  id: 'pltr-rsu-holdings',
  reportType: 'PLTR RSU Holdings - All Tranches',
  feedType: 'Morgan Stanley Feed',
  equityValueType: 'Total PLTR Equity Value',
  equityValue: '$842,440',
  equityShareCount: '6960 shares @$121.08 -',
  shareAccountType: 'Taxable Account',
  grants: [
    {
      id: 'grant-a',
      sharesText: '2324 shares',
      valueText: '$283,327',
      description: 'Grant A - Dec 2021 Grant price $18.42',
      status: 'VESTED',
    },
    {
      id: 'grant-b',
      sharesText: '1850 shares',
      valueText: '$283,327',
      description: 'Grant B - Jan 2023 Grant price $6.72',
      status: 'UNVESTED',
    },
    {
      id: 'grant-c',
      sharesText: '2770 shares',
      valueText: '$283,327',
      description: 'Grant C - Feb 2024 Grant price $21.33',
      status: 'UNVESTED',
    },
  ],
  stockType: '(Schwab Equity + Morgan Stanley -',
  lastUpdated: 'Updated 30 mins ago)',
}

const balanceSheet: BalanceSheetDTO = {
  id: 'balance-sheet',
  reportType: 'Balance Sheet',
  feedType: 'Taxable/Non taxable',
  stockType: 'PLTR',
  stockPercent: 68,
  holdings: [
    { id: 'pltr-equity', investmentType: 'PLTR Equity (Taxable)', investmentValue: '$842,400' },
    {
      id: '401k-fidelity',
      investmentType: '401K - Fidelity (Non-taxable)',
      investmentValue: '$187,320',
    },
    { id: 'roth-ira', investmentType: 'ROTH IRA (Non-taxable)', investmentValue: '$42,100' },
    { id: 'citi-banking', investmentType: 'Citi Banking', investmentValue: '$67,840' },
    {
      id: 'student-loan',
      investmentType: 'Student Loan (Liability)',
      investmentValue: '-$38,200',
      valueTone: 'maroon',
    },
  ],
  totalType: 'Total Net Worth',
  totalValue: '$1,101,500',
}

const compBreakdown: CompBreakdownDTO = {
  rows: [
    { id: 'base-salary', compType: 'Base Salary', compAmount: 185000, compPercent: 59.3 },
    { id: 'cash-bonus', compType: 'Cash Bonus', compAmount: 27750, compPercent: 8.9 },
    { id: 'pltr-rsus-vested', compType: 'PLTR RSUs (vested)', compAmount: 94200, compPercent: 30.2 },
    { id: 'benefits-value', compType: 'Benefits Value', compAmount: 5000, compPercent: 1.6 },
  ],
  totalComp: 312050,
}

const compScenarios: CompScenariosDTO = {
  scenarios: [
    { id: 'bear-case', stockType: 'Bear Case', stockValue: 65, totalValue: 452400 },
    { id: 'current', stockType: 'Current', stockValue: 121.08, totalValue: 842440 },
    { id: 'bull-case', stockType: 'Bull Case', stockValue: 180, totalValue: 1252800 },
  ],
  disclosureText:
    'Scenarios based on 6960 vested PLTR shared. Unvested shared (4620) not included. Educational only - not investment advice.',
}

export class MockBenefitsRepository implements BenefitsRepository {
  async getSummaryTiles(): Promise<BenefitTileDTO[]> {
    return summaryTiles
  }

  async getCompTiles(): Promise<CompTileDTO[]> {
    return compTiles
  }

  async getPortfolioTiles(): Promise<PortfolioTileDTO[]> {
    return portfolioTiles
  }

  async getQuickLinks(): Promise<QuickLinkDTO[]> {
    return quickLinks
  }

  async getHealthTiles(): Promise<HealthTileDTO[]> {
    return healthTiles
  }

  async getRetirementTiles(): Promise<RetirementTileDTO[]> {
    return retirementTiles
  }

  async getNetWorthTiles(): Promise<NetWorthTileDTO[]> {
    return networthTiles
  }

  async getEquityReport(): Promise<EquityReportDTO> {
    return equityReport
  }

  async getBalanceSheet(): Promise<BalanceSheetDTO> {
    return balanceSheet
  }

  async getCompBreakdown(): Promise<CompBreakdownDTO> {
    return compBreakdown
  }

  async getCompScenarios(): Promise<CompScenariosDTO> {
    return compScenarios
  }
}
