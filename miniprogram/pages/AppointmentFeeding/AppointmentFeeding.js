// pages/AppointmentFeeding.js
// 初始化数据库
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    show: false,
    show1: false,
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      if (day.type === 'start') {
        day.bottomInfo = '开始喂养';
      } else if (day.type === 'end') {
        day.bottomInfo = '结束喂养';
      }
      return day;
    },
    columns: ['一天上门1次','二天上门一次', '三天上门一次'],
    FeedingFrequency:'一天上门1次',// 喂养频率
    fileList: [], // 宠物照片 及 防疫照片的临时照片
    delDBData: [], //云存储中要被删除的文件列表
    user_name:'',// 预约姓名
    err_user_name: '',// 姓名格式错误的提示信息
    phone:'',// 预约手机号
    err_phone:"",// 手机号码格式错误的提示信息
    Pets_name:'',// 宠物姓名
    err_Pets_name: '',// 宠物姓名格式错误的提示信息
    err_feed_date:'', // 喂养时间为空
    err_feed_frequency: '',// 喂养频率为空
    pets_Photo:[],// 宠物照片id
    differenceDate:0,// 总共的日期天数
    differenceDate_cs:0, // 总喂养次数
    Feedingtimes:1,// 喂养次数
    money:0,// 金额
    shop_arr:null, // 店铺相关数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.shop_arr(options.id)
  },
  // 获取店铺相关数据
  shop_arr(id){
    wx.showLoading({
      title: '加载中',
      icon:'none',
    })
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
        shop_arr:res.result.data
      })
      wx.hideLoading()
    })
    .catch(console.error)
  },
  // 数据校验
  user_name(e) {
    this.setData({ user_name:e.detail})
    if(this.data.user_name.trim() == ''){
      this.setData({ err_user_name:'姓名不能为空'})
    }else{
      this.setData({ err_user_name: '' })
    }
  },
  // 数据校验
  Pets_name(e) {
    this.setData({ Pets_name: e.detail })
    if (this.data.Pets_name.trim() == '') {
      this.setData({ err_Pets_name: '宠物姓名不能为空' })
    } else {
      this.setData({ err_Pets_name: '' })
    }
  },
  // 数据校验
  phone(e) {
    this.setData({ phone: e.detail.value })
    var myreg = /^[1][0-9]{10}$/
    if (!myreg.test(this.data.phone)) {
      this.setData({ err_phone: '手机号码格式有误' })
    } else {
      this.setData({ err_phone: '' })
    }
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
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 日期转化
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  // 计算天数差的函数，通用  
  DateDiff(sDate1,  sDate2) { // sDate1和sDate2是2002-12-18格式  
    var  aDate,  oDate1,  oDate2,  iDays  
    aDate  =  sDate1.split("/")  
    oDate1  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2])//转换为12-18-2002格式  
    aDate  =  sDate2.split("/")  
    oDate2  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2])  
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)//把相差的毫秒数转换为天数  
    return  iDays 
  },
  // 选择日期
  onConfirm(event) {
    const [start, end] = event.detail;
    let start_date = this.formatDate(start)
    let end_date = this.formatDate(end)
    this.setData({
      show: false,
      date: `${start_date} - ${end_date}`,
      differenceDate:this.DateDiff(start_date,end_date) + 1, // 计算开始结束的日期之差
    });
    this.setData({
      money:parseInt(this.data.differenceDate / this.data.Feedingtimes) * this.data.shop_arr.money,
      differenceDate_cs:parseInt(this.data.differenceDate / this.data.Feedingtimes),
    })
    if (this.data.date){
      this.setData({ err_feed_date:''})
    }
  },
  // 喂养频率选择 picker 事件
  onChange(event) {
    const { picker, value, index } = event.detail;
    let index_money = index + 1
    this.setData({
      Feedingtimes:index_money,
      FeedingFrequency: value,
      differenceDate_cs:parseInt(this.data.differenceDate /index_money),
      money:parseInt(this.data.differenceDate / index_money) * this.data.shop_arr.money
    })
  },
  // 喂养频率隐藏
  onClose1() {
    this.setData({ show1: false });
  },
  // 喂养频率展示
  showPopup() {
    this.setData({ show1: true });
  },
  onCancel(){
    this.setData({ show1: false });
  },
  // 喂养频率确认
  onConfirm_pv(e){
    // console.log(e.detail.index)
    let index_money = e.detail.index + 1
    this.setData({
      FeedingFrequency: e.detail.value,
      show1: false,
      differenceDate_cs:parseInt(this.data.differenceDate /index_money),
      money:parseInt(this.data.differenceDate / index_money) * this.data.shop_arr.money
    })
    if(this.data.FeedingFrequency){
      this.setData({ err_feed_frequency:''})
    }
  },
  // vant 事件获取 图片临时链接 
  afterRead(e) {

    const file = e.detail.file;
    // console.log(file)
    this.data.fileList.unshift(file);
    //获取更新图片临时存数组中的数据
    var files = this.data.fileList;
    this.setData({
      fileList: files //重置才能显示数据
    })
  },
  // 删除临时图片
  delUploaderImg: function (e) {
    
    //展示的图片列表
    var newfile = this.data.fileList
    //更新后要显示的数据
    newfile.splice(e.detail.index, 1);
    this.setData({
      fileList: newfile, //要上传及显示的图片
    })
  },
  // 上传图片
  uploadToCloud() {
    wx.cloud.init();
    const { fileList } = this.data;
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`Pets_img/pets-photo` + new Date().getTime()+`.png`, file))
      Promise.all(uploadTasks)
        .then(data => {
          const newFileList = data.map(item => { return item.fileID }) 
          // console.log(newFileList)
          this.setData({
            pets_Photo: newFileList
          })

          // 写入数据库
          db.collection('order').add({
            data: { // 要插入的数据
              user_name: this.data.user_name,
              phone: this.data.phone,
              feed: this.data.date,
              feed_frequency: this.data.FeedingFrequency,
              pets_img: this.data.pets_Photo,
              Pets_name:this.data.Pets_name,
              differenceDate:this.data.differenceDate,
              Feedingtimes:this.data.Feedingtimes,
              money:this.data.shop_arr.money,
              Discount:this.data.shop_arr.Discount,
              differenceDate_cs:this.data.differenceDate_cs,
              community_id:this.data.shop_arr._id,
              done:1,
            },
          })
            .then(res => {
              console.log()
              if (res.errMsg === 'collection.add:ok') {
                wx.hideLoading()
                // 重置
                this.setData({
                  user_name:'',
                  phone:'',
                  date:'',
                  FeedingFrequency:'',
                  pets_Photo:'',
                  fileList:'',
                  Pets_name:''
                })
                wx.navigateTo({
                  url: '/pages/AppointmentSuccessful/AppointmentSuccessful',
                })
              }
            })
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
        })
    }
  },
  // 上传图片的方法
  uploadFilePromise(fileName, chooseResult) {
      return wx.cloud.uploadFile({
        cloudPath: fileName,
        filePath: chooseResult.path
      });
  },
  // 立即预约
  order() {
    var myreg = /^[1][0-9]{10}$/
    if (this.data.user_name.trim() == ''){
      this.setData({ err_user_name: '姓名不能为空' })
      return false
    } else if (!myreg.test(this.data.phone)){
      this.setData({ err_phone: '手机号码格式有误' })
      return false
    } else if (this.data.Pets_name.trim() == '') {
      this.setData({ err_Pets_name: '宠物姓名不能为空' })
      return false
    } else if(this.data.date.trim() == ''){
      this.setData({ err_feed_date:'请选择喂养时间'})
      return false
    } else if (this.data.FeedingFrequency.trim() == ''){
      this.setData({ err_feed_frequency: '请选择喂养频率' })
      return false
    }else if(this.data.money === 0){
      wx.showToast({
        title: '请重新选择喂养次数',
        icon:'none'
      })
      return false
    }
    wx.showLoading({})
    // 上传图片
    this.uploadToCloud()
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