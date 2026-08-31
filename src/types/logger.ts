export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name?: string;
    message: string;
    stack?: string;
    status?: number;
    code?: string;
  };
}

export interface LoggerService {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, errorOrContext?: unknown, context?: LogContext) => void;
  error: (message: string, errorOrContext?: unknown, context?: LogContext) => void;
}
