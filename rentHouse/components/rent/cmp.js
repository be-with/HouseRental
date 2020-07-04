// components/rerent/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderArr: Array
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

    // 通过
    onAgreeTap(e) {
      console.log(e)
      // console.log(e.currentTarget.dataset.ispay);
      // var ispay = e.currentTarget.dataset.ispay;
      var item = e.currentTarget.dataset.item;
      this.triggerEvent('agree', {
        // ispay,
        item
      }, {})
    },
    // 不通过
    onDisagreeTap(e) {
      console.log(e)
      // console.log(e.currentTarget.dataset.ispay);
      // var ispay = e.currentTarget.dataset.ispay;
      var item = e.currentTarget.dataset.item;
      this.triggerEvent('disagree', {
        // ispay,
        item
      }, {})
    }
  }
})
