// pages/repairMessage/repairMessage.js

import { HouseModel } from '../../model/recommend';
var hosueModel = new HouseModel();
var handleImgList = require('../../utils/handleImgList');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseArr: [],
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHouseByCid();

  },
  // 通过cid获取房子信息
  getHouseByCid() {
    var cid = wx.getStorageSync('user_key').uid;
    // console.log(cid);
    hosueModel.getRecommendByCid(cid).then(res => {
      // console.log(res);
      var imgList = handleImgList.handleImgList(res);
      this.setData({
        houseArr: res,
        imgList
      })
      // console.log(handleImgList.handleImgList(res));
    })
  },

  // 点击查看报修信息
  onLookRepairTap(e){
    console.log(e)
    var curData = e.currentTarget.dataset.item;
    var cid = curData.cid;
    var id = curData.id;
    var housename = curData.title;
    var city = curData.city;
    var address = curData.address;
    wx.navigateTo({
      url:`/pages/detailRepair/detailRepair?id=${id}&cid=${cid}&housename=${housename}&city=${city}&address=${address}`
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