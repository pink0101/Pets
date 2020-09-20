// miniprogram/pages/Appointmentdetails/Appointmentdetails.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Appointmentdetails:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.Appointmentdetails(options.id)
  },
  Appointmentdetails(id){
    db.collection('order').doc(id).get().then(res => {
      // res.data 包含该记录的数据
      // console.log(res.data)
        if(res.data.done == 1){
         res.data.done = '待支付'
        }else if(res.data.done == 2){
         res.data.done = '进行中'
        }else if(res.data.done == 3){
         res.data.done = '已完成'
        }
      this.setData({
        Appointmentdetails:res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})