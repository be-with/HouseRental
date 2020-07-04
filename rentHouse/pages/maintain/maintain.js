// pages/maintain/maintain.js

import { OrderModel } from '../../model/order';
import arrayUtil from '../../utils/arrayUtil';
var orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    houseNameArr: [],
    repairTypeArr: ['卧室报修', '管道报修', '客厅报修'],
    imgbox: '',//上传图片
    curIndexHouse: 0,
    changedHouse: false,//
    curIndexType: 0,
    changedType: false,
    form: {
      nameVal: '',
      telVal: '',
      content:''
    },
    houseInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage();
    setTimeout(() => {
      // var uid = this.data.uid;
      this.getDataByOrder();
    }, 500);
  },
  // 获取缓存里的uid
  getStorage() {
    var self = this;
    wx.getStorage({
      key: 'user_key',
      success(res) {
        // console.log(res);
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
  // 消息提示框
  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  // 
  getDataByOrder() {
    var uid = this.data.uid;
    var self = this;
    // 租借中 通过计算离店日期与当前日期=>比较大小 当前日期-离店日期<0 -> 租借中
    var date = this.getLocalTime();
    this.getOrderByUidAndPay(uid, 1, function (res) {
      // console.log(res);
      self.judgeRenting(res, date);
    })
  },

  // 判断订单租借中
  judgeRenting(res, date) {
    var self = this;
    var houseNameArr = [];
    var houseInfo = [];
    res.forEach(function (item) {
      if (Date.parse(date) - Date.parse(item.quit_date) < 0) {
        houseNameArr.push(item.house_name);
        houseInfo.push({name:item.house_name,cid:item.cid})
      }
    })
    // console.log(houseNameArr);
    self.setData({
      houseNameArr,
      houseInfo
    })
  },
  // 通过uid和ispay获取用户所有已付款的订单
  getOrderByUidAndPay(uid, ispay, callback) {
    orderModel.getOrderByUidAndPay(uid, ispay).then(res => {
      console.log(res);
      callback(res);
    })
  },
  // 获取系统当前时间
  getLocalTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return `${year}-${month}-${day}`
  },
  // 监听picker的change事件
  onHouseChange(e) {
    this.setData({
      curIndexHouse: e.detail.value,
      changedHouse: true
    })
    var houseNameArr = this.data.houseNameArr;
    var curIndexHouse = this.data.curIndexHouse;
    var houseName = houseNameArr[curIndexHouse];
    var uid = this.data.uid;
    // console.log(houseName);
    this.getNameAndTel(uid, houseName);
  },
  // 监听报修类型的change事件
  onTypeChange(e) {
    this.setData({
      curIndexType: e.detail.value,
      changedType: true
    })
  },

  // 通过uid和houseName 获取姓名和联系方式
  getNameAndTel(uid, houseName) {
    orderModel.getOrderByUidAndHouse(uid, houseName).then(res => {
      // console.log(res);
      this.setData({
        form: {
          nameVal: res[0].person_name,
          telVal: res[0].tel_number
        }

      })
    })
  },
  // 删除照片
  imgDelete: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 上传图片
  addPic: function (e) {
    console.log(e)
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
  // 提交
  formSubmit(e){
    // console.log(e);
    var self = this;
    var nameVal = e.detail.value.nameVal;
    var telVal = e.detail.value.telVal;
    var content = e.detail.value.content;
    var uid = this.data.uid;
    var houseName = this.data.houseNameArr[this.data.curIndexHouse];
    var repairType = this.data.repairTypeArr[this.data.curIndexType];
    var imgbox = this.data.imgbox;
    // console.log(this.data.houseInfo[this.data.curIndexHouse]);
    var houseInfo = this.data.houseInfo;
    var cid = houseInfo[this.data.curIndexHouse].cid;
    if(telVal == ''){
      this._showToast('手机号不能为空');
      return;
    }
    if(content == ''){
      this._showToast('报修内容不能为空');
    }
    if(content.length < 5){
      this._showToast('报修内容字数不能小于5');
    }
    orderModel.getOrderByUidAndHouse(uid,houseName).then(res=>{
       if(nameVal !== res[0].person_name){
         this._showToast('报修人姓名要与订单所填姓名一致');
       }else{
        //  提交表单
        wx.request({
          // url: 'http://xxx/addRepairInfo',
          url: 'http://xxx/addRepairInfo',
          method: 'POST',
          data: {
            repair_name:nameVal,
            repair_tel:telVal,
            cid,
            house_name:houseName,
            repair_type:repairType,
            content:content,
            imgs:imgbox
          },
          header: {
            'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
          },
          success: function (res) {
            console.log(res);
            self._showToast('提交成功');
          },
          fail:function(res){
            self._showToast('提交失败');
          }
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