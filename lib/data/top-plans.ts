export interface TopPlan {
  id: string;
  name: string;
  tag: string;
  type: string;
  link: string;
}

export const TOP_PLANS: TopPlan[] = [
  {
    id: 'jeevan-utsav',
    name: 'LIC Jeevan Utsav',
    tag: 'Lifetime Income',
    type: 'Whole Life Plan',
    link: '/products',
  },
  {
    id: 'star-gold-health',
    name: 'Star Gold Health',
    tag: 'Cashless Hospitalization',
    type: 'Health Floater',
    link: '/services/health-insurance',
  },
  {
    id: 'tech-term',
    name: 'LIC Tech-Term',
    tag: 'High Sum Assured',
    type: 'Pure Term Insurance',
    link: '/services/term-life',
  },
  {
    id: 'jeevan-umang',
    name: 'LIC Jeevan Umang',
    tag: '8% Lifetime Return',
    type: 'Whole Life Endowment',
    link: '/products',
  },
  {
    id: 'star-senior-red-carpet',
    name: 'Star Senior Citizen',
    tag: 'No Medical Screening',
    type: 'Senior Health Cover',
    link: '/services/health-insurance',
  },
  {
    id: 'children-money-back',
    name: "LIC New Children's Money Back",
    tag: 'Education Milestone',
    type: 'Child Savings Plan',
    link: '/services/child-planning',
  },
];
