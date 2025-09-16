const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;        // generic data from API
  response?: T;    // alias for clarity in queries
}

export class ApiService {
  /**
   * Upload files to backend
   * API: POST /files/upload
   * FormData key: 'files'
   */
  static async uploadFiles(files: File[]): Promise<ApiResponse> {
    if (files.length === 0) return { success: false, error: 'No files selected' };

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      return { success: true, message: data.message || 'Files uploaded successfully', data };
    } catch (err) {
      console.error('Upload error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
    }
  }

  /**
   * Process selected files
   * API: POST /files/process
   * Body: { fileIds: string[] }
   */
  static async processSelectedFiles(fileIds: string[]): Promise<ApiResponse> {
    if (fileIds.length === 0) return { success: false, error: 'No file IDs provided' };

    try {
      const res = await fetch(`${API_BASE_URL}/files/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Processing failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      return { success: true, message: data.message || 'Files processed successfully', data };
    } catch (err) {
      console.error('Processing error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Processing failed' };
    }
  }

  /**
   * Submit query to AI
   * API: POST /query
   * Body: { query: string }
   */
  static async submitQuery(query: string): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Query failed: ${response.status} ${text}`);
      }

      const data = await response.text(); // plain text from backend
      return { success: true, data };      // store text in 'data'
    } catch (error) {
      console.error('Query error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Query failed' };
    }
  }
}
