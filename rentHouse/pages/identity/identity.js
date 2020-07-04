import WxValidate from "../../utils/WxValidate";

// pages/identity/identity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // form表单
    form: {
      realName: '',
      phone: '',
      id: '',
      pwd:''
    },
    nFlag: true,//判断姓名格式
    tFlag: true,//判断手机号格式
    IDFlag: true,//判断身份证号
    nickName:''//昵称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取缓存中的微信名nickName
    this.getNickName();
  },
  formSubmit(e) {
    console.log(e);
    var realName = e.detail.value.realName;//姓名
    var phone = e.detail.value.phone;//手机号
    var id = e.detail.value.id;//身份证号
    var pwd = e.detail.value.pwd;//密码
    if(realName == ''){
      this._showToast('请先输入姓名');
      return;
    }
    if(phone == ''){
      this._showToast('请先输入手机号');
      return;
    }
    if(id == ''){
      this._showToast('请先输入身份证号');
      return;
    }
    if(pwd == ''){
      this._showToast('请先设置后台密码');
      return;
    }
    // 判断姓名格式
    var nFlag = this.judgeName(realName);
    if (!nFlag) {
      this._showToast('请输入正确格式的姓名');
    }
    // 判断手机格式
    var tFlag = this.judgeTel(phone);
    if (!tFlag) {
      this._showToast('请输入正确格式的手机号');
    }
    if(pwd.length < 6){
      this._showToast('密码至少为6位')
    }
    // console.log(pwd);
    var IDFlag = this.judgeID(id);
    // console.log(IDFlag);
    this.setData({
      nFlag,
      tFlag,
      IDFlag
    })
    
    var nickName = this.data.nickName;
    wx.request({
      // url: `http://xxx/updateUserInfo?nickName=${nickName}`,
      url:`http://xxx/updateUserInfo?nickName=${nickName}`,
      method: 'POST',
      data: {
        u_realname:realName,
        u_tel:phone,
        u_ID:id,
        password:pwd
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // console.log(res);
        wx.reLaunch({
          url:'/pages/person/person'
        })
      }
    })
    
  },
  // 判断姓名格式是否正确
  judgeName(nameValue) {
    var newStr = this.delTrim(nameValue);
    var nameReg = /^([\u4e00-\u9fa5·s]{2,20}|[a-zA-Z.s]{2,20})$/g;
    return (nameReg.test(newStr));
  },
  //去掉空格  str 需要去掉空格的字符串
  delTrim(str) {
    var newStr = str.split(' ').filter(function (item) {
      return item;
    }).join('')
    return newStr;
  },
  // 判断手机号格式是否正确
  judgeTel(telValue) {
    var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/g;
    return (telReg.test(telValue));
  },
  // 验证身份证号合法性验证 支持15位和18位身份证号 支持地址编码、出生日期、校验位验证
  judgeID(code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var pass = true;
    var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    if (!code || !code.match(reg)) {
      this._showToast('身份证号格式错误');
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      this._showToast('地址编码错误');
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (last != code[17]) {
          this._showToast('校验位错误');
          pass = false;
        }
      }
    }
    // console.log(pass);
    return pass;
  },
  // 提示信息错误
  _showToast(title){
    wx.showToast({
      title:title,
      icon:'none'
    })
  },
  //获取缓存中的微信名nickName
  getNickName(){
    var self = this;
    wx.getStorage({
      key:'USER',
      success(res){
        // console.log(res.data.nickName)
        self.setData({
          nickName:res.data.nickName
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