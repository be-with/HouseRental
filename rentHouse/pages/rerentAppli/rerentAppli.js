
// pages/rerentAppli/rerentAppli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    uid: '',
    houseName: '',
    price: '',
    prevQuitDate:'',
    quitDate: '',
    nextDay: '',
    nights: 0,
    totalPrice: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var id = options.id;
    var uid = options.uid;
    var houseName = options.houseName;
    var price = options.price;
    var quitDate = options.quitDate;
    var nextDay = this.getNextDay(quitDate, 1);
    this.setData({
      id,
      uid,
      houseName,
      price,
      prevQuitDate:quitDate,
      quitDate,
      nextDay
    })

  },
  // 得到下一天的日期
  getNextDay: function (date, i) {
    date = new Date(date);
    date = +date + 1000 * 60 * 60 * 24 * i;
    date = new Date(date);
    // console.log('0'+ (date.getMonth() + 1))
    // console.log('0' + date.getDate())
    var month, day
    if ((date.getMonth() + 1) < 10) {
      month = '0' + (date.getMonth() + 1)
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      day = '0' + (date.getDate());
    } else {
      day = date.getDate();
    }
    //格式化
    // return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return date.getFullYear() + "-" + month + "-" + day
  },
  // 计算共几晚
  computedNights() {
    var quitDate = this.data.quitDate;
    var nextDay = this.data.nextDay;
    // console.log(this.data.quitDate);
    // console.log(this.data.nextDay);
    var disDate = Date.parse(nextDay) - Date.parse(quitDate);
    var nights = Math.ceil(disDate / (24 * 60 * 60 * 1000))
    this.setData({
      nights
    })
    // console.log(nights);
  },
  // 修改日期
  onModifyTap(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/calendar/calendar'
    })
  },

  // 提交申请
  formSubmit(e){
    // 更新order表 -> 1.续租状态 ''->0 
    // console.log(this.data.nextDay);
    var self = this;
    var nextDay = this.data.nextDay;
    var id = this.data.id;
    var uid = this.data.uid;
    var houseName = this.data.houseName;
    var quitDate = this.data.quitDate;
    var prevQuitDate = this.data.prevQuitDate;
    if(prevQuitDate == quitDate){
      wx.request({
        // url: `http://xxx/updateOrderOfRerent?id=${id}&uid=${uid}&house_name=${houseName}`,
        url: `http://xxx/updateOrderOfRerent?id=${id}&uid=${uid}&house_name=${houseName}`,
        method: 'POST',
        data: {
          rerent:0,
          rerent_date:nextDay
        },
        header: {
          'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
        },
        success: function (res) {
          console.log(res);
          self._showToast('提交成功')
        }
      })
    }else{
      this._showToast('请选择正确的续租日期');
    }
    
    
  },

  _showToast(title){
    wx.showToast({
      title:title,
      icon:'none'
    })
  }

  
,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.checkInDate && currPage.data.checkOutDate) {
      self.setData({
        quitDate: currPage.data.checkInDate,
        nextDay: currPage.data.checkOutDate
      })
      console.log(currPage.data.checkInDate, currPage.data.checkOutDate);
    }
    this.computedNights();
    var totalPrice = (Math.ceil(parseInt(this.data.price) * parseInt(this.data.nights))).toFixed(2);
    this.setData({
      totalPrice
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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