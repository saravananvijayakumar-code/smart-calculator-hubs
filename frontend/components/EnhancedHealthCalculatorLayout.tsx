import React, { ReactNode } from 'react';
import NativeBanner from './ads/NativeBanner';

interface EnhancedHealthCalculatorLayoutProps {
  children?: ReactNode;
  title: string;
  description: string;
  icon?: ReactNode;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  calculatorContent?: ReactNode;
  educationalContent?: ReactNode;
}

export default function EnhancedHealthCalculatorLayout({
  children,
  title,
  description,
  icon,
  calculatorContent,
  educationalContent
}: EnhancedHealthCalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Native Banner 1 - Top */}
        <div className="mb-6">
          <NativeBanner position="top" />
        </div>
        {/* Header with Icon Animation */}
        <div className="text-center mb-8 animate-fade-in">
          {icon && (
            <div className="flex justify-center mb-4">
              <div className="animate-bounce-slow">
                {icon}
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-12 space-y-6">
            {/* Main Calculator Content */}
            <div className="space-y-6">
              {calculatorContent || children}
            </div>

            {/* Native Banner 2 - Middle */}
            <div className="my-8">
              <NativeBanner position="middle" />
            </div>
          </div>
        </div>

        {/* Educational Content */}
        {educationalContent && (
          <div className="mt-8">
            {educationalContent}
          </div>
        )}

        {/* Native Banner 3 - Bottom */}
        <div className="mt-8">
          <NativeBanner position="bottom" />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
