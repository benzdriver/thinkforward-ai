declare global {
  interface Error {
    title?: string;
    code?: number;
    metadata?: Record<string, unknown>;
  }
} 