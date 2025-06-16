export const translations = {
  'zh-TW': {
    loading: '載入中...',
    error: '載入失敗，請稍後再試',
    currency: '選擇貨幣',
    paymentMethod: '支付方式',
    amount: '輸入金額',
    result: '可換得：{amount} LAK',
    lastUpdate: '最近更新：{time}',
    '現金': '現金',
    '轉帳': '轉帳',
    '支付寶/微信': '支付寶/微信',
    '街口支付/全支付/轉帳': '街口支付/轉帳'
  },
  'zh-CN': {
    loading: '加载中...',
    error: '加载失败，请稍后重试',
    currency: '选择货币',
    paymentMethod: '支付方式',
    amount: '输入金额',
    result: '可兑换：{amount} LAK',
    lastUpdate: '最近更新：{time}',
    '現金': '现金',
    '轉帳': '转账',
    '支付寶/微信': '支付宝/微信',
    '街口支付/全支付/轉帳': '街口支付/转账'
  },
  'lo': {
    loading: 'ກຳລັງໂຫຼດ...',
    error: 'ໂຫຼດລົ້ມເຫລວ, ກະລຸນາລອງໃໝ່ພາຍຫຼັງ',
    currency: 'ເລືອກສະກຸນເງິນ',
    paymentMethod: 'ວິທີການຊຳລະເງິນ',
    amount: 'ປ້ອນຈຳນວນເງິນ',
    result: 'ຈະໄດ້ຮັບ: {amount} LAK',
    lastUpdate: 'ອັບເດດຫຼ້າສຸດ: {time}',
    '現金': 'ເງິນສົດ',
    '轉帳': 'ໂອນເງິນ',
    '支付寶/微信': 'Alipay/WeChat',
    '街口支付/全支付/轉帳': 'JKOPAY/ໂອນເງິນ'
  },
  'en': {
    loading: 'Loading...',
    error: 'Failed to load, please try again later',
    currency: 'Select Currency',
    paymentMethod: 'Payment Method',
    amount: 'Enter Amount',
    result: 'You will get: {amount} LAK',
    lastUpdate: 'Last Update: {time}',
    '現金': 'Cash',
    '轉帳': 'Transfer',
    '支付寶/微信': 'Alipay/WeChat',
    '街口支付/全支付/轉帳': 'JKOPAY/Transfer'
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['zh-TW']; 