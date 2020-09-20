// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 向数据库 查询
    const result = await db.collection('order').where({
      _openid: event.userInfo.openId,
      done: event.done,
    })
    .orderBy('done', 'asc')
    .get({})
    return result
    
  } catch (error) {
    
  }
}