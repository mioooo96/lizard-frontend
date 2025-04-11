import {defineStore} from 'pinia'
import {ref,reactive,computed} from 'vue'
import axios from 'axios'
import {type ProductInter,type Products} from '@/types'
  


export const useProductsStore = defineStore('Products',()=>{
    // async function getProducts(){
    //     let products = await axios.get('url')
    // }  等待后端传递products参数
    //自定义的一些数据全部挪过来了，后续会改
    let products:Products = reactive([
        {
            id: 1,
            title: '九成新智能手机',
            price: 1200,
            unit: '台',
            description: '华为Mate40，保护完好，功能正常',
            image: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567',
            Ptype: "卖"
          },
          {
            id: 2,
            title: '星铁二手号',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img0.baidu.com/it/u=916732440,3057481842&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500',
            Ptype: "租"
          },
          {
            id: 2,
            title: '我的世界',
            price: 12,
            unit: '天',
            description: '游戏',
            image: 'https://img1.baidu.com/it/u=1964365371,1566431102&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            Ptype: "买"
          },
          {
            id: 2,
            title: 'It\'s MyGo!!!!!',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img2.baidu.com/it/u=1460146858,1748558553&fm=253&fmt=auto&app=120&f=JPEG?w=868&h=500',
            Ptype: "借"
          },
          {
            id: 2,
            title: 'Ave Mujica',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img0.baidu.com/it/u=522614871,2801739268&fm=253&fmt=auto&app=120&f=JPEG?w=866&h=500',
            Ptype: "租"
          }, 
          {
            id: 3,
            title: '二手数码相机',
            price: 1500,
            unit: '台',
            description: '佳能EOS 200D',
            image: 'https://img0.baidu.com/it/u=2751675099,3859055809&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
            Ptype: '买'
          },
          {
            id: 3,
            title: '西安电子科技大学',
            price: 150000000,
            unit: '所',
            description: '一所大专',
            image: 'https://pic.rmb.bdstatic.com/bjh/240424/news/c5b8f069d4bfff04db4661e8543fe24b7669.jpeg',
            Ptype: '买'
          }
    ])
    
    //
    function getProductsByPtype(Ptype:string){
        if(Ptype){
            const filteredProducts = computed(() => {
                return products.filter(item => item.Ptype === Ptype)
              })
            return filteredProducts
        } //按照Ptype筛选数据
        return  products//Ptype为空串的时候为首页 展示全部数据
    }

    return {products,getProductsByPtype }
})