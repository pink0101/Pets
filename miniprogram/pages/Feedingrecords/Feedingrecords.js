// miniprogram/pages/Feedingrecords/Feeding records.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedingOrder:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取喂养数据
    this.inquiryAppointment()
  },
  inquiryAppointment(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'inquiryAppointment',
      data:{
        // done:3
      }
    }).then((res)=>{
      
      this.setData({
        feedingOrder:res.result.data
      })
      wx.hideLoading()
    })
  },
  details(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../Appointmentdetails/Appointmentdetails?id='+e.currentTarget.dataset.id,
    })
  },
  phone(){
    wx.makePhoneCall({
      phoneNumber: '18192237702'
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