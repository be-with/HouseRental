// pages/houseSearch/houseSearch.js
import { SearchWord } from '../../model/searchword';
import { UserModel } from '../../model/user';
import { HouseModel } from '../../model/recommend';
import arrayUtil from '../../utils/arrayUtil';
import handleImgList from '../../utils/handleImgList';
var userModel = new UserModel();
var searchWordModel = new SearchWord();
var houseModel = new HouseModel();
var Moment = require("../../utils/moment.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    houseArr: [],
    img: [],
    currentIndex: 0,
    uid: 1,
    titleList: [],//房子名称数组
    cityList: [],//房子所在城市数组
    addressList: [],//房子详细地址数组
    searchwordList:[],//搜索记录
    isShowTag:true,//默认情况下显示搜索记录标签
    isNavigate:false,//判断页面是不是从个人中心的搜索记录跳转过来的
    noHouse:false,//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUid();
    this.getSearchById();
    this.getHouseInfo();
    console.log(options);
    var value = options.searchword;   
    if(options.searchword){
      this.setData({
        isNavigate:true
      })
    }
    this.setData({
      value
    })
  },
  // 通过用户id获取搜索记录
  getSearchById(){
    var self = this;
    wx.getStorage({
      key:'user_key',
      success(res){
        // console.log(res.data.uid)
        var uid = res.data.uid;
        userModel.getSearchByUid(uid).then(res=>{
          console.log(res);
          var searchwordList =[];
          var len = res[0].u_searchword.length;
          console.log(len)
          var u_searchword = res[0].u_searchword;
          console.log(u_searchword);
          var result = u_searchword.substring(0,len-1).split(',')
          // console.log(result);//["湖里区", "52赫兹", "52赫兹", "杭州", "湖里区"]
          result = arrayUtil.frequcy(result);
          // console.log(result);
          // 52赫兹: 2
          // 杭州: 1
          // 湖里区: 2
          var times = [];
          for(var prop in result){
            times.push({
              prop:prop,
              fre:result[prop]
            });
          }
          // console.log(times)
          times = times.sort(function(a,b){
            return b.fre-a.fre;
          })
          // console.log(times);
          for(var i=0;i<times.length;i++){
            // console.log(times[i].prop);
            searchwordList.push(times[i].prop)
          }
          console.log(searchwordList)
          self.setData({
            searchwordList
          })
          // console.log(self.data.searchwordList)
        })
      }
    })
  },
  // 搜索记录跳转
  onTap(e){
    console.log(e);
    var tag = e.currentTarget.dataset.tag;
    var isShowTag = true;
    if(tag){
      this.searchHandle(tag);
      isShowTag = false;
    }
    this.setData({
      value:tag,
      isShowTag
    })
  },
  // 获取房子信息 判断搜索词符合哪个条件 再进行相应的接口调用
  getHouseInfo() {
    var titleList = [], cityList = [], addressList = [];
    var self = this;
    houseModel.getRecommend().then(res => {
      // console.log(res);
      for (var i = 0; i < res.length; i++) {
        titleList.push(res[i].title);
        cityList.push(res[i].city);
        addressList.push(res[i].address);
      }
      cityList = arrayUtil.unique(cityList);
      self.setData({
        titleList,
        cityList,
        addressList
      })
    })
  },
  // 搜索事件
  // onSearch(e) {
  //   // console.log(e);
  //   var value = e.detail.value || this.data.value;
  //   this.setData({
  //     value,
  //     isShowTag:false
  //   })
  //   this.searchHandle(value);
  // },
  // 失焦事件
  onBlur(e) {
    var value = e.detail.value || this.data.value;
    console.log(value)
    this.setData({
      value,
      isShowTag:false
    })
    this.searchHandle(value);
  },

  // 判断短租的出租结束时间与系统当前时间 出租结束时间 < 系统当前时间 => 结束出租 不显示
  // 出租结束时间 > 系统当前时间 => 出租中  显示
  judgeEndDate(res){
    var localDate = Moment(new Date()).format('YYYY-MM-DD');//系统当前时间
    var result = [];
    res.forEach(item=>{
      if(item.rtype === '短租' && (item.start_date !== '' && item.start_date !== null)){
        if(new Date(item.end_date) > new Date(localDate)){
          // console.log(item);
          result.push(item);
        }
      }else{
        result.push(item);
      }
    })
    return result;
  },

  // 统一处理搜索事件
  searchHandle(value) {
    var self = this;
    var uid = this.data.uid;
    var titleList = this.data.titleList;
    var cityList = this.data.cityList;
    var addressList = this.data.addressList;
    var titleFlag = arrayUtil.contain(titleList,value);
    var cityFlag = arrayUtil.contain(cityList,value);
    var addressFlag = arrayUtil.contain(addressList,value);
    // console.log(arrayUtil.contain(titleList,value))
    if(value){
      wx.request({
        // url: `http://xxx/updateUserOfSearch?id=${uid}`,
        url: `http://xxx/updateUserOfSearch?id=${uid}`,
        method: 'POST',
        data: {
          u_searchword: value + ","
        },
        header: {
          'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
    // console.log(value);
    // console.log(titleFlag,addressFlag,cityFlag);
    if (value && addressFlag) {
      searchWordModel.getHouseByAddr(value).then(res => {
        var result = this.judgeEndDate(res);
        // console.log(typeof result);
        if(result.length == 0){
          this.setData({
            noHouse:true
          })
        }else{
          this.setData({
            noHouse:false
          })
        }
        // console.log(res);
        var img = handleImgList.handleImgList(res);
        self.setData({
          houseArr: result,
          img
        })
      }, err => {
        console.log(err)
      })       
    }else if(value && cityFlag){
      searchWordModel.getHouseByCity(value).then(res=>{
        // console.log(res);
        var result = this.judgeEndDate(res);
        // console.log(typeof result);
        if(result.length == 0){
          this.setData({
            noHouse:true
          })
        }else{
          this.setData({
            noHouse:false
          })
        }
        var img = handleImgList.handleImgList(res);
        self.setData({
          houseArr: result,
          img
        })
      })
    } else if(value && titleFlag){
      searchWordModel.getHouseByTitle(value).then(res=>{
        var result = this.judgeEndDate(res);
        console.log(result);
        if(result.length == 0){
          this.setData({
            noHouse:true
          })
        }else{
          this.setData({
            noHouse:false
          })
        }
        console.log(res);
        var img = handleImgList.handleImgList(res);
        self.setData({
          houseArr:result,
          img
        })
      })
    }
  },
// 查看详情
onSignTap(e){
  console.log(e);
  var currentIndex = this.data.currentIndex;

  this.setData({
    currentIndex: e.detail.index
  })
  wx.navigateTo({
    url: `/pages/signing/signing?id=${e.detail.index}&city=${e.detail.city}&title=${e.detail.title}`
  })
},
// 获取用户id
getUid(){
  var self = this;
  wx.getStorage({
    key: 'USER',
    success(res) {
      // console.log(res.data.nickName);
      var nickName = res.data.nickName;
      userModel.getUserByNickName(nickName).then(res => {
        // console.log(typeof(res[0].id));
        // console.log(res);
        self.setData({
          uid: res[0].id
        })
      }, err => {
        console.log(err)
      })
    }
  })
},

// 监听输入框input事件 输入内容为空 获取所有房源
// onInput(e){
//   console.log(e);
//   var value = e.detail.value;
//   if(value == ''){

//   }
// },
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
  if(this.data.isNavigate){
    this.setData({
      isShowTag:false
    })
  } 
  setTimeout(() => {
    this.searchHandle(this.data.value);
    // console.log(this.data.titleList);   
  }, 800);
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