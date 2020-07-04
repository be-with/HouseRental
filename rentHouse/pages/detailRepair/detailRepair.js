// pages/detailRepair/detailRepair.js

import { RepairModel } from '../../model/repair';
var repairModel = new RepairModel();
var handleImgList = require("../../utils/handleImgList");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//
    cid: '',
    housename: '',
    city: '',
    address: '',
    repairInfo: [],
    imgArr: [],
    noRepair:true,//没有报修信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    var cid = options.cid;
    var housename = options.housename;
    var city = options.city;
    var address = options.address;
    this.setData({
      id,
      cid,
      housename,
      city,
      address
    })
    this.getRepairByCidAndId();
  },


  // 获取报修信息
  getRepairByCidAndId() {
    var cid = this.data.cid;
    var housename = this.data.housename;
    var imgArr;
    // console.log(cid,housename);
    repairModel.getRepairByCidAndName(cid, housename).then(res => {
      // console.log(res[0].img);
      if(res.length == 0){
        this.setData({
          noRepair:true
        })
      }else{
        if(res[0].img != ''){
          imgArr = handleImgList.handleImgList(res);
        }else{
          imgArr = [];
        }
        // console.log(res[0].img == '')
        this.setData({
          repairInfo: res,
          imgArr:imgArr,
          noRepair:false
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