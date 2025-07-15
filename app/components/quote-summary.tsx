
'use client';

import { Quote, QuoteItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Mail, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuoteSummaryProps {
  quote: Quote & {
    quote_items: (QuoteItem & {
      product: {
        id: string;
        name: string;
        description: string;
        retail_price: number;
      };
    })[];
  };
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onEmailQuote?: () => void;
  isLoading?: boolean;
}

export function QuoteSummary({ 
  quote, 
  onRemoveItem, 
  onUpdateQuantity, 
  onEmailQuote, 
  isLoading 
}: QuoteSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalItems = quote.quote_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Quote Summary
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in your quote
              </CardDescription>
            </div>
            <Badge className={getStatusColor(quote.status)}>
              {quote.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quote.quote_items?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No items in your quote yet</p>
                <p className="text-sm">Add products from recommendations above</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {quote.quote_items?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.description}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ${item.unit_price.toLocaleString()} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {onUpdateQuantity && (
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1 || isLoading}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${item.total_price.toLocaleString()}
                          </p>
                        </div>
                        {onRemoveItem && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRemoveItem(item.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${quote.total_amount?.toLocaleString() || '0'}
                  </span>
                </div>
                
                {onEmailQuote && (
                  <Button
                    onClick={onEmailQuote}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Email Quote'}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
