
import { CategoryCard } from '@/components/category-card';
import { MARKET_CATEGORIES } from '@/lib/categories';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Audico</h1>
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">
              AI-Powered Audio-Visual Consultation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Audio-Visual Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized recommendations and instant quotes for your audio-visual needs across multiple market categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKET_CATEGORIES.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index} 
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              © 2024 Audico. Professional audio-visual consultation system.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
