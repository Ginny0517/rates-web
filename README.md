# 老撾基普 (LAK) 即時換匯報價前端

這是一個使用 Next.js 開發的即時換匯報價網站，專注於提供老撾基普 (LAK) 與其他主要貨幣（USD/CNY/TWD）之間的即時匯率資訊和換匯計算功能。

## 🎯 專案目標

- 提供即時、準確的匯率報價
- 讓使用者能夠快速計算換匯金額
- 支援響應式設計，確保在各種裝置上都能完美呈現
- 提供深色模式支援，優化使用體驗

## ✨ 主要功能

### 匯率報價展示
- 即時顯示 USD、CNY、TWD 對 LAK 的匯率
- 支援不同支付方式（現金、支付寶/微信支付）
- 自動更新最新匯率資訊

### 換匯計算器
- 支援多幣別輸入（USD/CNY/TWD）
- 即時計算可兌換的 LAK 金額
- 優化輸入體驗（防抖動處理）

### 使用者體驗
- 響應式設計，完美支援手機和桌面裝置
- 深色模式支援
- 清晰的匯率更新時間顯示

## 🛠 技術架構

- **前端框架**: Next.js 14
- **樣式解決方案**: Tailwind CSS
- **狀態管理**: React Hooks + SWR
- **字體**: Noto Sans TC
- **部署**: Vercel（推薦）

## 🚀 快速開始

1. 克隆專案
```bash
git clone [repository-url]
cd rates-web
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 啟動開發伺服器
```bash
npm run dev
# 或
yarn dev
```

4. 開啟瀏覽器訪問 `http://localhost:3000`

## 📱 響應式設計

- 桌面版：完整表格展示
- 手機版（≤640px）：卡片式排版
- 支援深色模式切換

## 🎨 設計規範

### 配色方案
- 主色：`#2563EB` (Tailwind blue-600)
- 副色：`#FACC15` (amber-400)
- 支援深色模式

### 字體
- 主要字體：Noto Sans TC
- 備用字體：系統字體

## 📝 開發指南

### 專案結構
```
rates-web/
 ├─ app/                # Next.js 應用程式目錄
 ├─ components/         # React 元件
 ├─ lib/               # 工具函數和 hooks
 ├─ public/            # 靜態資源
 └─ styles/            # 全局樣式
```

### 開發注意事項
1. 遵循 Next.js 的檔案路由規則
2. 使用 Tailwind CSS 進行樣式開發
3. 確保所有元件都支援 RWD
4. 實作深色模式支援


