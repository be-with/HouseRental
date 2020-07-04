// pages/onlineSign/onlineSign.js

import {OrderModel} from '../../model/order';
var orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseName: '',//房子名称
    price: '',//价格
    nights: '',//几晚
    index: '',//入住人数索引
    checkInDate: '',//入住时间
    checkOutDate: '',//离开时间
    newInDate: '',//处理后的入住时间
    newOutDate: '',//处理后的离开时间
    animationData: {},
    isShow: false,
    personNum: ['1', '2', '3', '4', '5', '6'],
    IDzm: '../../images/IDzm.png',
    IDfm: '../../images/IDfm.png',
    totalPrice: 0.00,
    isShowDetail: false,//总价格
    checkInDateArr: [],//入住时间数组
    nFlag: true,//判断姓名输入格式
    tFlag: true,//判断联系方式输入格式
    IDname: '',//身份证上的姓名
    // form表单
    form: {
      nameValue: '',
      telValue: ''
    },
    personName:'',
    isShowPay: false,//默认不显示 点击提交订单后显示
    uid:0,//用户id
    img:'',
    id:0,//订单id
    ID:'',//入住人身份证号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options );
    var houseName = options.houseName;
    var price = options.price;
    var nights = options.nights;
    var checkInDate = options.checkInDate;
    var checkOutDate = options.checkOutDate;
    var totalPrice = (Math.ceil(parseInt(price) * parseInt(nights))).toFixed(2);
    var uid = options.uid;
    var img = options.img
    var cid = options.cid;
    this.setData({
      houseName,
      price,
      nights,
      checkInDate,
      checkOutDate,
      totalPrice,
      uid,
      img,
      cid
    })
    this.countCheckInDateArr();
    var newInDate = this.handleTime(checkInDate);
    var newOutDate = this.handleTime(checkOutDate);
    this.setData({
      newInDate,
      newOutDate
    })
    // console.log(this.data.uid);
  },
  // 点击协议条文,显示弹框
  onShowAgreeTap() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      isShow: true
    })
    // console.log(this);
  },

  // 隐藏弹框
  onHideAgreeTap() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      isShow: false
    })
  },
  // 监听入住人数
  onNumTap(e) {
    // console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 监听明细点击事件
  ondetailTap(e) {
    var isShowDetail = this.data.isShowDetail;
    if (isShowDetail === false) {
      // 显示遮罩层
      this.onShowDetailTap();
    } else if (isShowDetail === true) {
      // 隐藏遮罩层 
      this.onHideDetailTap();
    }
  },
  // 显示价格明细遮罩层
  onShowDetailTap() {
    var isShowDetail = this.data.isShowDetail;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      isShowDetail: true
    })
  },
  // 隐藏价格明细遮罩层
  onHideDetailTap() {
    var isShowDetail = this.data.isShowDetail;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      isShowDetail: false
    })
  },
  // 计算入住时间数组
  countCheckInDateArr() {
    var nights = parseInt(this.data.nights);//几晚
    var checkInDate = this.data.checkInDate;
    var checkInDateArr = [];
    var self = this;
    (function () {
      for (var i = 0; i < nights; i++) {
        checkInDateArr.push(self.getNextDay(checkInDate, i));
      }
    })()
    this.setData({
      checkInDateArr
    });
  },
  // 得到下一天的日期
  getNextDay: function (date, i) {
    date = new Date(date);
    date = +date + 1000 * 60 * 60 * 24 * i;
    date = new Date(date);
    //格式化
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  },
  // 监听支付弹窗的关闭事件
  onCloseTap(e) {
    console.log(e);
    this.setData({
      isShowPay: false
    })
  },
  // 监听确认支付事件
  onConfirmTap(e) {
    console.log(e);
    var person_name = this.data.personName;
    var checkInDate = this.data.checkInDate;
    var checkOutDate = this.data.checkOutDate;
    var nights = this.data.nights;
    var uid = this.data.uid;
    var self = this;
    var id = this.data.id;
    var houseName = this.data.houseName
    // console.log(id);
    this.setData({
      isShowPay: false
    })
    wx.navigateTo({
      url: `/pages/reserve/reserve?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&nights=${nights}&houseName=${houseName}`
    })
    // console.log(person_name);

    // 更新支付状态 0未支付 1已支付
    wx.request({
      // url:`http://xxx/updateOrderOfPay?id=${id}&uid=${uid}`,
      url:`http://xxx/updateOrderOfPay?id=${id}&uid=${uid}`,
      method:'POST',
      data:{
        ispay:1
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  // 监听提交订单事件   
  // 判断姓名和联系方式格式是否正确 判断身份证的名字和填写的姓名是否匹配
  formSubmit(e) {
    // console.log(e.detail.value);
    var nameValue = e.detail.value.nameValue;
    var telValue = parseInt(e.detail.value.telValue);
    var nFlag = this.judgeName(nameValue);
    var tFlag = this.judgeTel(telValue);
    var checkInDate = this.data.checkInDate;
    var checkOutDate = this.data.checkOutDate;
    var personCount = parseInt(this.data.index) + 1;
    var houseName = this.data.houseName;
    var IDzm = this.data.IDzm;
    var IDfm = this.data.IDfm;
    var totalPrice = this.data.totalPrice;
    var nights = this.data.nights;
    var uid = this.data.uid;
    var img = this.data.img;
    var self = this;
    var cid = this.data.cid;
    var IDNum = this.data.ID;
    this.setData({
      nFlag: nFlag,
      tFlag: tFlag,
      personName:nameValue
    })
    // console.log(this.data.nFlag,this.data.tFlag);
    var nameEqual = (nameValue == this.data.IDname);
    if (nFlag && tFlag && nameEqual) {
      this.setData({
        isShowPay: true
      })
    if(!nameEqual){
      wx.showToast({
        title:'入住人姓名与身份证上姓名不符',
        icon:'none'
      })
    }

      // 把订单信息写入数据库
      wx.request({
        // url: 'http://xxx/addOrderInfo',
        url: 'http://xxx/addOrderInfo',
        method: 'POST',
        data: {
          person_name: nameValue,  //真实姓名 
          tel_number: telValue, //手机号
          person_num: personCount,//入住人数 
          house_name: houseName,//房子名称 
          checkin_date: checkInDate,//入住日期 
          checkout_date: checkOutDate,//离店日期 
          ID_zm: IDzm,//身份证正面 
          ID_fm: IDfm,//身份证反面 
          IDNum:IDNum,
          total_price: totalPrice,//总价 
          nights: nights,//几晚 
          uid:uid,
          img:img,
          cid:cid
        },
        header: {
          'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
        },
        success: function (res) {
          console.log(res.data.data);
          self.setData({
            id:res.data.data
          })
        }
      })
    }
  },
  // 判断手机号格式是否正确
  judgeTel(telValue) {
    var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/g;
    return (telReg.test(telValue));
  },
  // 判断姓名格式是否正确
  judgeName(nameValue) {
    var newStr = this.delTrim(nameValue);
    var nameReg = /^([\u4e00-\u9fa5·s]{3,20}|[a-zA-Z.s]{3,20})$/g;
    return (nameReg.test(newStr));
  },
  //去掉空格  str 需要去掉空格的字符串
  delTrim(str) {
    var newStr = str.split(' ').filter(function (item) {
      return item;
    }).join('')
    return newStr;
  },
  // 处理入住时间 离店时间
  handleTime(date) {
    //2020-02-27
    var month, day;
    if ((typeof date) == 'string') {
      month = date.substring(5, 7);//02
      day = date.substring(8);//27
    }
    var reg = /^0/g
    // console.log(reg.test(month));
    // console.log(reg.test(day));
    if (reg.test(month)) {
      month = month.substring(1)
    }
    if (reg.test(day)) {
      day = day.substring(1)
    }
    return `${month}月${day}日`;
  },
  // 身份证OCR识别
  success(e) {
    console.log(e);
    if (e.detail.type == 0) {//反面
      var IDfm = e.detail.image_path;
      var IDname = e.detail.name.text;
      var ID = e.detail.id.text;
      this.setData({
        IDfm: IDfm,
        IDname: IDname,
        ID
      })
      // console.log(this.data.IDname);
    } else if (e.detail.type == 1) {
      var IDzm = e.detail.image_path;
      this.setData({
        IDzm: IDzm
      })
    }
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