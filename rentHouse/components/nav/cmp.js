// components/nav/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeArr:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedIndex:0, //当前选中的索引
    activeId:'house0'//导航条滚动
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e){
      // console.log(e.currentTarget.dataset.index);
      var index = e.currentTarget.dataset.index;
      this.setData({
        selectedIndex:index,
        activeId:`house${index === 0 ? 0 : index - 1}`
      })

      // 注册更多页面的导航条事件
      this.triggerEvent('nav',{
        index
      },{})

      // 注册订单页面的导航条事件
      this.triggerEvent('order',{
        index
      },{})
    }
  }
})
