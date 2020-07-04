// pages/reserve/reserve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkInDate:'',
    checkOutDate:'',
    nights:'',
    houseName:'',
    newInDate:'',
    newOutDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var checkInDate = options.checkInDate;
    var checkOutDate = options.checkOutDate;
    var nights = options.nights;
    var houseName = options.houseName;
    this.setData({
      checkInDate,
      checkOutDate,
      nights,
      houseName
    })
    // console.log(this.handleTime('2020-02-12'))
    var newInDate = this.handleTime(checkInDate);
    var newOutDate = this.handleTime(checkOutDate);
    this.setData({
      newInDate,
      newOutDate
    })
  },
  // 点击查看订单
  onLookTap(e){
    wx.reLaunch({
      url:'/pages/order/order'
    })
  },
  // 点击返回首页
  onBackTap(e){
    wx.reLaunch({
      url:'/pages/houseRecommendation/houseRecommendation'
    })
  },
  // 处理入住时间 离店时间
  handleTime(date){
    //2020-02-27
    var year,month,day;
    if((typeof date) == 'string'){
      year = date.substring(0,4)
      month = date.substring(5,7);//02
      day = date.substring(8);//27
    }
    var reg = /^0/g
    // console.log(reg.test(month));
    // console.log(reg.test(day));
    if(reg.test(month)){
      month = month.substring(1)
    }
    if(reg.test(day)){
      day = day.substring(1)
    }
    return `${year}年${month}月${day}日`;
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