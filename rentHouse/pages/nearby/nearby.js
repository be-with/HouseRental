// pages/nearby/nearby.js

import { HouseModel } from '../../model/recommend';
var houseModel = new HouseModel();
import handleImgList from '../../utils/handleImgList';
var Moment = require("../../utils/moment.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',//当前城市
    nearbyArr: [],
    img: [],
    apartmentArr: ['三室两厅', '一室一厅'],//房屋类型
    wayArr: ['日租', '短租'],//租住类型,
    indexApa: 0,//房屋类型索引
    indexWay: 0,//租住类型索引
    selectApa: false,//进入页面没选择户型 默认false
    selectWay: false,//进入页面没选择租住类型 默认false
    selectedCity: '',//被选中的城市
    type: '',//被选中的房子类型
    rtype: '',//被选中的房子租住类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      city: options.city,
      selectedCity: options.city
    })
    this.getHouseByAssignCity();
  },


  // 判断短租的出租结束时间与系统当前时间 出租结束时间 < 系统当前时间 => 结束出租 不显示
  // 出租结束时间 > 系统当前时间 => 出租中  显示
  judgeEndDate(res) {
    var localDate = Moment(new Date()).format('YYYY-MM-DD');//系统当前时间
    var result = [];
    res.forEach(item => {
      if (item.rtype === '短租' && (item.start_date !== '' && item.start_date !== null)) {
        if (new Date(item.end_date) > new Date(localDate)) {
          // console.log(item);
          result.push(item);
        }
      } else {
        result.push(item);
      }
    })
    return result;
  },


  // 获取根据指定(Assign)城市（用户定位）查询的数据 
  getHouseByAssignCity() {
    var city = this.data.city;
    houseModel.getRecommendByCity1(city).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var arr = result.sort(function () {
        return Math.random() - 0.5;
      })
      // console.log(arr)
      var img = handleImgList.handleImgList(result);
      // // console.log(img);
      this.setData({
        nearbyArr: arr,
        img
      })
    })
  },
  // 监听地址(区域)改变事件
  changeArea(e) {
    // console.log(e.detail.value[1]);
    var selectCity = this.data.selectCity;//判断有没有选择城市来渲染页面
    var city = e.detail.value[1];
    var type = this.data.type;//获取当前选择的房子类型
    var rtype = this.data.rtype;//获取当前选择的租住类型

    if (e.detail.value[1]) {
      selectCity = true;
    }
    this.setData({
      city: e.detail.value[1],
      selectCity: selectCity,
      selectedCity: e.detail.value[1]
    })
    // console.log(this.data.city)
    var selectedCity = this.data.selectedCity;//获取当前选择的城市
    if (type == '' && rtype == '') {
      // 根据城市查询
      this.getRecommendByCity(selectedCity);
    } else if (type != '' && rtype == '') {
      // 根据房子类型和城市查询
      this.getRecommendByTypeAndCity(type, selectedCity);
    } else if (type == '' && rtype != '') {
      // 根据城市 租住类型查询
      this.getRecommendByRtAndC(selectedCity, rtype);
    } else {
      // 根据城市 租住类型 房子类型
      this.getRecommendByRTC(selectedCity, type, rtype);
    }
  },
  // 监听户型改变事件
  changeApartment(e) {
    console.log(e);
    var selectApa = this.data.selectApa;
    var selectedCity = this.data.selectedCity;
    var rtype = this.data.rtype;
    var type;
    if (e.detail.value) {
      selectApa = true;
    }
    this.setData({
      indexApa: e.detail.value,
      selectApa
    })
    if (e.detail.value == 0) {
      type = '三室两厅'
    } else if (e.detail.value == 1) {
      type = '一室一厅'
    }
    this.setData({
      type
    })
    if (selectedCity == '' && rtype == '') {
      // 根据房子类型查询
      this.getRecommendBytype(type);
    } else if (selectedCity != '' && rtype == '') {
      // 根据城市和房子类型查询
      this.getRecommendByTypeAndCity(type, selectedCity);
    } else if (selectedCity == '' && rtype != '') {
      // 根据房子类型和租住类型查询
      this.getRecommendByRtAndT(type, rtype)
    } else {
      // 根据城市 租住类型 房子类型
      this.getRecommendByRTC(selectedCity, type, rtype);
    }
  },
  // 监听租住类型改变事件
  changeWay(e) {
    // console.log(e.detail.value);
    var indexWay = this.data.indexWay;
    var selectWay = this.data.selectWay;
    var rtype;
    var type = this.data.type;//房子的类型
    var selectedCity = this.data.selectedCity;//城市
    if (e.detail.value) {
      selectWay = true;
    }
    this.setData({
      indexWay: e.detail.value,
      selectWay
    })
    if (e.detail.value == 0) {
      rtype = '日租'
    } else if (e.detail.value == 1) {
      rtype = '短租'
    }
    this.setData({
      rtype
    })
    if (selectedCity == '' && type == '') {
      // 根据租住类型查询
      this.getRecommendByRType(rtype);
    } else if (selectedCity != '' && type == '') {
      // 根据城市和租住类型查询
      this.getRecommendByRtAndC(selectedCity, rtype)
    } else if (selectedCity == '' && type != '') {
      // 根据房子类型和租住类型查询
      this.getRecommendByRtAndT(type, rtype);
    } else {
      // 根据城市 租住类型 房子类型
      this.getRecommendByRTC(selectedCity, type, rtype);
    }
  },
  // 房子详情页 线上签约
  onSign(e) {
    // console.log(e);
    var currentIndex = this.data.currentIndex;

    this.setData({
      currentIndex: e.detail.index
    })
    wx.navigateTo({
      url: `/pages/signing/signing?id=${e.detail.index}&city=${e.detail.city}&title=${e.detail.title}&address=${e.detail.address}`
    })
    // console.log(currentIndex)
  },
  // 根据城市查询
  getRecommendByCity(city) {
    var self = this;
    houseModel.getRecommendByCity1(city).then(res => {
      var result = this.judgeEndDate(res);

      var img = handleImgList.handleImgList(result);
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据房子类型和城市查询
  getRecommendByTypeAndCity(type, city) {
    var self = this;
    houseModel.getRecommendByTypeAndCity1(type, city).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var img = handleImgList.handleImgList(result);
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据城市 租住类型查询
  getRecommendByRtAndC(city, rtype) {
    var self = this;
    houseModel.getRecommendByRtAndC1(city, rtype).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据城市 租住类型 房子类型
  getRecommendByRTC(city, type, rtype) {
    var self = this;
    houseModel.getRecommendByRTC1(city, type, rtype).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据房子类型查询
  getRecommendBytype(type) {
    var self = this;
    houseModel.getRecommendBytype1(type).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);

      var img = handleImgList.handleImgList(result);
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据房子类型和租住类型查询
  getRecommendByRtAndT(type, rtype) {
    var self = this;
    houseModel.getRecommendByRtAndT1(type, rtype).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        nearbyArr: result,
        img
      })
    })
  },
  // 根据租住类型查询
  getRecommendByRType(rtype) {
    var self = this;
    houseModel.getRecommendByRType1(rtype).then(res => {
      // console.log(res);
      var result = this.judgeEndDate(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        nearbyArr: result,
        img
      })
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