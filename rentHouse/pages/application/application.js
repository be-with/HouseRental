// pages/application/application.js

var createDateArr = require('../../utils/dateArr');
var dateSelector = require("../../utils/dateSelector");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '',
    title: '',
    address: '',
    city: '',
    hasOrder:false,
    // 多列选择器
    curIndex: [0, 0, 0],//当前选中数组的下标
    rangeArray: [//pick的range
      [],
      [],
      []
    ],
    dateArray: [],
    visitTime: '',
    max: 300,//textarea最多可以输入的字
    currentWordNumber: 0,//textarea当前字数
    // form表单
    form: {
      nameValue: '',
      telValue: '',
      message: ''
    },
    nFlag: false,
    tFlag: false,
    uid: 0,//用户uid
    cid:0,//发布房子信息的id(业主id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var img = options.img;
    var title = options.title;
    var address = options.address;
    var city = options.city;
    var cid = options.cid;
    var hasOrder = options.hasOrder;
    var dateArray = dateSelector();
    this.setData({
      img,
      title,
      address,
      city,
      dateArray,
      cid,
      hasOrder
    })
    this.renderData();

    // console.log(this.data.rangeArray);
    this.getStorage();
  },

  // 获取缓存里的uid
  getStorage() {
    var self = this;
    wx.getStorage({
      key: 'user_key',
      success(res) {
        console.log(res);
        var uid = res.data.uid;
        self.setData({
          uid
        })
      },
      fail(err) {
        this._showToast('请先前往个人中心进行登录');
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/person/person`
          })
        }, 1520);
      }
    })
  },
  // 给rangeArray数组赋值
  renderData() {
    var dateArray = this.data.dateArray;
    var curIndex = this.data.curIndex;
    var rangeArray = this.data.rangeArray;
    // console.log(dateArray[curIndex[0]].hours[curIndex[1]]);
    for (var i = 0; i < dateArray.length; i++) {
      rangeArray[0].push(dateArray[i].name);
    }
    for (var j = 0; j < dateArray[curIndex[0]].hours.length; j++) {
      rangeArray[1].push(dateArray[curIndex[0]].hours[j].name);
    }
    for (var k = 0; k < dateArray[curIndex[0]].hours[curIndex[1]].minutes.length; k++) {
      rangeArray[2].push(dateArray[curIndex[0]].hours[curIndex[1]].minutes[k].name);
    }
    this.setData({
      rangeArray
    });
    var visitTime = `${rangeArray[0][curIndex[0]]} ${rangeArray[1][curIndex[1]].substring(0, 2)}:${rangeArray[2][curIndex[2]].substring(0, 2)}`
    this.setData({
      visitTime
    });
  },
  // 监听多列选择器的change事件
  onMulChange(e) {
    // console.log(e);
    this.setData({
      curIndex: e.detail.value
    })
    var curIndex = this.data.curIndex;
    var rangeArray = this.data.rangeArray;
    var visitTime;
    if (rangeArray[0][curIndex[0]] && rangeArray[1][curIndex[1]] && rangeArray[2][curIndex[2]]) {
      visitTime = `${rangeArray[0][curIndex[0]]} ${rangeArray[1][curIndex[1]].substring(0, 2)}:${rangeArray[2][curIndex[2]].substring(0, 2)}`
    }
    this.setData({
      visitTime
    })
    // console.log(this.data.visitTime);
  },
  // 多列选择器的联动事件
  onColumnchange(e) {
    // console.log(e);
    var column = e.detail.column;//滑动的是第几列
    var value = e.detail.value;//滑动到第几个值
    var dateArray = this.data.dateArray,
      curIndex = this.data.curIndex,
      rangeArray = this.data.rangeArray;
    curIndex[column] = value;
    var searchColumn = () => {
      for (var i = 0; i < dateArray.length; i++) {
        var arr1 = [];
        var arr2 = [];
        if (i == curIndex[0]) {
          for (var j = 0; j < dateArray[i].hours.length; j++) {
            arr1.push(dateArray[i].hours[j].name);
            if (j == curIndex[1]) {
              for (var k = 0; k < dateArray[i].hours[j].minutes.length; k++) {
                arr2.push(dateArray[i].hours[j].minutes[k].name);
              }
              rangeArray[2] = arr2;
            }
          }
          rangeArray[1] = arr1;
        }
      };
    }
    switch (e.detail.column) {
      case 0:
        curIndex[1] = 0;
        curIndex[2] = 0;
        searchColumn();
        break;
      case 1:
        curIndex[2] = 0;
        searchColumn();
        break;
    }
    this.setData({
      rangeArray,
      curIndex
    });
  },
  // 监听textarea的字数限制和动态变化
  onDescribeInput(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },

  // 提交表单
  formSubmit(e) {
    // console.log(e);
    var uid = this.data.uid;
    var cid = this.data.cid;
    var title = this.data.title;
    var city = this.data.city;
    var address = this.data.address;
    // 姓名 联系方式 留言(可为空)
    var personName = e.detail.value.nameValue;
    var telPhone = e.detail.value.telValue;
    var message = e.detail.value.message;
    // 看房时间
    var visitTime = this.data.visitTime;
    // console.log(personName,telPhone,message,visitTime);
    var nFlag = this.judgeName(personName);
    var tFlag = this.judgeTel(telPhone);
    this.setData({
      nFlag,
      tFlag
    })
    if (nFlag == false || personName == '') {
      this._showToast('请输入正确格式的名字!');
      return;
    }
    if (tFlag == false || telPhone == '') {
      this._showToast('请输入正确格式的联系方式！');
      return;
    }
    console.log(this.data.nFlag, this.data.tFlag);

    // 申请信息写入数据库
    wx.request({
      // url: 'http://xxx/addApplicationInfo',
      url: 'http://xxx/addApplicationInfo',
      method: 'POST',
      data: {
        uid:uid,//申请者id
        u_name: personName,  //真实姓名        
        tel: telPhone,//手机号 
        house_name:title,//房子名称
        city:city,//所在城市
        address:address,//地址
        cid:cid,//发布者id
        visit_time:visitTime,//看房时间
        message:message//留言 可为空
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        console.log(res);
        this._showToast('提交成功');
        setTimeout(() => {
          wx.reLanuch({
            url: '/pages/houseRecommendation/houseRecommendation'
          })
        }, 1510);
      }
    })
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
  // 消息提示框
  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
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