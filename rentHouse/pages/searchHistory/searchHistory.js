// pages/houseHistory/houseHistory.js

import {UserModel} from '../../model/user';
var userModel = new UserModel();
import arrayUtil from '../../utils/arrayUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchwordList:[],//搜索记录数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchByUid();
  },
  // 根据用户id获取搜索记录
  getSearchByUid(){
    var self = this;
    wx.getStorage({
      key:'user_key',
      success(res){
        var uid = res.data.uid;
        userModel.getSearchByUid(uid).then(res=>{
          console.log(res);
          var tagList = res[0].u_searchword;
          var len = tagList.length;
          var result = tagList.substring(0,len-1).split(',');
          result = arrayUtil.unique(result);
          self.setData({
            searchwordList:result
          })
          // console.log(self.data.searchwordList);
        })
      },
      fail(err){
        wx.showToast({
          title:'请先登录',
          icon:'none'
        })
      }
    })
  },
  // 搜素记录跳转
  onTap(e){
    console.log(e);
    var searchword = e.currentTarget.dataset.searchword;
    wx.navigateTo({
      url:`/pages/houseSearch/houseSearch?searchword=${searchword}`
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