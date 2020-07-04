// components/search/cmp.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:String
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
    onSearch(e){
      // console.log(e);
      // var value = e.detail.value || this.data.value;
      // wx.navigateTo({
      //   url:`/pages/houseSearch/houseSearch?searchword=${value}`
      // })
      // searchWord.getHouseByAddr(value).then(res=>{
      //   console.log(res)
      // },err=>{
      //   console.log(err)
      // })
      wx.hideKeyboard({
        complete: res => {
          console.log('hideKeyboard res', res)
        }
      })
      wx.navigateTo({
        url:'/pages/houseSearch/houseSearch'
      })
    },
    // onBlur(e){
    //   var value = e.detail.value;
    //   this.setData({
    //     value
    //   })
    // }
  }
})
