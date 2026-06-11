export interface GoalService {
  id: string;
  title: string;
  description: string;
  color: string;
  link: string;
  iconName: string;
}

export const GOAL_SERVICES: GoalService[] = [
  {
    id: 'life-protection',
    title: 'Life Protection',
    description: 'Ensure your family is financially secure if your income stops.',
    color: 'blue',
    link: '/services/life-insurance',
    iconName: 'Shield',
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance',
    description: 'Cover high hospital expenses and cashless treatment network.',
    color: 'red',
    link: '/services/health-insurance',
    iconName: 'HeartPulse',
  },
  {
    id: 'retirement',
    title: 'Retirement Income',
    description: 'Build a steady stream of lifetime pension after you retire.',
    color: 'orange',
    link: '/services/retirement',
    iconName: 'Landmark',
  },
  {
    id: 'child-planning',
    title: 'Child Plans',
    description: 'Secure funds for higher education and marriage milestones.',
    color: 'green',
    link: '/services/child-planning',
    iconName: 'GraduationCap',
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning',
    description: 'Save tax efficiently under Section 80C and Section 80D.',
    color: 'indigo',
    link: '/services/tax-planning',
    iconName: 'Calculator',
  },
  {
    id: 'keyman-insurance',
    title: 'Keyman Insurance',
    description: 'Shield your enterprise against loss of vital business heads.',
    color: 'purple',
    link: '/services/keyman-insurance',
    iconName: 'Building2',
  },
];
