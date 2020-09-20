const db = wx.cloud.database()

Component({
  pageLifetimes: {
    // 组件所在页面的生命周期声明对象
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      // 调用获取首页店铺数据
      this.community_Arr()
      // 调用轮播图数据
      this.swiperArr()
    },
    
  },
  data: {
    indicatorDots:false,
    autoplay:true,
    interval:2000,
    duration:500,
    banners: null,
    currentSwiper:0, // 自定义的 swiper 指示器索引
    scroll_Top:0,
    community_Arr:[],
    changeType:0,
  },
  // 组件生命周期
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods:{
    // 获取首页店铺数据
    community_Arr(){
      wx.cloud.callFunction({
        name: 'index_community_Arr',
        complete: res => {
          // console.log(res.result.data)
          this.setData({
            community_Arr:res.result.data
          })
        }
      })
    },
    // 跳转介绍
    introduce(){
      wx.navigateTo({
        url: '/pages/introduce/introduce',
      })
    },
    // 跳转简介
    wmdgs(e){
      console.log(e.currentTarget.dataset.id)
      if(e.currentTarget.dataset.id == 0){
        wx.navigateTo({
          url: '/pages/introduce/introduce',
        })
      }
    },
    swiperArr(){
      wx.cloud.callFunction({
        name: 'swiperArr',
        complete: res => {
          // console.log(res.result.data[0].swiper)
          this.setData({
            banners:res.result.data[0].swiper
          })
        }
      })
    },
    // 自定义 swiper 指示器
    swiperChange: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      })
    },
    // 顶部随着页面滚动展示
    onPageScroll(e){
      let scrollTop = e.scrollTop / 300
      // console.log(e.scrollTop / 300)
      // console.log(scrollTop.toFixed(1))

      if (this.data.scroll_Top !== scrollTop.toFixed(1) && scrollTop.toFixed(1) <= 0.8){
        this.setData({
          scroll_Top: scrollTop.toFixed(1),
          changeType:0,
        })
      } else if (scrollTop.toFixed(1) > 0.8){
        this.setData({
          scroll_Top: 1, // 改变顶部的透明度
          changeType:1,// 改变顶部和筛选的状态
        })
      }
    },
    // 跳转店铺数据
    details(e){
      // console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: "/pages/details/details?id="+ e.currentTarget.dataset.id,
      })
    },
    onShareAppMessage: function () {
      return {
        title: '泊宠-上门宠物喂养',
      }
    },
    onShareTimeline(){
      return{
        title:'泊宠-上门宠物喂养',
      }
    }
  },
})
