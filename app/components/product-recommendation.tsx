
'use client';

import { ProductRecommendation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductRecommendationProps {
  products: ProductRecommendation[];
  explanation?: string;
  onAddToQuote: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductRecommendationComponent({ 
  products, 
  explanation, 
  onAddToQuote, 
  isLoading 
}: ProductRecommendationProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⭐';
      case 'low': return '💡';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-4">
      {explanation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">{explanation}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </CardDescription>
                  </div>
                  {product.priority && (
                    <Badge className={`ml-2 ${getPriorityColor(product.priority)}`}>
                      {getPriorityIcon(product.priority)} {product.priority}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-bold text-gray-900">
                        ${product.retail_price?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.pricelist?.name}
                    </span>
                  </div>
                  
                  {product.recommendation_reason && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Why recommended:</strong> {product.recommendation_reason}
                      </p>
                    </div>
                  )}
                  
                  {product.content && (
                    <p className="text-sm text-gray-600">{product.content}</p>
                  )}
                  
                  <Button
                    onClick={() => onAddToQuote(product.id)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isLoading ? 'Adding...' : 'Add to Quote'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
