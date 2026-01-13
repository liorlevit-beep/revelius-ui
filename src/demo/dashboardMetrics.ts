export interface KPI {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}

export interface TimeSeriesDataPoint {
  date: string;
  baseline: number;
  optimized: number;
  chargebackRate: number;
  note?: string;
  routingEnabled?: boolean;
}

export interface RoutingDistribution {
  route: string;
  before: number;
  after: number;
}

export interface SignalCoverageDataPoint {
  date: string;
  websiteContent: number;
  checkoutFlow: number;
  ugc: number;
  productCatalog: number;
  claimsLanguage: number;
  geoLicensing: number;
}

export interface MerchantAlert {
  id: string;
  name: string;
  riskScore: number;
  riskTrend: 'up' | 'down' | 'stable';
  lastScan: string;
  estUplift: string;
  triggers: string[];
}

export const kpis: KPI[] = [
  {
    label: 'Approval Rate',
    value: '86.4%',
    delta: '+1.8pp',
    deltaType: 'positive',
  },
  {
    label: 'Estimated Uplift',
    value: '+3.2pp',
    deltaType: 'positive',
  },
  {
    label: 'Chargeback Rate',
    value: '0.62%',
    delta: '-0.08pp',
    deltaType: 'positive',
  },
  {
    label: 'Merchants Monitored',
    value: '412',
  },
  {
    label: 'Active Alerts',
    value: '17',
  },
];

// Time series data for different ranges
export const timeSeries = {
  7: [
    { date: '2024-12-31', baseline: 82.1, optimized: 82.1, chargebackRate: 0.68 },
    { date: '2025-01-01', baseline: 82.3, optimized: 82.3, chargebackRate: 0.67 },
    { date: '2025-01-02', baseline: 82.0, optimized: 82.0, chargebackRate: 0.69, routingEnabled: true, note: 'Routing enabled' },
    { date: '2025-01-03', baseline: 82.2, optimized: 84.5, chargebackRate: 0.66, note: 'Initial optimization gains' },
    { date: '2025-01-04', baseline: 82.4, optimized: 85.2, chargebackRate: 0.64 },
    { date: '2025-01-05', baseline: 82.1, optimized: 85.8, chargebackRate: 0.63 },
    { date: '2025-01-06', baseline: 82.3, optimized: 86.1, chargebackRate: 0.62 },
    { date: '2025-01-07', baseline: 82.2, optimized: 86.4, chargebackRate: 0.62 },
  ] as TimeSeriesDataPoint[],
  30: [
    { date: '2024-12-08', baseline: 81.5, optimized: 81.5, chargebackRate: 0.72 },
    { date: '2024-12-10', baseline: 81.7, optimized: 81.7, chargebackRate: 0.71 },
    { date: '2024-12-12', baseline: 81.6, optimized: 81.6, chargebackRate: 0.73 },
    { date: '2024-12-14', baseline: 81.8, optimized: 81.8, chargebackRate: 0.72 },
    { date: '2024-12-16', baseline: 81.9, optimized: 81.9, chargebackRate: 0.71 },
    { date: '2024-12-18', baseline: 82.0, optimized: 82.0, chargebackRate: 0.70 },
    { date: '2024-12-20', baseline: 82.1, optimized: 82.1, chargebackRate: 0.69 },
    { date: '2024-12-22', baseline: 82.2, optimized: 82.2, chargebackRate: 0.69 },
    { date: '2024-12-24', baseline: 82.0, optimized: 82.0, chargebackRate: 0.70 },
    { date: '2024-12-26', baseline: 82.1, optimized: 82.1, chargebackRate: 0.68 },
    { date: '2024-12-28', baseline: 82.3, optimized: 82.3, chargebackRate: 0.68 },
    { date: '2024-12-30', baseline: 82.2, optimized: 82.2, chargebackRate: 0.67 },
    { date: '2025-01-01', baseline: 82.3, optimized: 82.3, chargebackRate: 0.67 },
    { date: '2025-01-02', baseline: 82.0, optimized: 82.0, chargebackRate: 0.69, routingEnabled: true, note: 'Routing enabled' },
    { date: '2025-01-03', baseline: 82.2, optimized: 84.5, chargebackRate: 0.66 },
    { date: '2025-01-04', baseline: 82.4, optimized: 85.2, chargebackRate: 0.64 },
    { date: '2025-01-05', baseline: 82.1, optimized: 85.8, chargebackRate: 0.63 },
    { date: '2025-01-06', baseline: 82.3, optimized: 86.1, chargebackRate: 0.62 },
    { date: '2025-01-07', baseline: 82.2, optimized: 86.4, chargebackRate: 0.62 },
  ] as TimeSeriesDataPoint[],
  90: [
    { date: '2024-10-08', baseline: 80.5, optimized: 80.5, chargebackRate: 0.78 },
    { date: '2024-10-15', baseline: 80.7, optimized: 80.7, chargebackRate: 0.77 },
    { date: '2024-10-22', baseline: 80.9, optimized: 80.9, chargebackRate: 0.76 },
    { date: '2024-10-29', baseline: 81.0, optimized: 81.0, chargebackRate: 0.75 },
    { date: '2024-11-05', baseline: 81.2, optimized: 81.2, chargebackRate: 0.75 },
    { date: '2024-11-12', baseline: 81.3, optimized: 81.3, chargebackRate: 0.74 },
    { date: '2024-11-19', baseline: 81.4, optimized: 81.4, chargebackRate: 0.73 },
    { date: '2024-11-26', baseline: 81.5, optimized: 81.5, chargebackRate: 0.73 },
    { date: '2024-12-03', baseline: 81.6, optimized: 81.6, chargebackRate: 0.72 },
    { date: '2024-12-10', baseline: 81.7, optimized: 81.7, chargebackRate: 0.71 },
    { date: '2024-12-17', baseline: 81.9, optimized: 81.9, chargebackRate: 0.71 },
    { date: '2024-12-24', baseline: 82.0, optimized: 82.0, chargebackRate: 0.70 },
    { date: '2024-12-31', baseline: 82.1, optimized: 82.1, chargebackRate: 0.68 },
    { date: '2025-01-02', baseline: 82.0, optimized: 82.0, chargebackRate: 0.69, routingEnabled: true, note: 'Routing enabled' },
    { date: '2025-01-03', baseline: 82.2, optimized: 84.5, chargebackRate: 0.66 },
    { date: '2025-01-04', baseline: 82.4, optimized: 85.2, chargebackRate: 0.64 },
    { date: '2025-01-05', baseline: 82.1, optimized: 85.8, chargebackRate: 0.63 },
    { date: '2025-01-06', baseline: 82.3, optimized: 86.1, chargebackRate: 0.62 },
    { date: '2025-01-07', baseline: 82.2, optimized: 86.4, chargebackRate: 0.62 },
  ] as TimeSeriesDataPoint[],
};

export const routingDistributionBeforeAfter: RoutingDistribution[] = [
  { route: 'PSP A', before: 45, after: 38 },
  { route: 'PSP B', before: 35, after: 28 },
  { route: 'Local Acquirer', before: 15, after: 22 },
  { route: 'Alt Rail', before: 5, after: 12 },
];

export const signalCoverageSeries = {
  7: [
    { date: '2025-01-01', websiteContent: 320, checkoutFlow: 180, ugc: 95, productCatalog: 140, claimsLanguage: 75, geoLicensing: 48 },
    { date: '2025-01-02', websiteContent: 325, checkoutFlow: 185, ugc: 98, productCatalog: 145, claimsLanguage: 78, geoLicensing: 50 },
    { date: '2025-01-03', websiteContent: 330, checkoutFlow: 190, ugc: 100, productCatalog: 150, claimsLanguage: 80, geoLicensing: 52 },
    { date: '2025-01-04', websiteContent: 335, checkoutFlow: 195, ugc: 102, productCatalog: 155, claimsLanguage: 82, geoLicensing: 54 },
    { date: '2025-01-05', websiteContent: 340, checkoutFlow: 200, ugc: 105, productCatalog: 160, claimsLanguage: 85, geoLicensing: 56 },
    { date: '2025-01-06', websiteContent: 345, checkoutFlow: 205, ugc: 108, productCatalog: 165, claimsLanguage: 88, geoLicensing: 58 },
    { date: '2025-01-07', websiteContent: 350, checkoutFlow: 210, ugc: 110, productCatalog: 170, claimsLanguage: 90, geoLicensing: 60 },
  ] as SignalCoverageDataPoint[],
  30: [
    { date: '2024-12-08', websiteContent: 280, checkoutFlow: 150, ugc: 80, productCatalog: 120, claimsLanguage: 65, geoLicensing: 40 },
    { date: '2024-12-12', websiteContent: 285, checkoutFlow: 155, ugc: 82, productCatalog: 125, claimsLanguage: 67, geoLicensing: 42 },
    { date: '2024-12-16', websiteContent: 290, checkoutFlow: 160, ugc: 85, productCatalog: 130, claimsLanguage: 70, geoLicensing: 44 },
    { date: '2024-12-20', websiteContent: 295, checkoutFlow: 165, ugc: 88, productCatalog: 133, claimsLanguage: 72, geoLicensing: 46 },
    { date: '2024-12-24', websiteContent: 300, checkoutFlow: 170, ugc: 90, productCatalog: 136, claimsLanguage: 73, geoLicensing: 47 },
    { date: '2024-12-28', websiteContent: 310, checkoutFlow: 175, ugc: 92, productCatalog: 138, claimsLanguage: 74, geoLicensing: 48 },
    { date: '2025-01-01', websiteContent: 320, checkoutFlow: 180, ugc: 95, productCatalog: 140, claimsLanguage: 75, geoLicensing: 48 },
    { date: '2025-01-03', websiteContent: 330, checkoutFlow: 190, ugc: 100, productCatalog: 150, claimsLanguage: 80, geoLicensing: 52 },
    { date: '2025-01-05', websiteContent: 340, checkoutFlow: 200, ugc: 105, productCatalog: 160, claimsLanguage: 85, geoLicensing: 56 },
    { date: '2025-01-07', websiteContent: 350, checkoutFlow: 210, ugc: 110, productCatalog: 170, claimsLanguage: 90, geoLicensing: 60 },
  ] as SignalCoverageDataPoint[],
  90: [
    { date: '2024-10-08', websiteContent: 220, checkoutFlow: 120, ugc: 60, productCatalog: 95, claimsLanguage: 50, geoLicensing: 30 },
    { date: '2024-10-22', websiteContent: 230, checkoutFlow: 125, ugc: 63, productCatalog: 100, claimsLanguage: 52, geoLicensing: 32 },
    { date: '2024-11-05', websiteContent: 240, checkoutFlow: 130, ugc: 67, productCatalog: 105, claimsLanguage: 55, geoLicensing: 34 },
    { date: '2024-11-19', websiteContent: 250, checkoutFlow: 138, ugc: 72, productCatalog: 110, claimsLanguage: 58, geoLicensing: 36 },
    { date: '2024-12-03', websiteContent: 265, checkoutFlow: 145, ugc: 76, productCatalog: 115, claimsLanguage: 62, geoLicensing: 38 },
    { date: '2024-12-17', websiteContent: 280, checkoutFlow: 155, ugc: 82, productCatalog: 125, claimsLanguage: 67, geoLicensing: 42 },
    { date: '2024-12-31', websiteContent: 305, checkoutFlow: 172, ugc: 90, productCatalog: 137, claimsLanguage: 73, geoLicensing: 47 },
    { date: '2025-01-07', websiteContent: 350, checkoutFlow: 210, ugc: 110, productCatalog: 170, claimsLanguage: 90, geoLicensing: 60 },
  ] as SignalCoverageDataPoint[],
};

export const merchantsNeedingAttention: MerchantAlert[] = [
  {
    id: 'M-1847',
    name: 'TechGadgets Plus',
    riskScore: 87,
    riskTrend: 'up',
    lastScan: '2h ago',
    estUplift: '+4.2pp',
    triggers: ['High CB rate', 'Disputed claims', 'Geo mismatch'],
  },
  {
    id: 'M-2103',
    name: 'FashionHub EU',
    riskScore: 82,
    riskTrend: 'up',
    lastScan: '4h ago',
    estUplift: '+3.8pp',
    triggers: ['Policy change', 'UGC risk'],
  },
  {
    id: 'M-1652',
    name: 'GlobalMart Inc',
    riskScore: 76,
    riskTrend: 'stable',
    lastScan: '1h ago',
    estUplift: '+2.9pp',
    triggers: ['Checkout issues', 'High decline'],
  },
  {
    id: 'M-2891',
    name: 'HomeEssentials',
    riskScore: 74,
    riskTrend: 'down',
    lastScan: '3h ago',
    estUplift: '+2.5pp',
    triggers: ['Content flag', 'License check'],
  },
  {
    id: 'M-3047',
    name: 'SportZone Direct',
    riskScore: 71,
    riskTrend: 'up',
    lastScan: '5h ago',
    estUplift: '+3.1pp',
    triggers: ['Region block', 'High CB rate'],
  },
  {
    id: 'M-1928',
    name: 'BeautyBox Online',
    riskScore: 68,
    riskTrend: 'stable',
    lastScan: '2h ago',
    estUplift: '+1.8pp',
    triggers: ['Policy update', 'Claims risk'],
  },
  {
    id: 'M-2456',
    name: 'ElectroShop Pro',
    riskScore: 65,
    riskTrend: 'down',
    lastScan: '6h ago',
    estUplift: '+2.2pp',
    triggers: ['Checkout flow', 'Geo licensing'],
  },
  {
    id: 'M-3182',
    name: 'PetSupplies Co',
    riskScore: 62,
    riskTrend: 'stable',
    lastScan: '4h ago',
    estUplift: '+1.5pp',
    triggers: ['Content scan', 'Low approval'],
  },
];


