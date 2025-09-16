import React from 'react';
import { MessageCircle, Copy, Brain } from 'lucide-react';
import { QueryResponse } from '../types';

interface ResponseDisplayProps {
  responses: QueryResponse[];
  isLoading: boolean;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  responses,
  isLoading
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {responses.map((response) => (
        <div key={response.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Query */}
          <div className="p-4 bg-gray-50 rounded-t-xl border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{response.query}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatTimestamp(response.timestamp)}
                </p>
              </div>
            </div>
          </div>

          {/* Response */}
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {response.response}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => copyToClipboard(response.response)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy response</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-gray-600 font-medium">AI agent is thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};