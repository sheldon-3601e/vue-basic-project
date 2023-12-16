import request from '@/utils/request'

// 加入购物车
/**
 *
 * @param goodsId 商品id
 * @param goodsNum 商品数量
 * @param goodsSkuId 商品规格id
 */
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}
