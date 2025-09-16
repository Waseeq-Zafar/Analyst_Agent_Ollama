import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Brain, Database } from 'lucide-react';

interface ProcessingStatusProps {
  stage: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  message?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stage, message }) => {
  const getStatusConfig = () => {
    switch (stage) {
      case 'uploading':
        return {
          icon: <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />,
          title: 'Uploading files...',
          description: 'Sending your dataset to the server',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'processing':
        return {
          icon: <Database className="w-8 h-8 text-purple-600" />,
          title: 'Processing files...',
          description: 'Preparing your dataset for analysis',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'analyzing':
        return {
          icon: <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />,
          title: 'AI Agent Thinking...',
          description: 'Analyzing your query and generating response',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          title: 'Processing completed!',
          description: 'Your dataset is ready for analysis',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-600" />,
          title: 'Processing failed',
          description: 'There was an error processing your dataset',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />,
          title: 'Processing...',
          description: 'Please wait',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`
        ${config.bgColor} ${config.borderColor} 
        border-2 rounded-xl p-8 text-center
      `}>
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            {config.icon}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-600">
              {message || config.description}
            </p>
          </div>

          {(stage === 'processing' || stage === 'analyzing') && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full animate-pulse ${
                  stage === 'analyzing' ? 'bg-indigo-600 w-4/5' : 'bg-purple-600 w-3/4'
                }`}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {stage === 'analyzing' ? 'Thinking...' : 'Processing...'}
                </span>
                <span>
                  {stage === 'analyzing' ? '80%' : '75%'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};