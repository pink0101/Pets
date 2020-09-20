// pages/comment/comment.js

const db = wx.cloud.database() //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [], // 电影详情数据
    content: '', // 评价的内容
    score: '', //评价的分数
    images: [], //临时图片路径
    fileIds: [], // 文件的id
    movieId: -1
  },

  // 获取电影详情函数
  getComment: function(id) {
    console.log(id)
    wx: wx.showLoading({ // 提示用户正在加载中
      title: '加载中',
    })
    wx.cloud.callFunction({ // 调用云函数 进行获取数据
      name: 'getDetail',
      data: {
        movieid: id.moveid
      }
    }).then(res => {
      console.log(res)
      this.setData({ // 对data 中 detail 进行赋值
        detail: JSON.parse(res.result),
      })
      //加载成功后，隐藏正在加载
      wx.hideLoading()
    })
  },

  // 评论内容
  onContentChange: function(e) {
    this.setData({
      content: e.detail
    })
  },
  // 星星
  onScoreChange: function(e) {
    this.setData({
      score: e.detail
    })
  },

  // 上传图片
  uploadImg: function() {
    //选择图片
    wx.chooseImage({
      count: 9, // 选择图片的个数 最多选择9个
      sizeType: ['original', 'compressed'], // 图片以源文件或压缩文件
      sourceType: ['album', 'camera'], // 可选择相册 拍照
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths //小程序临时文件的路径
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },

  //提交评论
  submit: function() {
    wx.showLoading({
      title: '评论提交中',
    })
    // 上传图片到云存储
    let promiseArr = []
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i] // 每一个图片 临时路径
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({ //存储到云
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            })
            reslove();
          },
          fail: console.error
        })
      }))
    }
    // Promise.all 等待promiseArr 循环完毕， 开始执行
    Promise.all(promiseArr).then(res => {
      db.collection('comment').add({ // 将路径存储到数据库中
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          fileIds: this.data.fileIds
        }
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '评论成功',
        })
        wx.hideLoading()
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '评论失败',
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieId: options.moveid
    })
    console.log(options)
    this.getComment(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})