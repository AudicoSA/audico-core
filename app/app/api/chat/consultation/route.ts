
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage, Quote, QuoteItem, ProductRecommendation } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Package, FileText } from 'lucide-react';
import { ProductRecommendationComponent } from '@/components/product-recommendation';
import { QuoteSummary } from '@/components/quote-summary';

interface ChatInterfaceProps {
  sessionId: string;
  categoryId: string;
  categoryName: string;
}

export function ChatInterface({ sessionId, categoryId, categoryName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      type: 'assistant',
      content: `Welcome to your ${categoryName} audio-visual consultation! I'm here to help you find the perfect solutions for your needs. What would you like to know about?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    
    // Initialize quote
    initializeQuote();
  }, [categoryName]);

  // Initialize or get existing quote
  const initializeQuote = async () => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, categoryId }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentQuote(data.quote);
      }
    } catch (error) {
      console.error('Error initializing quote:', error);
    }
  };

  // Add product to quote
  const addToQuote = async (productId: string) => {
    if (!currentQuote) return;
    
    setIsLoadingQuote(true);
    try {
      const response = await fetch('/api/quotes/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: currentQuote.id,
          productId,
          quantity: 1,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Refresh quote
        await initializeQuote();
        setShowQuote(true);
        
        // Add success message
        const successMessage: ChatMessage = {
          id: `success-${Date.now()}`,
          type: 'assistant',
          content: `Great! I've added "${data.item.product.name}" to your quote. You can review your quote below.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Error adding to quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Remove item from quote
  const removeFromQuote = async (itemId: string) => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch(`/api/quotes/items?itemId=${itemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await initializeQuote();
      }
    } catch (error) {
      console.error('Error removing from quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Get product recommendations
  const getProductRecommendations = async (userMessage: string) => {
    try {
      const conversationContext = messages.map(msg => msg.content).join('\n');
      const response = await fetch('/api/products/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          conversationContext,
          userRequirements: userMessage,
        }),
      });
      const data = await response.json();
      return data.success ? data : null;
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      // Get conversation history (excluding the current user message)
      const conversationHistory = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await fetch('/api/chat/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          categoryId,
          message: currentInput,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Stream finished - add final message
                if (accumulatedResponse.trim()) {
                  // Get product recommendations if the conversation suggests it
                  const shouldGetRecommendations = accumulatedResponse.toLowerCase().includes('recommend') || 
                                                   accumulatedResponse.toLowerCase().includes('suggest') ||
                                                   accumulatedResponse.toLowerCase().includes('product') ||
                                                   currentInput.toLowerCase().includes('recommend') ||
                                                   currentInput.toLowerCase().includes('suggest') ||
                                                   currentInput.toLowerCase().includes('need') ||
                                                   currentInput.toLowerCase().includes('looking for');

                  let productRecommendations = null;
                  if (shouldGetRecommendations) {
                    productRecommendations = await getProductRecommendations(currentInput);
                  }

                  const aiResponse: ChatMessage = {
                    id: `assistant-${Date.now()}`,
                    type: 'assistant',
                    content: accumulatedResponse.trim(),
                    timestamp: new Date().toISOString(),
                    products: productRecommendations?.products || undefined
                  };
                  setMessages(prev => [...prev, aiResponse]);
                }
                setStreamingMessage('');
                setIsLoading(false);
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.content || '';
                if (content) {
                  accumulatedResponse += content;
                  setStreamingMessage(accumulatedResponse);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      setStreamingMessage('');
      
      // Show error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-2 block ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </CardContent>
                </Card>
                
                {/* Product Recommendations */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-4 w-full max-w-none">
                    <div className="flex items-center space-x-2 mb-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Recommended Products</h3>
                    </div>
                    <ProductRecommendationComponent 
                      products={message.products}
                      onAddToQuote={addToQuote}
                      isLoading={isLoadingQuote}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Streaming message */}
        {streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed">{streamingMessage}</p>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Loading indicator when no streaming message */}
        {isLoading && !streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quote Summary */}
      {currentQuote && (showQuote || (currentQuote.quote_items && currentQuote.quote_items.length > 0)) && (
        <div className="p-4 border-t bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <QuoteSummary
              quote={currentQuote as Quote & {
                quote_items: (QuoteItem & {
                  product: {
                    id: string;
                    name: string;
                    description: string;
                    retail_price: number;
                  };
                })[];
              }}
              onRemoveItem={removeFromQuote}
              isLoading={isLoadingQuote}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            {/* Quote Toggle Button */}
            {currentQuote && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuote(!showQuote)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-4 h-4 mr-1" />
                {showQuote ? 'Hide' : 'Show'} Quote
                {currentQuote.quote_items && currentQuote.quote_items.length > 0 && (
                  <span className="ml-1 bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
                    {currentQuote.quote_items.length}
                  </span>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
