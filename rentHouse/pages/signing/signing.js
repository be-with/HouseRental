// pages/signing/signing.js

var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;

import {HouseModel} from '../../model/recommend';
var houseModel = new HouseModel();
import {OrderModel} from '../../model/order';
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
    // 轮播图
    swiper: [],
    deploy: [//房源配置
      {
        img: '../../images/kt.png',
        text: '空调'
      },
      {
        img: '../../images/bed.png',
        text: '床'
      },
      {
        img: '../../images/desk.png',
        text: '书桌'
      },
      {
        img: '../../images/yg.png',
        text: '衣柜'
      },
      {
        img: '../../images/wsj.png',
        text: '卫生间'
      },
      {
        img: '../../images/wifi.png',
        text: 'wifi'
      },
      {
        img: '../../images/rsq.png',
        text: '热水器'
      },
      {
        img: '../../images/xyj.png',
        text: '洗衣机'
      },
      {
        img: '../../images/bx.png',
        text: '冰箱'
      },
      {
        img: '../../images/yyj.png',
        text: '油烟机'
      },
      {
        img: '../../images/dcl.png',
        text: '电磁炉'
      },
      {
        img: '../../images/mqz.png',
        text: '煤气灶'
      },
      {
        img: '../../images/dsj.png',
        text: '电视机'
      },
      {
        img: '../../images/sofa.png',
        text: '沙发'
      },
    ],
    latitude: 0,//纬度
    longitude: 0,//经度
    houseInfo:{},
    id: 0,
    checkInDate: "",//入住时间
    checkOutDate: "",//离店时间
    nights: 0,//共几晚
    city:'',//城市
    title:'',//房子名称
    disopose:[],//配置
    address:'',//房子地址
    uid:'',
    cid:'',//发布房子的用户id(业主id)
    startDate:'',//短租的出租开始时间
    endDate:'',//短租的出租结束时间
    hasOrder:false,//用户有没有签约
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id 可以拿到从前一页的第几个房源跳转的 通过options.id方便获取数据
    // console.log(options);
    var self = this;
    var id = options.id;
    var city = options.city;
    var title = options.title;
    var address = options.address;
    var cid = options.cid;
    var startDate = options.startDate;//短租的出租开始时间（日租的话为null || ''）
    var endDate = options.endDate;//短租的出租结束时间（日租的话为null || ''）
    this.setData({
      id: id,
      city,
      title,
      address,
      cid,
      startDate,
      endDate
    })
    // console.log(options);
    // console.log(options.uid);
    wx.getStorage({
      key:'user_key',
      success(res){
        console.log(res);
        self.getOrderByUidAndHouse(res.data.uid,title)
        self.setData({
          uid:res.data.uid
        })
      }
    })


    // 腾讯位置服务应用服务 秘钥
    qqmapsdk = new QQMapWX({
      key: '2BGBZ-WPD3X-APN4I-76LIY-SHOX3-KCBLR'
    });

    this.setStorageDate();
    this.autoGetLocation();
    this.getRecommendById(id);
  },
    // 根据地址获取经纬度
    autoGetLocation(e) {
      var addr = this.data.city + this.data.address;
      var self = this;
      qqmapsdk.geocoder({
        address: addr,   //用户输入的地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
        complete: function (res) {
          // console.log(res);   //经纬度对象
          self.setData({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
          })
        }
      });
    },
    // 点击线上签约
    onLineTap() {
      var houseName = this.data.houseInfo.title;
      var price = this.data.houseInfo.price;
      var nights = this.data.nights;
      var checkInDate = this.data.checkInDate;
      var checkOutDate = this.data.checkOutDate;
      var uid = this.data.uid;
      var pic = this.data.swiper[0];
      var cid = this.data.cid;
      // console.log(this.data.uid);
      var startDate = this.data.startDate;
      var endDate = this.data.endDate;
      // console.log(new Date(startDate) < new Date(checkInDate));
      // 短租才要判断 -> 合法的入住时间和离开时间
      if((startDate !== '' && startDate !== 'null') && (endDate !== '' && endDate !== 'null')){
        var legalCheckinDate = (new Date(startDate) < new Date(checkInDate)) && (new Date(endDate) > new Date(checkInDate));
        var legalCheckoutDate = (new Date(startDate) < new Date(checkOutDate)) && (new Date(endDate) > new Date(checkOutDate));
        // console.log(legalCheckinDate,legalCheckoutDate);
        if(!legalCheckinDate || !legalCheckoutDate){
          wx.showToast({
            title:'不在可租借时间内,租借时间可查看页面顶部',
            icon:'none',
            duration:1000
          })
          return;
        }
      }
      if(uid){
        wx.navigateTo({
          url: `/pages/onlineSign/onlineSign?houseName=${houseName}&price=${price}&nights=${nights}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&uid=${uid}&img=${pic}&cid=${cid}`
        })
      }else{
        wx.showToast({
          title:'请先去个人中心登录',
          icon:'none',
          duration:1000
        })
        setTimeout(() => {
          wx.reLanuch({
            url: '/pages/person/person'
          })
        }, 1200);
      }
      
    },
  // 缓存日期
  setStorageDate() {
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
  },
  // 取出缓存并赋值
  showStorageDate() {
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    this.setData({
      checkInDate: getDate.checkInDate,
      checkOutDate: getDate.checkOutDate
    })
  },
  // 点击修改日期
  onModifyTap() {
    wx.navigateTo({
      url: '/pages/calendar/calendar'
    })
  },
  // 计算共几晚
  computedNights() {
    var checkInDate = this.data.checkInDate;
    var checkOutDate = this.data.checkOutDate;
    var disDate = Date.parse(checkOutDate) - Date.parse(checkInDate);
    var nights = Math.floor(disDate / (24 * 60 * 60 * 1000))
    this.setData({
      nights
    })
  },
  // 获取对应的房子详情 
  getRecommendById(id){
    houseModel.getRecommendById(id).then(res=>{
      // console.log(res[0]);
      var swiper = [];
      var disopose = res[0].disopose.split(',');
      var deploy = this.data.deploy;
      // console.log(disopose)
      // console.log(res[0].img.split(','))
      swiper = res[0].img.split(',')
      for(var i = 0;i < deploy.length; i++) {
        // console.log(deploy[i]);
        for(var j = 0;j < disopose.length; j++) {
          if(deploy[i].text == disopose[j]) {
            disopose[j] = deploy[i];
          }
        }
      }
      // console.log(disopose);
      this.setData({
        houseInfo:res[0],
        swiper,
        disopose
      })   
    })
  },
  // 监听看房申请
  onApplicationTap(){
    var id = this.data.id;
    var city = this.data.city;
    var title = this.data.title;
    var address = this.data.address;
    var img = this.data.swiper[0];
    var cid = this.data.cid;
    var hasOrder = this.data.hasOrder;
    wx.navigateTo({
      url:`/pages/application/application?id=${id}&title=${title}&city=${city}&address=${address}&img=${img}&cid=${cid}&hasOrder=${hasOrder}`
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showStorageDate();
    this.computedNights();
  },

  // 通过uid获取订单的房名
  getOrderByUidAndHouse(uid,title){
    var localDate = Moment(new Date()).format('YYYY-MM-DD');//系统当前时间
    orderModel.getOrderByUidAndHouse(uid,title).then(res=>{
      console.log(res);
      if(res.length !== 0){
        // 有签约
        res.forEach((item)=>{
          if(item.quit_date && (item.quit_date > localDate)){//租借中
            // 显示业主联系方式
            this.setData({
              hasOrder:true
            })
          }else if(item.rerent_date && (item.rerent_date > localDate)){//续租中 还没结束
            // 显示业主联系方式
            this.setData({
              hasOrder:true
            })
          }else{
            // 显示中介联系方式
            this.setData({
              hasOrder:false
            })
          }
        })
        
      }else{
        // 没有签约过 显示中介联系方式
        this.setData({
          hasOrder:false
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