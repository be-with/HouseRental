// components/help/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    curIndex: 0,
    content: [
      {
        title: '小程序里面的房源都是真实的吗？会不会出现图片和展示房源不符合的呢？~',
        contents: '请您放心，在所有展示的房源中，房源均是实景拍摄',
        shows: false,
      },
      {
        title: '如何能快速地找到我想要的房源？',
        contents: '充分利用“E家”页面提供的搜索或筛选功能，根据您输入的条件，例如：城市、出租类型、房屋类型、房源名称等，均可帮助您快速筛选到合适房源',
        shows: false
      },
      {
        title: '可以预约房东进行线下看房吗',
        contents: '可以在房源详情页的“看房预约”，通过选择看房时间、填写姓名和手机号预约房东进行线下看房',
        shows: false
      },
      {
        title: '房东提供的房间与预订房源信息不符我该怎么办？~',
        contents: '如发现实际入住房间与房间信息描述不符时，请您及时与客服人员联系。我们会在第一时间核实情况，建议您将房东提供的房屋进行拍照存证，我们将进行调查处理',
        shows: false,
      },
      {
        title: '房东提供的房间卫生环境很差我该怎么办？',
        contents: '建议您及时与房东沟通解决，或及时与客服人员取得联系，并拍照存证，我们会在第一时间介入调解，为您解决问题',
        shows: false
      }, {
        title: '如何发布房源',
        contents: '业主认证成功后，可以在个人中心--房源管理--发布房源，根据页面提示依次填写信息，然后点击“提交”即可',
        shows: false
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showHide(e) {
      console.log(e);
      var curIndex = e.currentTarget.dataset.index;//记录当前点击的是哪个
      var content = this.data.content;
      // content.forEach((item,index)=>{
      //   if(index == clickIndex){
      //     item.shows = !item.shows;
      //     console.log(content)
      //   }
      // })
      this.setData({
        curIndex
      })
    }
  }
})
