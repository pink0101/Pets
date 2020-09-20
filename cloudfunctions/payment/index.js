// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "泊宠-宠物喂养", 
    "outTradeNo" : `${Date.now().toString().slice(3)}`, // 订单号 不能重复 **
    "spbillCreateIp" : "127.0.0.1", // 云函数 ip
    "subMchId" : "1601053782", // 商户id
    "totalFee" : event.money, // 金额 单位 分
    "envId": "pink-pc4mv", // 云开发环境
    "functionName": "pay_cb", // 回调云函数
    "nonceStr":"5K826LTKCH6CQ2502SI8ZNMTM67VS", // 随机字符串
    "trade_type":"JSAPI" // 必填项  默认是 JSAPI
  })
  return res
}
