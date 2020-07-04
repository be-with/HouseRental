// components/moreMenu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuArr: Array,
    authority: Number
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
      console.log(e.currentTarget.dataset);
      var menuType = e.currentTarget.dataset.type;
      // 相应的页面跳转
      if (menuType == 'search') {
        wx.navigateTo({
          url: '/pages/searchHistory/searchHistory'
        })
      } else if (menuType == 'yajin') {
        wx.navigateTo({
          url: '/pages/route/route'
        })
      } else if (menuType == 'weixiu') {
        wx.navigateTo({
          url: '/pages/maintain/maintain'
        })
      } else if (menuType == 'zujin') {
        // wx.navigateTo({
        // url: '/pages/rent/rent'
        // })
      } else if (menuType == 'jilu') {
        wx.navigateTo({
          url: '/pages/record/record'
        })
      } else if (menuType == 'tixing') {
        wx.navigateTo({
          url: '/pages/remind/remind'
        })
      } else if (menuType == 'rili') {
        wx.navigateTo({
          url: '/pages/calendar/calendar'
        })
      } else if (menuType == 'xuzugl') {
        wx.navigateTo({
          url: '/pages/rerent/rerent'
        })
      } else if (menuType == 'xuzusq') {
        wx.navigateTo({
          url: '/pages/rent/rent'
        })
      } else if (menuType == 'renzheng') {
        if (this.data.authority == 1) {
          wx.navigateTo({
            url: '/pages/identity/identity'
          })
        } else {
          wx.showToast({
            title:'您已经是业主了，无需认证',
            icon:'none'
          })
        }
      }else if(menuType == 'zujintz'){
        wx.navigateTo({
          url: '/pages/myHouses/myHouses'
        })
      }else if(menuType == 'fangyuan'){
        wx.navigateTo({
          url: '/pages/houseManage/houseManage'
        })
      }else if(menuType == 'baoxiu'){
        wx.navigateTo({
          url: '/pages/repairMessage/repairMessage'
        })
      }else if(menuType == 'chuzu'){
        wx.navigateTo({
          url: '/pages/czOperate/czOperate'
        })
      }
      this.triggerEvent('toggle', {
        menuType
      }, {})
      
    }
  }
})
