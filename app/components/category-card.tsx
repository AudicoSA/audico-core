
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarketCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: MarketCategory;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const router = useRouter();
  
  const IconComponent = Icons[category.icon as keyof typeof Icons] as any;
  
  const handleSelect = () => {
    router.push(`/chat/${category.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-4">
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {category.name}
          </CardTitle>
          <CardDescription className="text-gray-600 leading-relaxed">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={handleSelect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Start Consultation
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
