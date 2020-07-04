// pages/czOperate/czOperate.js

import {HouseModel} from '../../model/recommend';
var houseModel = new HouseModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeMenu: ["日租", "短租"],
    winHeight: '',//
    currentIndex: 0,
    cid:0,
    houseNameArr:[],
    orderArr:[],
    currentNameIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    this.getStorage();
    var cid = this.data.cid;
    this.getHouseName(cid,'日租');
  },

  // 获取缓存的cid(uid)
  getStorage(){
    var cid = wx.getStorageSync('user_key').uid;
    this.setData({
      cid
    })
  },

  order(e) {
    // console.log(e);
    var cid = this.data.cid;
    var self = this;
    this.setData({
      currentIndex: e.detail.index
    })
    if(e.detail.index == 0){
      this.getHouseName(cid,'日租');
    }else if(e.detail.index == 1){
      this.getHouseName(cid,'短租');
    }
  },

  // 通过cid获取房子名称
  getHouseName(cid,rtype){
    // var cid = this.data.cid;
    var houseNameArr = [];
    houseModel.getRecommendByCidRT(cid,rtype).then(res=>{
      // console.log(res);
      res.forEach(function(item,index){
        // console.log(item.title);
        houseNameArr.push(item.title);
      })
      console.log(houseNameArr);
      this.setData({
        houseNameArr
      })
    })
  },

  // 
  onHousenameTap(e){
    console.log(e);
    var cid = this.data.cid;
    var housename = e.currentTarget.dataset.names;
    var currentNameIndex = e.currentTarget.dataset.index;
    this.setData({
      currentNameIndex
    })
    this.getOrderByCidHousename(cid,housename);

  },

  // 通过cid和房子名称获取订单信息
  getOrderByCidHousename(cid,housename){
    houseModel.getOrderByCidHousename(cid,housename).then(res=>{
      console.log(res);
        this.setData({
          orderArr:res
        })
        if(res.length == 0){
          wx.showToast({
            title:'暂无出租消息',
            image:'../../images/refuse.png'
          })
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