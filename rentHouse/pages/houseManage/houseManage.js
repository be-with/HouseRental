// pages/houseManage/houseManage.js

import { HouseModel } from '../../model/recommend';
var houseModel = new HouseModel();
var handleImgList = require('../../utils/handleImgList');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseArr: [],
    imgList: [],
    isShowCheckBox:false,
    disabaledAll: false,//全选
    clickAll: false,//是否点击全选按钮 默认没点击
    disabaledSingle: false,//单个
    idArr: [],//记录点击的是那条数据的id集合
    cid: 0//记录点击的那条数据的cid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHouseByCid();
  },

  // 通过cid获取房子信息
  getHouseByCid() {
    var cid = wx.getStorageSync('user_key').uid;
    houseModel.getRecommendByCid(cid).then(res => {
      console.log(res);
      var imgList = handleImgList.handleImgList(res);//二维数组
      // console.log(img);
      this.setData({
        cid,
        houseArr: res,
        imgList
      })
    })
  },

  // 监听全选框的checked状态
  checkboxAllChange: function (e) {
    // console.log(e);
    var disabaledAll = this.data.disabaledAll;
    this.setData({
      disabaledAll: !disabaledAll,
      clickAll: true
    })
    if (this.data.clickAll) {
      this.setData({
        disabaledSingle: this.data.disabaledAll
      })
    }
  },
  // 监听单个复选框的checked状态
  checkboxChange(e) {
    console.log(e);
    var item = e.currentTarget.dataset.item;
    var id = item.id;
    var cid = item.cid;
    var idArr = this.data.idArr || [];
    idArr.push(id);
    this.setData({
      disabaledAll: false,
      idArr,
      cid,
    })
  },
  // 点击确定按钮
  onConfirmTap(e) {
    var cid = this.data.cid;
    var self = this;
    var disabaledAll = this.data.disabaledAll;//是否点击了全选按钮
    var idArr = this.data.idArr;
    wx.showModal({
      title: '删除',
      content: '确定要删除吗',
      success(res) {
        if (disabaledAll) {//点击了全选按钮
          if (res.confirm) {//并点了确定 -> 删除其所有房子信息
            wx.request({
              // url: `http://xxx/delAllHouse?cid=${cid}`,
              url: `http://xxx/delAllHouse?cid=${cid}`,
              method: 'POST',
              data: {},
              header: {
                'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
              },
              success: function (res) {
                console.log(res);
                self.getHouseByCid();
                self.setData({
                  disabaledAll: false
                })
              }
            })
          }else{//点击取消
            self._showToast('已取消删除所有房源');
          }
        } else if (disabaledAll == false) {//没点击全选按钮
          if(res.confirm){//删除选中的房源信息
            // console.log(111);
            // console.log(idArr);
            wx.request({
              // url: `http://xxx/batchDelHouse?cid=${cid}`,
              url: `http://xxx/batchDelHouse?cid=${cid}`,
              method: 'POST',
              data: {
                idArr
              },
              header: {
                'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
              },
              success: function (res) {
                console.log(res);
                self.getHouseByCid();
                self.setData({
                  idArr:[],
                  disabaledSingle:false
                })
              }
            })
          }else{
            self._showToast('已取消删除房源信息');
          }
          
        }
      }
    })
  },
  // 点击发布房源信息
  onPublishTap(e){
    wx.navigateTo({
      url:'/pages/publish/publish'
    })
  },
  // 点击删除房源信息
  onDeleteTap(){
    var isShowCheckBox = this.data.isShowCheckBox;
    this.setData({
      isShowCheckBox:!isShowCheckBox
    })
  },

  _showToast(title){
    wx.showToast({
      title:title,
      icon:'none',
      duration:600
    })
  },














  // '1', '巧遇公寓1', '306', '湖里区穆厝路5号B栋1402室', '1583762517', '一室一厅', '日租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.xxdrufYciBUR64302afec2f7610b4b5f9825e8ca7895.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.u1ZI1kxqpvYE9177bc6b41c46227296bd858467af2be.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.CFwQzapu3psq390571da8dd24873b21f20ad0e2a6b5b.jpg', '厦门市', '33', '空调,wifi,电磁炉,卫生间,热水器,衣柜,冰箱,洗衣机,电视机,', '公寓位于市中心繁华的五缘湾商圈，楼下即是乐都汇和湾悦城两大购物商圈，三分钟到达厦门brt站，交通方便', '巧遇公寓', '1', '张巧巧', '17132110498'
  // '2', '52赫兹公寓', '650', '湖里区大唐五缘YOHO', '1583762611', '一室一厅', '日租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.C6zd39FcWVhv7f9f85e591df4b805e29e5234ff624f4.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.iSlxvFiSXIkz4308eff3e1998c3ece516ae296c75ce0.jpg', '厦门市', '47', '空调,wifi,衣柜,卫生间,热水器,冰箱,电视机,', '52赫兹是复式公寓是厦门的滨海酒店之一，位于市行政服务中心对面。酒店与湾悦城，天虹商场相邻，购物中心，电影院近在咫尺。酒店比邻厦门快速公交站（brt市行政服务中心站）', '52赫兹', '1', '李元媛', '15905058812'
  // '3', '珊瑚海公寓', '280', '思明区曾厝垵后厝83号', '1583762742', '一室一厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.pnDuvtvUZ7vff9fb56043be8afe4855e611f356ba8df.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.ytS8FjGnXPJvc04d03b608afe67d5d08cd086cde54da.jpg', '厦门市', '50', 'wifi,空调,热水器,卫生间,衣柜,书桌,电磁炉,洗衣机,电视机,', '珊瑚海公寓设施齐全，交通便利，服务热情，是您的温馨下榻之所', '珊瑚海', '1', '艾米丽', '18457324169'
  // '4', 'blueSky公寓', '320', '同安区西柯镇滨海西大道观洋路阳光城翡丽海岸8号楼2220号', '1583762834', '一室一厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.wcosjiPk3W872e1fd82726dc68296c60152e86d0fa57.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.gexh2P8FlT7t4cd73fa9356e668d12a790ceee3c8124.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.ONhOfytKe4Ac6dc0414cb06d2c5ccb069eaf81328a97.jpg', '厦门市', '100', '空调,wifi,衣柜,卫生间,热水器,电视机,书桌,电磁炉,洗衣机,', 'blueSky公寓客厅，卧室视野宽阔，让您早晨醒来一眼就能看到美丽的海景。出门步行即到网红彩虹马拉松跑道，方便您的晨练，五分钟步行就可到达brt东亭站，方便您的上班 ', 'blueSky', '1', '王彬焱', '15766306294'
  // '5', '柠檬公寓', '229', '下城区观巷小区', '1583762946', '三室两厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.73ttoT8gZWuD8bfa912ac80287d684f47e8e6f9603a5.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.SRra3MMQRqGz859cb043f3dc28747a5ae8b735564013.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.8hWq8IIpkskla26dc18acd5f8214fd036b127d97b720.jpg', '杭州市', '90', '空调,wifi,衣柜,卫生间,热水器,电视机,冰箱,洗衣机,', '距离杭州嘉里中心步行仅需5分钟（杭州小伙伴周末节假日必打卡之地），交通非常便捷，上班还是娱乐都非常方便', '柠檬公寓', '1', '段雨君', '18965171691'
  // '6', '唯美公寓', '300', '拱墅区星桥街与祥瑞街交叉口', '1583763043', '三室两厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.BuYvnHA7UlXk4892f4a8c8f4473afb3b395cd5d31780.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.u1jgkhsuuWh928607306b5f230df35058c03b1763272.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.UuWCPJKgCEEY465d8ef1170db8b913bf9b73c928479d.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.qab7LDuXHkTaa382163b5ae1a4de4290fe1b8433aaca.jpg', '杭州市', '82', '空调,wifi,书桌,卫生间,衣柜,热水器,电磁炉,', '紧邻万达广场和公交站，交通便捷，卧室和客厅采光良好，客厅有七米长的全景落地窗，视野极为通透', '唯美wm', '1', '李天宇', '18958071867'
  // '7', '3y栀路公寓', '320', '吉阳区海花路', '1583763150', '三室两厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.pSVgc5uOqKQOc5e49787946a416712758e48aa1ddf3a.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.xNFNAOLEK4Tx08537fa367ab87129f9bf749fa44ceb4.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.0p5xAGjsooSGa83c6a78146fc334c227f4bb8d47206d.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.SwVOXJWVvGre542736225623b5c818dbcdef68e91e4c.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.OeieNuXF9Nvjbed6421402f7973add32476b59f1dd0e.jpg', '三亚市', '140', '空调,wifi,热水器,卫生间,电磁炉,电视机,洗衣机,', '现代极简轻奢的设计风格，三个卧室都能欣赏到海景，出小区门步行到海边只需一分钟，附近有商场和公交站，非常方便', '3y栀路', '1', '何蔓诗', '17776930256'
  // '8', '太阳岛公寓', '349', '吉阳区解放路4路112号', '1583763281', '三室两厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.TQADJTmiLfBbde44fda36af721caf3e4409a1066c367.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.5dJyGIoG4gwU2945707546c7e39cdc415c35959c101d.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.AvTFf4T7PLj8277fdefb00b96e1a895c326e63481521.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.rAwJ4nWnoOueba05bb05d3f078e5d0a444d82174cf99.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.x82aFImreGkv74236da55eb041f62e8151794129916b.jpg', '三亚市', '100', '空调,wifi,衣柜,书桌,卫生间,热水器,电视机,电磁炉,', '简洁的线条，舒适的沙发，勾勒出独特的空间气质，交通便利，附近有大型商场', '太阳岛', '1', '赵梦莎', '18087286568'
  // '9', 'wenqin公寓', '240', '海棠区碧桂园齐瓦颂', '1583763377', '一室一厅', '日租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.LLNN9ryqykRo46e767160eeee72a323a23464c07fdc4.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.v6xYX1QJpyys42588e331fe82f05b51ef415052bd52a.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.FEQOP9p3RcS17ae7eb88fd2e82269db67082abc39b82.jpg', '三亚市', '60', '空调,wifi,衣柜,卫生间,热水器,电视机,洗衣机,沙发,', '北欧小清新装修风格，落地窗设计，家具家电都齐全，给你不一样的感受', 'wenqin', '1', '蔡依伶', '18554322071'
  // '10', '锦上公寓', '328', '福州市仓山区仓山万达广场200米处', '1583979921', '三室两厅', '短租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.QV5S3raQIgC256539cc52ded023f1877aa332179a53a.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.VE7GDQV4vbKcf04821f001c9a8c1adb705c98aec29d5.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.2LkJbEaKhy1L3b389ec84e1632b0a992a0af41c56edf.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.kVFpDDNEf460affc20d40abedee4df02a1a808b15d33.jpg', '福州市', '90', '空调,wifi,衣柜,卫生间,热水器,洗衣机,电视机,电磁炉,', '紧邻万达广场，步行200米即到，附近就是公交车站，离地铁站大约一公里，上班很方便。', '锦上云端', '1', '陈梦琪', '15328028081'
  // '11', '栖迟小屋', '220', '台江区洋中路洋中花园', '1583980292', '一室一厅', '日租', 'http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.5GvUJX5jHWvH332607025386b6e0bfe0accc45c3dbad.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.EE8d0ilvf2dsa1a258826794005a170ecfefe5b06044.jpg,http://tmp/wxb7b01b286db528fd.o6zAJs8M5QmEp9Xmt_cPc7qdF1v4.sMyrXTLwggvfefc78a877a7acf961a2f57fe3f1efadd.jpg', '福州市', '82', '空调,wifi,卫生间,热水器,电视机,冰箱,电磁炉,书桌,', '紧邻学校，公交站，出行非常方便，附近有商场，位置非常良好。', '栖迟境', '1', '黄如萱', '17780672344'


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