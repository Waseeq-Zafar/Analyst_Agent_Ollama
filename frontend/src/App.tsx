import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import { QueryInterface } from './components/QueryInterface';
import { ResponseDisplay } from './components/ResponseDisplay';
import { QueryResponse, WorkflowStage } from './types';
import { ApiService } from './services/api';

function App() {
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResponses, setQueryResponses] = useState<QueryResponse[]>([]);

  // Triggered after successful upload
  const handleUploadComplete = useCallback(() => {
    setWorkflowStage('ready');
  }, []);

  // Handle query submission using real API
  const handleSubmitQuery = useCallback(async (query: string) => {
    setIsQuerying(true);
    setWorkflowStage('querying');

    try {
      const result = await ApiService.submitQuery(query);

      if (result.success && result.data) {
        const newResponse: QueryResponse = {
          id: crypto.randomUUID(),
          query,
          response: result.data, // use backend response
          timestamp: new Date(),
        };
        setQueryResponses(prev => [...prev, newResponse]);
      } else {
        alert(result.error || 'Server error during query');
      }
    } catch (err) {
      console.error('Query failed:', err);
      alert('Server error during query');
    } finally {
      setIsQuerying(false);
      setWorkflowStage('ready');
    }
  }, []);

  // Reset workflow
  const handleStartOver = () => {
    setWorkflowStage('upload');
    setQueryResponses([]);
    setIsProcessing(false);
    setIsQuerying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      {/* Header */}
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">DataAnalyzer AI</h1>
        {(workflowStage === 'ready' || workflowStage === 'querying') && (
          <button
            onClick={handleStartOver}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Upload Stage */}
      {workflowStage === 'upload' && (
        <FileUpload
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Analyze / Query Stage */}
      {workflowStage === 'ready' && (
        <div className="w-full max-w-4xl flex flex-col space-y-4">
          <QueryInterface onSubmitQuery={handleSubmitQuery} isLoading={isQuerying} />
          {queryResponses.length > 0 && (
            <ResponseDisplay responses={queryResponses} isLoading={isQuerying} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
