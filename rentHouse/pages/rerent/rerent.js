// pages/rerent/rerent.js

import { OrderModel } from '../../model/order';
var orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: '',
    orderArr: [],
    newNights:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage();
    this.getOrderofRerentByCid();
  },

  getStorage() {
    var userKey = wx.getStorageSync('user_key');
    // console.log(userKey);

    this.setData({
      cid: userKey.uid
    })
  },
  // 通过cid获取续租申请的数据
  getOrderofRerentByCid() {
    // console.log(this.data.cid);
    var cid = this.data.cid;
    // var rerent = 0;
    console.log(cid);
    orderModel.getOrderofByCid(cid).then(res => {
      console.log(res);
      this.setData({
        orderArr: res
      })
    })
  },

  // 计算共几晚
  computedNights(checkInDate,checkOutDate) {
    // var checkInDate = this.data.checkInDate;
    // var checkOutDate = this.data.checkOutDate;
    var disDate = Date.parse(checkOutDate) - Date.parse(checkInDate);
    var nights = Math.floor(disDate / (24 * 60 * 60 * 1000))
    this.setData({
      newNights: nights
    })
    return nights;
  },
  // 通过
  onAgreeTap(e) {
    console.log('agress', e);
    var self = this;
    // 更新order_info =>  1.更新付款状态 2.nights 3.续租状态 4.rerent_price
    var item = e.detail.item;
    var id = item.id;
    var cid = this.data.cid;
    var houseName = item.house_name;
    var rerent_date = item.rerent_date;//新离店日期
    var price = item.total_price / item.nights;//单价
    var quit_date = item.quit_date;
    var prevNights = item.nights;
    var newNights = this.computedNights(quit_date,rerent_date);
    var rerent_price = price * newNights;
    // console.log(rerent_price);

    wx.request({
      // url:`http://xxx/updateOrderOfRerentInfo?id=${id}&cid=${cid}&house_name=${houseName}`,
      url:`http://xxx/updateOrderOfRerentInfo?id=${id}&cid=${cid}&house_name=${houseName}`,
      method:'POST',
      data:{
        nights:prevNights + newNights,
        rerent_price
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // console.log(res);
      }
    })
  },

  // 不通过
  onDisagreeTap(e) {
    // console.log('disagree', e);
    // 更新order_info 1.rerent -> 2  2.rerent_date置空
    var item = e.detail.item;
    var id = item.id;
    var cid = this.data.cid;
    var houseName = item.house_name;
    wx.request({
      // url:`http://xxx/updateOrderOfRerentdate?id=${id}&cid=${cid}&house_name=${houseName}`,
      url:`http://xxx/updateOrderOfRerentdate?id=${id}&cid=${cid}&house_name=${houseName}`,
      method:'POST',
      data:{
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // console.log(res);
      }
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
