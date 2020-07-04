// components/threeImg/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgArr:Array
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
    onTap(e) {
      // console.log(e.currentTarget.dataset.index);
      const index = e.currentTarget.dataset.index;
      const array = this.data.imgArr;
      wx.previewImage({
        urls: array, // 需要预览的图片http链接列表
        current: array[index], // 当前显示图片的http链接
      })
    }
  }
})
