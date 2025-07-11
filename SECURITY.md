# 安全說明

## 日誌管理

本專案已實施安全的日誌管理系統，避免在生產環境中暴露敏感數據。

### 日誌類型

1. **一般日誌 (info)** - 生產環境可見
   - 基本操作資訊
   - 不包含敏感數據

2. **錯誤日誌 (error)** - 生產環境可見
   - 錯誤和異常資訊
   - 用於問題診斷

3. **調試日誌 (debug)** - 僅開發環境或管理員模式可見
   - 包含敏感數據
   - 匯率計算詳細資訊
   - API 請求/回應數據

4. **匯率日誌 (rates)** - 僅開發環境可見
   - 實時匯率數據
   - 用於開發調試

### 環境變數設定

```bash
# 開發環境
NODE_ENV=development

# 管理員模式（可選）
NEXT_PUBLIC_ADMIN_MODE=true
```

### 安全建議

1. **生產環境**：
   - 確保 `NEXT_PUBLIC_ADMIN_MODE` 未設定或設為 `false`
   - 敏感數據不會在 console 中顯示

2. **開發環境**：
   - 可以啟用 `NEXT_PUBLIC_ADMIN_MODE=true` 來查看詳細日誌
   - 僅在需要調試時啟用

3. **部署前檢查**：
   - 確認沒有敏感數據會暴露給一般用戶
   - 檢查所有 console.log 已替換為安全的日誌工具

### 日誌工具使用

```typescript
import { logger } from '@/utils/logger';

// 一般資訊
logger.info('操作完成');

// 錯誤資訊
logger.error('發生錯誤', error);

// 調試資訊（僅開發環境）
logger.debug('敏感數據', data);

// 匯率資訊（僅開發環境）
logger.rates('匯率數據', rate);
``` 