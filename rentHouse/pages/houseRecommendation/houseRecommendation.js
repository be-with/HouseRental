// pages/houseRecommendation/houseRecommendation.js

// 引入腾讯位置服务应用文件
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;

import { HouseModel } from '../../model/recommend';
var houseModel = new HouseModel();
import handleImgList from '../../utils/handleImgList';

var Moment = require("../../utils/moment.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图部分
    swiperImg: ['https://p0.meituan.net/750.0.0/tdchotel/f1cd131254f350e6d7c6717a49c03489307738.jpg',
      'https://p0.meituan.net/750.0.0/tdchoteldark/2d3f7729cdad16bbc702d43392179a41565998.jpg',
      'https://p0.meituan.net/750.0.0/tdchotel/18d9806aed15e6735f3831f655963478610742.jpg'
    ],
    duration: 500,
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    city: '杭州市',// 搜索框旁的地址
    latitude: '',//纬度
    longitude: '',//经度
    selectCity: false,//进入页面没选择城市 默认false
    apartmentArr: ['三室两厅', '一室一厅'],//房屋类型
    wayArr: ['日租', '短租'],//租住类型,
    apartment: '',
    way: '',
    indexApa: 0,//房屋类型索引
    indexWay: 0,//租住类型索引
    selectApa: false,//进入页面没选择户型 默认false
    selectWay: false,//进入页面没选择租住类型 默认false
    currentIndex: 0,//点击线上签约的索引
    recommendArr: [],
    img: [],
    searchword: '',
    selectedCity: '',//被选中的城市
    type: '',//被选中的房子类型
    rtype: '',//被选中的房子租住类型
    cid: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 腾讯位置服务应用服务 秘钥
    qqmapsdk = new QQMapWX({
      key: '2BGBZ-WPD3X-APN4I-76LIY-SHOX3-KCBLR'
    });
    this.addrAuthorized();
    // setTimeout(() => {
    //   // console.log(this.data.city);
    //   this.getRecommend(this.data.city);
    // }, 1000);
  },

  // 判断短租的出租结束时间与系统当前时间 出租结束时间 < 系统当前时间 => 结束出租 不显示
  // 出租结束时间 > 系统当前时间 => 出租中  显示
  judgeEndDate(res){
    var localDate = Moment(new Date()).format('YYYY-MM-DD');//系统当前时间
    var result = [];
    res.forEach(item=>{
      if(item.rtype === '短租' && (item.start_date !== '' && item.start_date !== null)){
        if(new Date(item.end_date) > new Date(localDate)){
          // console.log(item);
          result.push(item);
        }
      }else{
        result.push(item);
      }
    })
    return result;
  },

  // 获取数据
  getRecommend(city) {
    houseModel.getRecommendByCity1(city).then(res => {
      console.log(res);
      var result = this.judgeEndDate(res);
      var arr = result.sort(function () {
        return Math.random() - 0.5;
      })
      // console.log(arr);
      var cid = [];
      res.forEach(function (item, index) {
        cid.push(item.cid);
      })
      var img = handleImgList.handleImgList(result);
      // // console.log(img);
      this.setData({
        recommendArr: arr,
        img,
        cid
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
    // console.log(e);
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
  // 地址权限
  addrAuthorized() {
    var self = this;
    wx.getSetting({
      success(res) {
        // console.log(res);
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] !== 'undefined' && res.authSetting['scope.userLocation'] !== true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success(res) {
              console.log(res);
              // 用户点击了取消按钮
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  image: '../../images/refuse.png',
                  duration: 1000
                })
                self.getRecommend(self.data.city);
              } else {
                wx.showToast({
                  title: '授权成功',
                  image: '../../images/success.png',
                  duration: 1000
                })
                // 授权成功 调用wx.getLocation()
                self.getLocation();
              }
            }
          })
        } else {
          // 地理位置已授权
          self.getLocation();
        }
      }
    })
  },
  // 获取当前地理位置
  getLocation() {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude;//纬度
        const longitude = res.longitude;//经度
        self.getLocal(latitude, longitude);
      }
    })
  },
  // 通过经纬度获取位置
  getLocal(latitude, longitude) {
    var self = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success(res) {
        // console.log(res);
        var province = res.result.ad_info.province;//省份
        var city = res.result.ad_info.city;//城市
        self.setData({
          city
        })
        self.getRecommend(city);
      },
      fail(res) {
        console.log(res, '经纬度获取失败')
      }
    })
  },
  // 附近房源跳转
  onTapNear() {
    wx.navigateTo({
      url: '/pages/nearby/nearby?city=' + this.data.city
    })
  },
  // 联系我们
  onTapContact() {
    wx.makePhoneCall({
      phoneNumber: '18059811581',
      success(e) {
        console.log(e)
      }
    })
  },
  // 房子详情页 线上签约
  onSign(e) {
    console.log(e, 279);
    var currentIndex = this.data.currentIndex;
    var curCid = this.data.cid[currentIndex];
    var startDate = e.detail.startdate;
    var endDate = e.detail.enddate;
    // console.log(curCid);
    this.setData({
      currentIndex: e.detail.index
    })
    wx.navigateTo({
      url: `/pages/signing/signing?id=${e.detail.index}&city=${e.detail.city}&title=${e.detail.title}&address=${e.detail.address}&cid=${curCid}&startDate=${startDate}&endDate=${endDate}`
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
        recommendArr: result,
        img
      })
    })
  },
  // 根据房子类型和城市查询
  getRecommendByTypeAndCity(type, city) {
    var self = this;
    houseModel.getRecommendByTypeAndCity1(type, city).then(res => {
      var result = this.judgeEndDate(res);
      // console.log(res);
      var img = handleImgList.handleImgList(result);
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  // 根据城市 租住类型查询
  getRecommendByRtAndC(city, rtype) {
    var self = this;
    houseModel.getRecommendByRtAndC1(city, rtype).then(res => {
      var result = this.judgeEndDate(result);
      // console.log(res);
      var img = handleImgList.handleImgList(res)
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  // 根据城市 租住类型 房子类型
  getRecommendByRTC(city, type, rtype) {
    var self = this;
    houseModel.getRecommendByRTC1(city, type, rtype).then(res => {
      var result = this.judgeEndDate(res);
      // console.log(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  // 根据房子类型查询
  getRecommendBytype(type) {
    var self = this;
    houseModel.getRecommendBytype1(type).then(res => {
      var result = this.judgeEndDate(res);
      // console.log(res);
      var img = handleImgList.handleImgList(result);
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  // 根据房子类型和租住类型查询
  getRecommendByRtAndT(type, rtype) {
    var self = this;
    houseModel.getRecommendByRtAndT1(type, rtype).then(res => {
      var result = this.judgeEndDate(res);
      // console.log(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  // 根据租住类型查询
  getRecommendByRType(rtype) {
    var self = this;
    houseModel.getRecommendByRType1(rtype).then(res => {
      var result = this.judgeEndDate(res);
      // console.log(res);
      var img = handleImgList.handleImgList(result)
      self.setData({
        recommendArr: result,
        img
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      searchword: ''
    })
    // this.getRecommend();
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