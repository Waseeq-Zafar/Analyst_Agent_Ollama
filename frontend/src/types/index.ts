export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  selected?: boolean;
}

export interface QueryResponse {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  visualizations?: Visualization[];
}

export interface Visualization {
  id: string;
  type: 'chart' | 'graph' | 'table' | 'image';
  title: string;
  data: any;
  imageUrl?: string;
}

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  path: string;
}

export type WorkflowStage = 'upload' | 'select' | 'processing' | 'ready' | 'querying';