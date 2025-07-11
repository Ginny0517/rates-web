// 安全的日誌工具
const isDev = process.env.NODE_ENV !== 'production';
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'rates';
interface LogMsg { 
  msg: string; 
  meta?: Record<string, unknown>; 
}

export const logger = (level: LogLevel, { msg, meta = {} }: LogMsg) => {
  // 一般日誌和錯誤日誌 - 開發環境顯示
  if (level === 'info' || level === 'warn' || level === 'error') {
    if (isDev) {
      // eslint-disable-next-line no-console
      console[level](`[${level.toUpperCase()}] ${msg}`, meta);
    }
  }
  
  // 敏感數據日誌 - 只在管理員模式顯示
  if (level === 'debug' || level === 'rates') {
    if (isAdminMode) {
      // eslint-disable-next-line no-console
      console.log(`[${level.toUpperCase()}] ${msg}`, meta);
    }
  }
}; 