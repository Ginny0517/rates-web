// 安全的日誌工具
const isDevelopment = process.env.NODE_ENV === 'development';
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';

export const logger = {
  // 一般日誌 - 生產環境也顯示
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  
  // 錯誤日誌 - 生產環境也顯示
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');
  },
  
  // 敏感數據日誌 - 只在明確啟用管理員模式時顯示
  debug: (message: string, data?: any) => {
    if (isAdminMode) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },
  
  // 匯率數據日誌 - 只在明確啟用管理員模式時顯示
  rates: (message: string, data?: any) => {
    if (isAdminMode) {
      console.log(`[RATES] ${message}`, data || '');
    }
  }
}; 