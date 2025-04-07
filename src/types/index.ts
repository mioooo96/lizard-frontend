// 定义一个接口，限制对象的具体属性
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