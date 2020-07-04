// pages/publish/publish.js
import WxValidate from '../../utils/WxValidate'
import { UserModel } from '../../model/user';
var userModel = new UserModel();
var Moment = require("../../utils/moment.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    apartList: [
      {
        title: '户型',
        facilities: ['一室一厅', '三室两厅']
      }
    ],
    rentalList: [
      {
        title: '租住类型',
        facilities: ['日租', '短租']
      }
    ],
    facilities: [
      {
        pro: "kt",
        name: '空调',
        active: false
      },
      {
        pro: "wifi",
        name: 'wifi',
        active: false
      },
      {
        pro: "desk",
        name: '书桌',
        active: false
      },
      {
        pro: "yg",
        name: '衣柜',
        active: false
      },
      {
        pro: "wsj",
        name: '卫生间',
        active: false
      },
      {
        pro: "rsq",
        name: '热水器',
        active: false
      },
      {
        pro: "xyj",
        name: '洗衣机',
        active: false
      },
      {
        pro: "yyj",
        name: '油烟机',
        active: false
      },
      {
        pro: "dcl",
        name: '电磁炉',
        active: false
      },
      {
        pro: "mqz",
        name: '煤气灶',
        active: false
      },
      {
        pro: "dsj",
        name: '电视机',
        active: false
      },
      {
        pro: "sofa",
        name: '沙发',
        active: false
      },
      {
        pro: "bx",
        name: '冰箱',
        active: false
      }
    ],
    selected: [],
    rentalChoosed: '',//当前选择的租住类型
    apartChoosed: '',//当前选择的户型
    imgbox: '',//上传图片
    nFlag: true,
    // form表单
    form: {
      realName: '',
      // nickName: '',
      phone: '',
      houseName: '',
      addrDetail: '',
      rentPrice: '',
      describe: '',
      area: ''
    },
    max: 300,//textarea最多可以输入的字
    currentWordNumber: 0,//textarea当前字数
    uid: 0,
    isShowDate: false,//是否显示 date选择器(短租的起止时间)
    startDate: '',//开始时间
    endDate: '',//结束时间
    nickName: '',
    generalAdminArr:[]//普通管理员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    this.getNickName();
    this.getStorage();
    this.getGA();
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
  // 获取缓存的nickname
  getNickName() {
    var storages = wx.getStorageSync('USER');
    var nickName = storages.nickName;
    this.data.nickName = nickName;
  },
  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  //报错规则 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      realName: {
        required: true,
        minlength: 2
      },
      houseName: {
        required: true,
        minlength: 4
      },
      addrDetail: {
        required: true
      },
      rentPrice: {
        required: true,
        max: 10000,
        min: 100
      },
      describe: {
        required: true,
        maxlength: 300,
        minlength: 20
      },
      area: {
        required: true,
        max: 500,
        min: 20
      }
    }
    const messages = {
      realName: {
        required: '请填写真实姓名',
        minlength: '请输入正确的名字'
      },
      houseName: {
        required: '请填写房子名称',
        minlength: '房子名称长度最少为5位'
      },
      addrDetail: {
        required: '请填写房子的详细地址'
      },
      rentPrice: {
        required: '请填写租金',
        maxlength: '租金价格最高10000元',
        minlength: '租金价格最低100元'
      },
      describe: {
        required: '请简要描述一下你的房源'
      },
      area: {
        required: '请填写房子面积单位平方米',
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 表单提交
  formSubmit: function (e) {
    // console.log(e);
    // console.log(this.data.nickName)
    var nickName = this.data.nickName;
    var values = e.detail.value
    const params = e.detail.value;
    var days = this.computedDays();
    var startDate = '';
    var endDate = '';
    var nameFormat = this.judgeName(values.realName);
    var phoneFormat = this.judgeTel(values.phone);
    // console.log(this.data.startDate < this.data.endDate)
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    if(!nameFormat){
      this._showToast('名字格式不正确');
      return false;
    }

    if(!phoneFormat){
      this._showToast('手机号格式不正确');
      return false;
    }
    if (this.data.startDate > this.data.endDate) {//日期格式不正确
      this._showToast('日期格式不正确');
      return false;
    }
    if (this.data.rentalChoosed == '短租') {
      startDate = this.data.startDate;
      endDate = this.data.endDate;
      if (days < 15) {
        this._showToast('短租的出租起止时间不能小于15天');
        return false;
      }
    }

    this.showModal({
      msg: '提交成功'
    })
    var uid = this.data.uid;
    var realName = values.realName;
    var phone = values.phone;
    var area = values.area;
    var rentPrice = values.rentPrice;
    var houseName = values.houseName;
    var addrDetail = values.addrDetail;
    var describe = values.describe;
    var selected = this.data.selected;
    var apartChoosed = this.data.apartChoosed;
    var rentalChoosed = this.data.rentalChoosed;
    var city = this.data.region[1];
    var imgbox = this.data.imgbox;
    var newStrSel = '';
    var generalAdminArr = this.data.generalAdminArr;
    var length = generalAdminArr.length;
    console.log(this.getRandom(0,length));
    for (var i = 0; i < selected.length; i++) {
      newStrSel += selected[i] + ","
    }
    // console.log(selected,apartChoosed,rentalChoosed)
    // console.log(realName,nickName,area,rentPrice,houseName,addrDetail,describe)



    wx.request({
      // url: 'http://xxx/addHouseInfo',
      url: 'http://xxx/addHouseInfo',
      method: 'POST',
      data: {
        crealname: realName,  //真实姓名 
        cnickname: nickName, //微信名
        cid: uid,//发布者id
        tel: phone,//手机号 
        area: area,//面积 
        price: rentPrice,//租金 
        title: houseName,//房子名称title 
        address: addrDetail,//地址 
        des: describe,//描述 
        type: apartChoosed,//户型 
        rtype: rentalChoosed,//租住类型 
        disopose: newStrSel, //配置 
        city: city, //城市 
        img: imgbox,//图片
        start_date: startDate,//短租的开始出租时间
        end_date: endDate,//短租的出租结束时间
        general_admin:generalAdminArr[this.getRandom(0,length)] 
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // console.log(res);
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/houseManage/houseManage'
          })
        }, 1520);
      }
    })
  },
  // 选择省市区
  onRegionChange(e) {
    // console.log(e);
    this.setData({
      region: e.detail.value
    })
  },
  // 点击配置设施
  onChooseFacTap(e) {
    // console.log(e);
    var curIndex = e.currentTarget.dataset.index;
    var bool = this.data.facilities[curIndex].active;
    var selected = this.data.selected;
    this.setData({
      ['facilities[' + curIndex + '].active']: !bool
    })
    if (this.data.facilities[curIndex].active == true) {
      selected.push(this.data.facilities[curIndex].name)
    } else if (this.data.facilities[curIndex].active == false) {
      this.remove(selected, this.data.facilities[curIndex].name);
    }
    console.log(this.data.selected)
  },
  // 删除指定元素的数组
  remove: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  },

  // 获取当前选择的租住类型
  onRentalChoosed(e) {
    // console.log(e);
    var rentalChoosed = e.detail.choose;
    this.setData({
      rentalChoosed
    })
    if (rentalChoosed === '短租') {
      this.setData({
        isShowDate: true
      })
      this.getLocalDate();
    } else {
      this.setData({
        isShowDate: false
      })
    }
  },
  // 获取当前选择的户型
  onApartChoosed(e) {
    // console.log(e);
    var apartChoosed = e.detail.choose;
    this.setData({
      apartChoosed
    }
    )
  },

  // 监听出租的开始时间（短租）
  changeStartDate(e) {
    // console.log(e,332);
    var startDate = e.detail.value;
    this.setData({
      startDate
    })
  },

  // 监听出租的结束时间（短租）
  changeEndDate(e) {
    var endDate = e.detail.value;
    this.setData({
      endDate
    })
  },
  // 判断出租的起止时间间隔 最少要15天 
  computedDays() {
    var startDate = new Date(Date.parse(this.data.startDate.replace(/-/g, "/"))).getTime();
    var endDate = new Date(Date.parse(this.data.endDate.replace(/-/g, "/"))).getTime();
    var days = Math.abs((startDate - endDate) / (24 * 60 * 60 * 1000));
    return days;
  },
  // 删除照片
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 上传图片
  addPic1: function (e) {
    // console.log(e);
    var self = this;
    var imgbox = this.data.imgbox;
    // console.log(imgbox)
    var picid = e.currentTarget.dataset.pic;
    // console.log(picid)
    var that = this;
    var n = 6;
    if (6 > imgbox.length > 0) {
      n = 6 - imgbox.length;
    } else if (imgbox.length == 6) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[i], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              // console.log('data:image/png;base64,' + res.data)
            }
          })
        }
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (9 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);

        } else {
          imgbox[picid] = tempFilePaths[0];
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
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
  //获取普通管理员
  getGA(){
    userModel.getGeneralAdmin().then(res=>{
      // console.log(res);
      var generalAdminArr = this.data.generalAdminArr;
      res.forEach(item=>{
        generalAdminArr.push(item.u_name);
      })
      this.setData({
        generalAdminArr
      })
      console.log(generalAdminArr);
    })
  },

  // 获取系统当前日期
  getLocalDate() {
    var localDate = Moment(new Date()).format('YYYY-MM-DD');
    this.setData({
      startDate: localDate,
      endDate: localDate
    })
    // console.log(localDate);
  },
  getRandom(min, max) {
    //
    return Math.floor(Math.random() * (max - min) + min);
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