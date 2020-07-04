// pages/order/order.js

import { OrderModel } from '../../model/order';
var orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderMenu: ["全部订单", "租借中", "租借完毕", "已付款", "未付款"],
    currentIndex: 0,
    uid: 0,
    ordersUid: [],
    winHeight: '',//
    ordersRenting: [],//租借中
    orderRented: [],//租借完毕
    ordersPayed: [],//已付款
    ordersNoPay: [],//未付款
  },
  order(e) {
    console.log(e);
    var self = this;
    this.setData({
      currentIndex: e.detail.index
    })
    var uid = this.data.uid;
    var date = this.getLocalTime();
    if (e.detail.index == 0) {
      // 全部订单
      this.getOrderByUid(uid, function (res) {
        //  高度自适应
        console.log(res.length,0);
        self.autoHeight(res.length,1);
        self.setData({
          ordersUid: res
        })
      })
    } else if (e.detail.index == 1) {
      var ordersRenting = [];
      // 租借中 通过计算离店日期与当前日期=>比较大小 当前日期-离店日期<0 -> 租借中
      this.getOrderByUidAndPay(uid, 1, function (res) {
        // console.log(res);
        self.judgeRenting(res, date);
      })
    } else if (e.detail.index == 2) {
      var orderRented = [];
      // 租借完毕 通过计算离店日期与当前日期=>比较大小 当前日期-离店日期>0 -> 租借完毕
      this.getOrderByUidAndPay(uid, 1, function (res) {
        // console.log(res);
        self.judgeRented(res, date);
      })
    } else if (e.detail.index == 3) {
      // 已付款
      this.getOrderByUidAndPay(uid, 1, function (res) {
        // console.log(res);
        //  高度自适应
        console.log(res,3);
        self.autoHeight(res.length,0);
        self.setData({
          ordersPayed: res
        })
      })
    } else if (e.detail.index == 4) {
      // 未付款
      this.getOrderByUidAndPay(uid, 0, function (res) {
        console.log(res);
        //  高度自适应
        console.log(res.length,4);
        self.autoHeight(res.length,1);
        self.setData({
          ordersNoPay: res
        })
      })
    }
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
    self.autoHeight(ordersRenting.length,0);
    self.setData({
      ordersRenting
    })
  },
  // 判断订单租借完毕
  judgeRented(res, date) {
    var self = this;
    var orderRented = [];
    res.forEach(function (item) {
      if (Date.parse(date) - Date.parse(item.quit_date) > 0) {
        orderRented.push(item);
      }
      self.autoHeight(orderRented.length,1);
      self.setData({
        orderRented
      })
    })
  },
  // 
  onPayTap(e) {
    console.log(e);
    var item = e.detail.item;
    item = JSON.stringify(item)
    wx.navigateTo({
      url: `/pages/payMoney/payMoney?item=${item}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: 'user_key',
      success(res) {
        // console.log(res);
        var uid = res.data.uid;
        self.setData({
          uid
        })
        // 全部订单 通过uid查询
        self.getOrderByUid(uid, function (res) {
          console.log(res.length)
          //  高度自适应
          self.autoHeight(res.length,1);
          self.setData({
            ordersUid: res
          })
        });
      }
    })
  },
  // 高度自适应
  autoHeight(len,add) {
    var winHeight = 145 * (len + add);
    this.setData({
      winHeight
    })
  },
  // 通过uid获取用户全部订单
  getOrderByUid(uid, callback) {
    var self = this;
    orderModel.getOrderByUid(uid).then(res => {
      // console.log(res);
      callback(res);
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