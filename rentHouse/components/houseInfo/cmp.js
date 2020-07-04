// components/recommend/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendArr:Array,
    img:Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapSign(e){
      console.log(e);
      var index = e.currentTarget.dataset.index;
      var city = e.currentTarget.dataset.city;
      var address = e.currentTarget.dataset.address;
      var title = e.currentTarget.dataset.title;
      var startdate = e.currentTarget.dataset.startdate;
      var enddate = e.currentTarget.dataset.enddate;
      this.triggerEvent('sign',{
        index,
        city,
        title,
        address,
        startdate,
        enddate
      },{})
    }
  }
})
