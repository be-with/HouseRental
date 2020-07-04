// pages/payMoney/payMoney.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//订单id
    uid: '',//用户id
    houseName: '',//房子名称
    checkInDate: '',//入住日期
    checkOutDate: '',//离开日期
    newInDate: '',//处理后的入住时间
    newOutDate: '',//处理后的离开时间
    totalPrice: '',//总价
    nights: 0,//几晚
    personNum: 0,//入住人数
    personName: '',//入住人姓名
    tel: '',//入住人手机号
    ctime: '',//订单创建时间
    isShowDetail: false,//是否展示总价格明细
    checkInDateArr: [],//入住时间数组
    isShowPay: false,
    rerent: null,
    rerentDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.item));
    var item = JSON.parse(options.item);
    var uid = item.uid;
    var id = item.id;
    var personName = item.person_name;
    var personNum = item.person_num;
    var houseName = item.house_name;
    var checkInDate = item.checkin_date;
    var checkOutDate = item.quit_date;
    var totalPrice = item.total_price;
    var nights = item.nights;
    var tel = item.tel_number;
    var ctime = item.ctime;
    var rerent = item.rerent;
    var rerentDate = item.rerent_date;
    if (item.rerent == 1) {
      totalPrice = item.rerent_price
    }
    this.setData({
      uid,
      id,
      personName,
      personNum,
      houseName,
      checkInDate,
      checkOutDate,
      totalPrice,
      nights,
      tel,
      ctime,
      rerent,
      rerentDate
    })
    this.countCheckInDateArr();
    if (item.rerent == 1) {
      checkInDate = item.quit_date;
      checkOutDate = item.rerent_date;
    }
    var newInDate = this.handleTime(checkInDate);
    var newOutDate = this.handleTime(checkOutDate);
    this.setData({
      newInDate,
      newOutDate
    })
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
    if (this.data.rerent == 1) {
      // 计算nights
      var nights = this.computedNights();
      // console.log(nights);
      var newCheckin = this.data.checkOutDate;
      console.log(newCheckin)
      var checkInDateArr = [];
      var self = this;
      (function () {
        for (var i = 0; i < nights; i++) {
          checkInDateArr.push(self.getNextDay(newCheckin, i));
        }
      })()
      this.setData({
        checkInDateArr
      });
    } else {
      var nights = parseInt(this.data.nights);//几晚
      var checkInDate = this.data.checkInDate;
      // console.log(checkInDate);
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
    }


  },
  // 得到下一天的日期
  getNextDay: function (date, i) {
    date = new Date(date);
    date = +date + 1000 * 60 * 60 * 24 * i;
    date = new Date(date);
    //格式化
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  },
  // 监听点击提交订单事件
  onSubmitTap() {
    this.setData({
      isShowPay: true
    })
  },
  // 计算几晚nights
  computedNights() {
    var rerentDate = this.data.rerentDate;
    var checkoutDate = this.data.checkOutDate;
    var disDate = Date.parse(rerentDate) - Date.parse(checkoutDate);
    var nights = Math.floor(disDate / (24 * 60 * 60 * 1000));
    this.setData({
      nights
    })
    return nights;
  },
  // 监听点击确认支付事件
  onConfirmTap() {
    // 1.更新数据库的ispay字段 0->1
    var checkInDate = this.data.checkInDate;
    var checkOutDate = this.data.checkOutDate;
    var nights = this.data.nights;
    var uid = this.data.uid;
    var id = this.data.id;
    this.setData({
      isShowPay: false
    })
    wx.navigateTo({
      url: `/pages/reserve/reserve?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&nights=${nights}`
    })
    // console.log(person_name);

    // 更新支付状态 0未支付 1已支付
    wx.request({
      // url: `http://xxx/updateOrderOfPay?id=${id}&uid=${uid}`,
      url:`http://xxx/updateOrderOfPay?id=${id}&uid=${uid}`,
      method: 'POST',
      data: {
        ispay: 1
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        console.log(res)
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