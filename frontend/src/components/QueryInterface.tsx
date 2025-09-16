import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';

interface QueryInterfaceProps {
  onSubmitQuery: (query: string, response?: string) => void;
  isLoading?: boolean;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({
  onSubmitQuery,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const suggestedQueries = [
    "What are the main patterns in this dataset?",
    "Generate a summary of key statistics",
    "Show me correlation analysis",
    "Create visualizations for the data",
    "What insights can you provide?",
    "Identify any anomalies or outliers"
  ];

  // Send query to backend
  const handleSend = async () => {
    if (!query.trim()) return;

    setLocalLoading(true);

    try {
      const result = await ApiService.submitQuery(query.trim());

      if (result.success && result.data) {
        onSubmitQuery(query.trim(), result.data); // use result.data
      } else {
        alert(result.error || 'Server error during query');
      }
    } catch (err) {
      alert('Server error during query');
    } finally {
      setLocalLoading(false);
      setQuery(''); // clear textarea after send
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestedQueryClick = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Ask about your data</h3>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any question about your dataset, request visualizations, or get insights..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={3}
              disabled={localLoading || isLoading}
            />

            <button
              type="submit"
              disabled={!query.trim() || localLoading || isLoading}
              className="absolute bottom-3 right-3 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Suggested queries:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestedQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQueryClick(suggestedQuery)}
                  disabled={localLoading || isLoading}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestedQuery}
                </button>
              ))}
            </div>
          </div>

          {localLoading && (
            <div className="mt-4 flex items-center space-x-2 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing your query...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
