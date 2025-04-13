// 商品类型定义
export interface ProductInter{
    id: number
    title: string
    price: number
    unit: string
    description: string
    image: string
    Ptype: string
}

export type Products = Array<ProductInter>

// 交易类型定义
export type TransactionType = '买卖' | '租借'
export type TransactionStatus = '可交易' | '待交易' | '交易成功' | '交易失败'

export interface TransactionRecord {
  type: TransactionType
  status: TransactionStatus
  image: string
  productName: string
  time: number
}

export type Transactions = Array<TransactionRecord>