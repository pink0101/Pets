Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  },
  data:{
  },
  methods:{
    onShareAppMessage: function () {
      return {
        title: '泊宠-上门宠物喂养',
      }
    },
    // 意见反馈
    feedback(){
      wx.navigateToMiniProgram({
        appId: 'wx8abaf00ee8c3202e',
        path: 'pages/index/index',
        extraData: {
          id:"176204"
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    },
    feedingrecords(){
      wx.navigateTo({
        url: '../Feedingrecords/Feedingrecords',
      })
    },
    feedingOrder(){
      wx.navigateTo({
        url: '../feedingOrder/feedingOrder',
      })
    }
  }
  
})
