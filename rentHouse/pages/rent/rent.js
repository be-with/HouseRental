// pages/rent/rent.js
// 用户的续租
import { OrderModel } from '../../model/order';
var orderModel = new OrderModel();

// 日历
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:0,
    ordersRenting:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var date = this.getLocalTime();
    wx.getStorage({
      key: 'user_key',
      success(res) {
        // console.log(res);
        var uid = res.data.uid;
        self.setData({
          uid
        })
        self.getOrderByUidAndPay(uid, 1, function (res) {
          // console.log(res);
          self.judgeRenting(res, date);
        })
      }
    })
  },

    // 判断订单租借中
    judgeRenting(res, date) {
      var self = this;
      var ordersRenting = [];
      res.forEach(function (item) {
        if (Date.parse(date) - Date.parse(item.quit_date) < 0) {
          ordersRenting.push(item);
        }
      })
      // console.log(ordersRenting);
      self.setData({
        ordersRenting
      })
    },
  // 获取系统当前时间
  getLocalTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return `${year}-${month}-${day}`
  },
  // 通过uid和ispay获取用户所有已付款的订单
  getOrderByUidAndPay(uid, ispay, callback) {
    orderModel.getOrderByUidAndPay(uid, ispay).then(res => {
      // console.log(res);
      callback(res);
    })
  },

  // 续租
  onRerentTap(e){
    console.log(e);
    var id = e.detail.item.id;//订单id
    var uid = e.detail.item.uid;//用户id
    var houseName = e.detail.item.house_name;
    var price = (e.detail.item.total_price) / (e.detail.item.nights);
    var quitDate = e.detail.item.quit_date;
    // console.log(id,uid,houseName);
    wx.navigateTo({
      url:`/pages/rerentAppli/rerentAppli?id=${id}&uid=${uid}&houseName=${houseName}&price=${price}&quitDate=${quitDate}`
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