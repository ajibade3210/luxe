import type { LogContext, LogEntry, LoggerService } from "@/types";

const IS_PROD = process.env.NODE_ENV === "production";
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "secret",
  "cookie",
  "apikey",
]);

/**
 * Recursively redacts sensitive keys from log context payloads
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context || typeof context !== "object") return undefined;

  const sanitized: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as LogContext);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Normalizes any error or exception object into a structured format
 */
function extractErrorDetails(err: unknown): LogEntry["error"] | undefined {
  if (!err) return undefined;

  if (err instanceof Error) {
    const errorDetails: LogEntry["error"] = {
      name: err.name,
      message: err.message,
      stack: IS_PROD ? undefined : err.stack,
    };

    // Extract status and code if available (e.g. from ApiError)
    const errObj = err as unknown as Record<string, unknown>;
    if (typeof errObj.status === "number") {
      errorDetails.status = errObj.status;
    }
    if (typeof errObj.code === "string") {
      errorDetails.code = errObj.code;
    }

    return errorDetails;
  }

  if (typeof err === "string") {
    return { message: err };
  }

  return { message: JSON.stringify(err) };
}

function outputLog(entry: LogEntry): void {
  // In production, suppress debug and info logs to reduce noise
  if (IS_PROD && (entry.level === "debug" || entry.level === "info")) {
    return;
  }

  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;

  switch (entry.level) {
    case "debug":
      console.debug(prefix, entry.message, entry.context || "");
      break;
    case "info":
      console.info(prefix, entry.message, entry.context || "");
      break;
    case "warn":
      console.warn(prefix, entry.message, entry.error || "", entry.context || "");
      break;
    case "error":
      console.error(prefix, entry.message, entry.error || "", entry.context || "");
      break;
  }
}

class ClientLogger implements LoggerService {
  debug(message: string, context?: LogContext): void {
    outputLog({
      level: "debug",
      message,
      timestamp: new Date().toISOString(),
      context: sanitizeContext(context),
    });
  }

  info(message: string, context?: LogContext): void {
    outputLog({
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      context: sanitizeContext(context),
    });
  }

  warn(message: string, errorOrContext?: unknown, context?: LogContext): void {
    const isError =
      errorOrContext instanceof Error ||
      (typeof errorOrContext === "object" &&
        errorOrContext !== null &&
        ("message" in errorOrContext || "stack" in errorOrContext));

    const err = isError ? errorOrContext : undefined;
    const ctx = isError ? context : (errorOrContext as LogContext | undefined);

    outputLog({
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      error: extractErrorDetails(err),
      context: sanitizeContext(ctx),
    });
  }

  error(message: string, errorOrContext?: unknown, context?: LogContext): void {
    const isError =
      errorOrContext instanceof Error ||
      (typeof errorOrContext === "object" &&
        errorOrContext !== null &&
        ("message" in errorOrContext || "stack" in errorOrContext));

    const err = isError ? errorOrContext : undefined;
    const ctx = isError ? context : (errorOrContext as LogContext | undefined);

    outputLog({
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      error: extractErrorDetails(err),
      context: sanitizeContext(ctx),
    });
  }
}

export const logger: LoggerService = new ClientLogger();
