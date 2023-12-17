import request from '@/utils/request'

// 订单结算的通用接口
// mode: buyNow  => obj{goodsId, goodsNum, goodsSkuId}
// mode: cart  => obj{cartIdS}
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // buyNow:立即购买 cart:购物车结算
      ...obj,
      delivery: 10,
      couponId: 0,
      isUsePoints: 0
    }
  })
}

// 提交订单
// mode: buyNow  => obj{goodsId, goodsNum, goodsSkuId, remark}
// mode: cart  => obj{cartIdS, remark}
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    ...obj,
    delivery: 10,
    couponId: 0,
    isUsePoints: 0,
    payType: 10
  })
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
