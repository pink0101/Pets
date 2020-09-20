Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
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
  }
})