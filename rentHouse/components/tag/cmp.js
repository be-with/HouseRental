// components/tag/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tagList:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    curTarget:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChooseMap(e){
      // console.log(e.currentTarget.dataset.choose);
      var choose = e.currentTarget.dataset.choose;
      this.setData({
        curTarget:choose
      })
      this.triggerEvent('choosed',{
        choose
      },{})
    }
  }
})
