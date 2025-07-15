
import { ChatInterface } from '@/components/chat-interface';
import { getCategoryById } from '@/lib/categories';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChatPageProps {
  params: {
    category: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const category = getCategoryById(params.category);
  
  if (!category) {
    notFound();
  }

  // Generate a unique session ID
  const sessionId = `session-${category.id}-${Date.now()}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{category.name[0]}</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {category.name} Consultation
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 bg-gray-50">
        <ChatInterface 
          sessionId={sessionId}
          categoryId={category.id}
          categoryName={category.name}
        />
      </div>
    </div>
  );
}
