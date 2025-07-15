
import { MarketCategory } from './types';

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: 'home',
    name: 'Home',
    description: 'Residential audio-visual solutions for your living space',
    icon: 'Home',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Corporate meeting rooms and presentation systems',
    icon: 'Building2',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Dining ambiance and entertainment systems',
    icon: 'Utensils',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'gym',
    name: 'Gym',
    description: 'Fitness center audio and display solutions',
    icon: 'Dumbbell',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'worship',
    name: 'Worship',
    description: 'House of worship sound and visual systems',
    icon: 'Church',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Classroom and training facility solutions',
    icon: 'GraduationCap',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Entertainment venue and nightlife systems',
    icon: 'Music',
    color: 'from-pink-500 to-pink-600'
  }
];

export function getCategoryById(id: string): MarketCategory | undefined {
  return MARKET_CATEGORIES.find(category => category.id === id);
}

export function getCategoryByName(name: string): MarketCategory | undefined {
  return MARKET_CATEGORIES.find(category => category.name.toLowerCase() === name.toLowerCase());
}
