// pages/person/person.js

import { UserModel } from '../../model/user';
var userModel = new UserModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 用户菜单
    userArr: [
      {
        name: '搜寻历史',
        icon: 'icon-search',
        type: 'search'
      },
      {
        name: "看房行程",
        icon: 'icon-yajin',
        type: 'yajin'
      },
      {
        name: '维修申请',
        icon: 'icon-weixiu',
        type: 'weixiu'
      },
      // {
      //   name: "租金缴纳",
      //   icon: 'icon-zujin',
      //   type: 'zujinjn'
      // },
      {
        name: '缴纳记录',
        icon: 'icon-jilu',
        type: 'jilu'
      },
      {
        name: '到期提醒',
        icon: 'icon-tixing',
        type: 'tixing'
      },
      // {
      //   name: "租金日历",
      //   icon: 'icon-rili',
      //   type: 'rili'
      // },
      {
        name: '续租申请',
        icon: 'icon-xuzu',
        type: 'xuzusq'
      }, {
        name: '业主认证',
        icon: 'icon-renzheng',
        type: 'renzheng'
      }
    ],
    ownerArr: [
      {
        name: '租金调整',
        icon: 'icon-zujin',
        type: 'zujintz'
      },
      {
        name: "租金催缴提醒",
        icon: 'icon-tixing',
        type: 'tixing'
      },
      // {
      //   name: '押金返还',
      //   icon: 'icon-yajin',
      //   type: 'yajin'
      // },
      {
        name: "续租管理",
        icon: 'icon-xuzu',
        type: 'xuzugl'
      },
      {
        name: '租期到期提醒',
        icon: 'icon-tixing',
        type: 'tixing'
      },
      {
        name: '房源管理',
        icon: 'icon-fangyuan',
        type: 'fangyuan'
      },
      {
        name: "出租操作",
        icon: 'icon-chuzu',
        type: 'chuzu'
      },
      {
        name: '报修消息',
        icon: 'icon-baoxiu',
        type: 'baoxiu'
      }, 
      // {
      //   name: '我要出租',
      //   icon: 'icon-zufang',
      //   type: 'zufang'
      // }
    ],
    oType: '业主',
    aType: '管理员',
    hiddenmodalput: true,
    authorized: false,//授权
    uid: 0,
    u_authority: 1
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
        this._showToast('请先登录');
      }
    })
  },

  toggleOwnerUser: function (e) {
    var uid = this.data.uid;
    var oType = this.data.oType;
    var aType = this.data.aType;
    var oFlag = this.data.oFlag;
    var self = this;

    userModel.getUserById(uid).then(res => {
      // console.log(res);
      var authority = res[0].u_authority;
      // console.log(authority)；
      if (oType == '业主' && authority == 1) {
        wx.showToast({
          title: '您现在还不是业主',
          icon: 'none'
        })
        // oType = '用户';
      } else if (oType == '业主' && authority == 2) {
        oType = '用户'
      } else if (oType == '用户') {
        oType = '业主'
      }
      self.setData({
        oType
      })
    })

  },
  toggleAdminUser: function (e) {
    var oType = this.data.oType;
    var aType = this.data.aType;
    var hiddenmodalput = this.data.hiddenmodalput;
    if (aType == '管理员') {
      aType = '用户'
      hiddenmodalput = false;
    } else {
      // 表示当前处于管理员界面
      aType = '管理员'
      hiddenmodalput = true
    }

    this.setData({
      aType,
      hiddenmodalput: hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userAuthorized();
    this.judgeAuthority();
    this.getStorage();
  },
  // 判断是否要跳转到业主认证
  isNavigateToID(e) {
    // console.log(e);
    var menuType = e.detail.menuType;
    if (menuType == 'renzheng') {
      this.judgeAuthority()
    }
  },
  // 获取用户权限 是用户还是业主
  judgeAuthority() {
    var self = this;
    wx.getStorage({
      key: 'USER',
      success(res) {
        // console.log(res.data.nickName);
        var nickName = res.data.nickName;
        userModel.getUserByNickName(nickName).then(res => {
          // console.log(res)
          try {
            self.setData({
              u_authority: res[0].u_authority
            })
          } catch (e) {
            console.log(self.data.u_authority)
          }
        }, err => {
          console.log(err)
        })
      }
    })
  },
  // 获取用户信息并写入数据库
  onGetUserInfo(e) {
    // console.log(e);
    var userInfo = e.detail.userInfo;
    var nickName = userInfo.nickName;
    this.setData({
      userInfo,
      authorized: true
    })
    wx.setStorage({
      key: 'USER',
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
    })
    wx.request({
      // url:'http://xxx/insertUserInfo',
      url: 'http://xxx/insertUserInfo',
      method: 'POST',
      data: {
        nickName: nickName
      },
      header: {
        'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // console.log(res.data.data);
        wx.setStorage({
          key: 'user_key',
          data: {
            uid: res.data.data
          }
          // 湖里区,52赫兹,52赫兹,杭州,湖里区,
        })
      }
    })
  },
  // 获取用户权限
  userAuthorized() {
    wx.getSetting({
      success: res => {
        // console.log(res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo)
              // console.log(res.code);
              this.setData({
                userInfo: res.userInfo,
                authorized: true
              })
            }
          })
        }
      }
    })
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