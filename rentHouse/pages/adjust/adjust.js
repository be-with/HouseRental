// pages/adjust/adjust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseInfo:{},
    form:{
      rentPrice:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // price: "306"
    // tel: "17132110498"
    var houseInfo = {
      id:options.id,
      cid:options.cid,
      crealname:options.crealname,
      cnickname:options.cnickname,
      city:options.city,
      housename:options.housename,
      address:options.address,
      area:options.area,
      tel:options.tel,
      price:options.price
    }
    this.setData({
      houseInfo
    })
  },

  // formSubmit 提交更改后的租金
  formSubmit(e){
    console.log(e);
    var self = this;
    var rentPrice = e.detail.value.rentPrice;
    var id = this.data.houseInfo.id;
    var cid = this.data.houseInfo.cid;
    if(rentPrice != ''){
      // 更新
      wx.request({
        // url: `http://xxx/updateRecommendPrice?id=${id}&cid=${cid}`,
        url: `http://xxx/updateRecommendPrice?id=${id}&cid=${cid}`,
        method: 'POST',
        data: {
          price:rentPrice
        },
        header: {
          'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
        },
        success: function (res) {
          self._showToast('提交成功');
          setTimeout(() => {
            wx.navigateBack({
              delta:1
            })
          }, 505);
        }
      })
    }

  },

  _showToast(title){
    wx.showToast({
      title:title,
      icon:'none',
      duration:500
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