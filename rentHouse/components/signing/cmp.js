// components/signing/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 轮播图部分
    swiperImg: Array,
    // 房源信息
    houseInfo: Object,
    disopose:Array,
    latitude:Number,//纬度
    longitude:Number,//经度
    hasOrder:Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 轮播图部分
    duration: 500,
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
