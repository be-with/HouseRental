// pages/route/route.js

import { ApplicationModel } from '../../model/application';
var applicationModel = new ApplicationModel();
import { OrderModel } from '../../model/order';
var orderModel = new OrderModel();
var Moment = require("../../utils/moment.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    applicationArr: [],
    houseName: [],
    applicationFlag:false,//没有看房行程
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage();
    this.getAppliByUid();
    // setTimeout(() => {
    //   this.getOrder();
    // }, 500);
  },
  // 获取缓存里的uid
  getStorage() {
    var self = this;
    // wx.getStorage({
    //   key: 'user_key',
    //   success(res) {
    //     // console.log(res);
    //     var uid = res.data.uid;
    //     self.setData({
    //       uid
    //     })
    //   },
    //   fail(err) {
    //     this._showToast('请先登录');
    //   }
    // })
    var storage = wx.getStorageSync('user_key');
    if (storage == '') {
      this._showToast('请先登录');
    } else {
      this.setData({
        uid: storage.uid
      })
    }
    // console.log(storage == '')

  },
  // 消息提示框
  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },

  // 获取看房行程数据
  getAppliByUid() {
    var uid = this.data.uid;
    var self = this;
    // var houseName = this.data.houseName;
    var localDate = Moment(new Date()).format('MM-DD');//系统当前时间
    var applicationArr = [];
    console.log(localDate)
    applicationModel.getAppliByUid(uid).then(res => {
      console.log(res);
      res.forEach(item => {
        // houseName.push(item.house_name);
        // console.log(item.visit_time.substring(0,6).replace('月','-').replace('日',''));
        var visitTime = item.visit_time.substring(0,6).replace('月','-').replace('日','');
        // console.log(new Date(visitTime) < new Date(localDate));
        if(new Date(visitTime) > new Date(localDate)){
          // 没有过期 显示 push -> applicationArr
          applicationArr.push(item);
          this.setData({
            applicationFlag:true
          })
        }else{
          this.setData({
            applicationFlag:false
          })
        }
      })
      self.setData({
        applicationArr
      })
    })
  },

  // 通过uid和house_name获取订单
  // getOrder() {
  //   var houseName = this.data.houseName;
  //   var uid = this.data.uid;
  //   console.log(houseName);
  //   houseName.forEach(item => {
  //     orderModel.getOrderByUidAndHouse(uid, item).then(res => {
  //       console.log(res);
  //       if(res.length == 0){
  //         // 没订单
  //       }else{
  //         // 有订单
  //       }
  //     })
  //   })

  // },
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