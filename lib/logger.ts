type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  route: string
  message: string
  error?: string
  ip?: string
}

function log(level: LogLevel, route: string, message: string, extra?: Record<string, unknown>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    route,
    message,
    ...extra,
  }
  if (level === 'error') console.error(JSON.stringify(entry))
  else console.log(JSON.stringify(entry))
}

export const logger = {
  info:  (route: string, msg: string, extra?: Record<string, unknown>) => log('info',  route, msg, extra),
  warn:  (route: string, msg: string, extra?: Record<string, unknown>) => log('warn',  route, msg, extra),
  error: (route: string, msg: string, extra?: Record<string, unknown>) => log('error', route, msg, extra),
}
