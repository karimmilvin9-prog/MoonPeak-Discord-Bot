type LogContext = Record<string, unknown>;

const write = (level: "info" | "warn" | "error", message: string, context?: LogContext) => {
  const suffix = context ? ` ${JSON.stringify(context)}` : "";
  const line = `[MoonPeak] ${message}${suffix}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
};

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};