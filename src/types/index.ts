// 商品类型定义
export interface ProductInter{
  id: number;
  userId?: number;
  username?: string;
  title: string;
  contentBrief: string;
  imageUrl: string;
  type: number;
  status?: number;
  price: number;
  createTime?: string;
}

export type Products = Array<ProductInter>

// 交易类型定义

export interface TransactionRecord {
  id: number
  payerId:number
  payeeId:number
  postId:number
  status: number
  createTime: string
  imageUrl:string
  type:number
  title:string
}

export type Transactions = Array<TransactionRecord>