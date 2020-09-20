// pages/details.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    currentSwiper: 0, // 自定义的 swiper 指示器索引
    storeDetails:null,// 门店详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    // 获取门店详情数据
    this.storeDetails(options.id)
  },
  storeDetails(id){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'ID_query',
      // 传给云函数的参数
      data: {
        database: 'community_Arr',
        id: id,
      },
    })
    .then(res => {
      // console.log(res.result.data)
      this.setData({
        storeDetails:res.result.data
      })
    })
    .catch(console.error)
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  back_index() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 自定义 swiper 指示器
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  phone(){
    let _this = this
    wx.makePhoneCall({
      phoneNumber: _this.data.storeDetails.phone + '',
    })
  },
  // 预约喂养
  AppointmentFeeding(e) {
    // console.log(e.target.dataset.id)
    wx.navigateTo({
      url: "/pages/AppointmentFeeding/AppointmentFeeding?id=" + e.target.dataset.id,
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