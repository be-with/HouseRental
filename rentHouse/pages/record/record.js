// pages/record/record.js

import { OrderModel } from '../../model/order';
var orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArr:[]
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
        self.getOrderByUidAndPay(uid,1, function (res) {
          console.log(res.length);
          self.setData({
            orderArr: res
          })
        });
      }
    })
    // 缴纳租金的日历，根据合同制定启止日历，绿色为租金缴纳有效期，红色为未缴纳日期。
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