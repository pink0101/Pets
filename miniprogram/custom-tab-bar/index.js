Component({
  data: {
    selected: 0,
    color: "#000000",
    selectedColor: "#000000",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/image/icon-index.png",
      selectedIconPath: "/image/icon-index-selected.png",
      text: "首页"
    }, {
      pagePath: "/pages/index/index2",
      iconPath: "/image/icon-index2.png",
      selectedIconPath: "/image/icon-index2-selected.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTabs(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})